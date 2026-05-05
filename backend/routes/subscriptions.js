import express from 'express';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const DEFAULT_PRICING = {
  weekly:  { days: 7,  price: 699  },
  '10day': { days: 10, price: 899  },
  monthly: { days: 30, price: 2399 },
};

async function getPricing() {
  try {
    const doc = await Settings.findOne({ key: 'pricing' });
    return doc ? doc.value : DEFAULT_PRICING;
  } catch {
    return DEFAULT_PRICING;
  }
}

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
      const otp = String(Math.floor(1000 + Math.random() * 9000));
      orders.push({
        subscriptionId:  subscription._id,
        userId:          subscription.userId,
        deliveryDate:    new Date(cur),
        juiceType,
        quantity:        subscription.bottlesPerDay,
        deliveryAddress: user.address,
        otp,
        status: 'pending',
      });
    }
    cur.setDate(cur.getDate() + 1);
  }

  if (orders.length) await Order.insertMany(orders);
}

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// POST /api/subscriptions  — create subscription (payment pending)
router.post('/', protect, async (req, res) => {
  try {
    const { planType, bottlesPerDay = 1, weeklySchedule = [], startDate } = req.body;

    const pricing = await getPricing();
    const plan = pricing[planType];
    if (!plan) return res.status(400).json({ error: 'Invalid plan type' });

    const start = new Date(startDate || Date.now());
    const end   = new Date(start);
    end.setDate(end.getDate() + plan.days - 1);

    const totalAmount = plan.price * bottlesPerDay;

    const subscription = await Subscription.create({
      userId: req.user._id,
      planType,
      bottlesPerDay,
      weeklySchedule,
      startDate: start,
      endDate: end,
      totalAmount,
      status: 'active',
      paymentStatus: 'pending',
    });

    res.status(201).json({ message: 'Subscription created', subscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscriptions/my
router.get('/my', protect, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscriptions/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/subscriptions/:id/schedule  — update weekly juice schedule
router.put('/:id/schedule', protect, async (req, res) => {
  try {
    const { weeklySchedule } = req.body;
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { weeklySchedule },
      { new: true }
    );
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    // Re-generate future undelivered orders
    await Order.deleteMany({
      subscriptionId: sub._id,
      status: 'pending',
      deliveryDate: { $gte: new Date() },
    });
    const user = await User.findById(req.user._id);
    await generateOrders(sub, user);

    res.json({ message: 'Schedule updated and orders regenerated', subscription: sub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/subscriptions/:id/toggle  — pause / resume
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    sub.status = sub.status === 'active' ? 'paused' : 'active';
    await sub.save();
    res.json({ message: `Subscription ${sub.status}`, subscription: sub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/subscriptions/:id/activate  — called after payment success
router.post('/:id/activate', protect, async (req, res) => {
  try {
    const { paymentId, razorpayOrderId } = req.body;
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sub) return res.status(404).json({ error: 'Subscription not found' });

    if (sub.paymentStatus === 'paid') {
      return res.json({ message: 'Already activated', subscription: sub });
    }

    sub.paymentStatus   = 'paid';
    sub.paymentId       = paymentId;
    sub.razorpayOrderId = razorpayOrderId;
    sub.status          = 'active';
    await sub.save();

    await Order.deleteMany({ subscriptionId: sub._id });
    const user = await User.findById(req.user._id);
    await generateOrders(sub, user);

    res.json({ message: 'Subscription activated, orders generated', subscription: sub });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;