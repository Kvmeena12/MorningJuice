import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/orders  — all orders with optional date filter
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) {
      const d = new Date(req.query.date); d.setHours(0,0,0,0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.deliveryDate = { $gte: d, $lt: next };
    }
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('userId', 'name phone address')
      .populate('deliveryBoyId', 'name phone')
      .sort({ deliveryDate: 1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/assign  — assign order to delivery boy
router.post('/assign', protect, adminOnly, async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryBoyId, status: 'assigned' },
      { new: true }
    )
      .populate('userId', 'name phone address')
      .populate('deliveryBoyId', 'name phone');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order assigned', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/delivery-boys
router.get('/delivery-boys', protect, adminOnly, async (req, res) => {
  try {
    const boys = await User.find({ role: 'delivery' }).select('-password');
    res.json(boys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/create-delivery-boy
router.post('/create-delivery-boy', protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;
    if (await User.findOne({ phone }))
      return res.status(409).json({ error: 'Phone already registered' });

    const user = await User.create({ name, phone, address, password, role: 'delivery' });
    res.status(201).json({ message: 'Delivery boy created', user: { id: user._id, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalCustomers, activeSubscriptions, todayOrders, todayDelivered] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Subscription.countDocuments({ status: 'active', paymentStatus: 'paid' }),
      Order.countDocuments({ deliveryDate: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments({ deliveryDate: { $gte: today, $lt: tomorrow }, status: 'delivered' }),
    ]);

    res.json({ totalCustomers, activeSubscriptions, todayOrders, todayDelivered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
