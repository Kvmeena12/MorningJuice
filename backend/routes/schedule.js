import express from 'express';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import Juice from '../models/Juice.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/schedule/juices — available juices for dropdown
router.get('/juices', async (req, res) => {
  try {
    const juices = await Juice.find({ available: true }).select('name category').sort('name');
    res.json(juices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/schedule/my — get active subscription's weekly schedule
router.get('/my', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
      paymentStatus: 'paid',
    });
    if (!sub) return res.status(404).json({ error: 'No active subscription' });
    res.json({
      weeklySchedule: sub.weeklySchedule,
      skippedDates:   sub.skippedDates,
      planType:       sub.planType,
      endDate:        sub.endDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/schedule/update — save weekly juice schedule
router.put('/update', protect, async (req, res) => {
  try {
    const { weeklySchedule } = req.body;
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
      paymentStatus: 'paid',
    });
    if (!sub) return res.status(404).json({ error: 'No active subscription' });

    sub.weeklySchedule = weeklySchedule;
    await sub.save();

    // Regenerate future pending orders with new juice types
    const today = new Date(); today.setHours(0, 0, 0, 0);
    await Order.deleteMany({ subscriptionId: sub._id, status: 'pending', deliveryDate: { $gte: today } });

    const DAY_NAMES = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const orders = [];
    const cur = new Date(today);
    const end = new Date(sub.endDate);

    while (cur <= end) {
      const dayName  = DAY_NAMES[cur.getDay()];
      const sched    = weeklySchedule.find(s => s.day === dayName);
      const enabled  = sched ? sched.enabled : true;
      const juice    = sched?.juiceType || 'Rotate Daily';

      // Skip if in skippedDates
      const isSkipped = sub.skippedDates?.some(d =>
        new Date(d).toDateString() === cur.toDateString()
      );

      if (enabled && !isSkipped) {
        orders.push({
          subscriptionId:  sub._id,
          userId:          sub.userId,
          deliveryDate:    new Date(cur),
          juiceType:       juice,
          quantity:        sub.bottlesPerDay,
          otp:             String(Math.floor(1000 + Math.random() * 9000)),
          status:          'pending',
        });
      }
      cur.setDate(cur.getDate() + 1);
    }

    if (orders.length) await Order.insertMany(orders);
    res.json({ message: 'Schedule saved ✅', weeklySchedule: sub.weeklySchedule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/schedule/skip — skip a delivery day
router.post('/skip', protect, async (req, res) => {
  try {
    const { date } = req.body; // "2026-05-06"
    if (!date) return res.status(400).json({ error: 'Date required' });

    const deliveryDate = new Date(date);
    deliveryDate.setHours(6, 0, 0, 0); // delivery at 6 AM

    // Cutoff = 12 hours before delivery = previous day 6 PM
    const cutoff = new Date(deliveryDate.getTime() - 12 * 60 * 60 * 1000);
    const now    = new Date();

    if (now >= cutoff) {
      return res.status(400).json({
        error: `Skip not allowed. Cutoff was ${cutoff.toLocaleString('en-IN')}`,
      });
    }

    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
      paymentStatus: 'paid',
    });
    if (!sub) return res.status(404).json({ error: 'No active subscription' });

    // Add to skippedDates (avoid duplicate)
    const alreadySkipped = sub.skippedDates?.some(d =>
      new Date(d).toDateString() === deliveryDate.toDateString()
    );
    if (alreadySkipped) return res.status(400).json({ error: 'Already skipped this day' });

    sub.skippedDates = [...(sub.skippedDates || []), deliveryDate];
    await sub.save();

    // Cancel the order for that day
    await Order.updateMany(
      { subscriptionId: sub._id, deliveryDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) }, status: 'pending' },
      { status: 'cancelled' }
    );

    res.json({ message: `Delivery skipped for ${deliveryDate.toDateString()} ✅` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/schedule/unskip — undo a skip
router.post('/unskip', protect, async (req, res) => {
  try {
    const { date } = req.body;
    const deliveryDate = new Date(date);
    const cutoff = new Date(deliveryDate.setHours(6,0,0,0) - 12*60*60*1000);

    if (new Date() >= cutoff) {
      return res.status(400).json({ error: 'Cannot unskip — cutoff passed' });
    }

    const sub = await Subscription.findOne({ userId: req.user._id, status: 'active', paymentStatus: 'paid' });
    if (!sub) return res.status(404).json({ error: 'No active subscription' });

    sub.skippedDates = sub.skippedDates.filter(d =>
      new Date(d).toDateString() !== new Date(date).toDateString()
    );
    await sub.save();

    // Restore order for that day
    const DAY_NAMES = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const d = new Date(date);
    const dayName = DAY_NAMES[d.getDay()];
    const sched   = sub.weeklySchedule?.find(s => s.day === dayName);
    const juice   = sched?.juiceType || 'Rotate Daily';

    await Order.create({
      subscriptionId: sub._id,
      userId: sub.userId,
      deliveryDate: new Date(date),
      juiceType: juice,
      quantity: sub.bottlesPerDay,
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'pending',
    });

    res.json({ message: 'Skip removed ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;