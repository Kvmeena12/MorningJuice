import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const getRazorpay = () =>
  new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const DAY_NAMES = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

async function generateOrders(subscription, user) {
  const orders = [];
  const start = new Date(subscription.startDate);
  const end   = new Date(subscription.endDate);
  const cur   = new Date(start);

  while (cur <= end) {
    const dayName = DAY_NAMES[cur.getDay()];
    const sched   = subscription.weeklySchedule.find(s => s.day === dayName);
    const enabled   = sched ? sched.enabled : true;
    const juiceType = (sched && sched.juiceType) ? sched.juiceType : 'Rotate Daily';

    if (enabled) {
      orders.push({
        subscriptionId:  subscription._id,
        userId:          subscription.userId,
        deliveryDate:    new Date(cur),
        juiceType,
        quantity:        subscription.bottlesPerDay,
        deliveryAddress: user.address,
        otp:             String(Math.floor(1000 + Math.random() * 9000)),
        status:          'pending',
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  if (orders.length) await Order.insertMany(orders);
}

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    // Validate keys are present
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file.' });
    }

    const sub = await Subscription.findOne({ _id: subscriptionId, userId: req.user._id });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    const razorpay = getRazorpay();

    // receipt max 40 chars — use last 8 chars of ID
    const shortId = String(sub._id).slice(-8);
    const receipt = `jm_${shortId}`;

    const order = await razorpay.orders.create({
      amount:   sub.totalAmount * 100, // paise
      currency: 'INR',
      receipt,
      notes:    { subscriptionId: String(sub._id), userId: String(req.user._id) },
    });

    sub.razorpayOrderId = order.id;
    await sub.save();

    res.json({
      orderId:  order.id,
      amount:   sub.totalAmount,
      currency: 'INR',
      key:      process.env.RAZORPAY_KEY_ID,
      name:     req.user.name,
      phone:    req.user.phone,
    });
  } catch (err) {
    console.error('❌ Razorpay create-order error:', err);
    res.status(500).json({ error: err.message || 'Payment initiation failed' });
  }
});

// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;

    // Signature verification
    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment signature mismatch. Please contact support.' });
    }

    const sub = await Subscription.findOne({ _id: subscriptionId, userId: req.user._id });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    // Prevent double-processing if already paid
    if (sub.paymentStatus === 'paid') {
      return res.json({ message: 'Already activated', subscription: sub });
    }

    sub.paymentStatus   = 'paid';
    sub.paymentId       = razorpay_payment_id;
    sub.razorpayOrderId = razorpay_order_id;
    sub.status          = 'active';
    await sub.save();

    // Delete any accidental orders created before payment, then generate fresh
    await Order.deleteMany({ subscriptionId: sub._id });
    const user = await User.findById(req.user._id);
    await generateOrders(sub, user);

    res.json({ message: 'Payment verified. Subscription active!', subscription: sub });
  } catch (err) {
    console.error('❌ Razorpay verify error:', err);
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
});

export default router;