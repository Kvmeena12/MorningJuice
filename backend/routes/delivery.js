import express from 'express';
import Order from '../models/Order.js';
import { protect, deliveryOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/delivery/today  — today's orders for logged-in delivery boy
router.get('/today', protect, deliveryOnly, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await Order.find({
      deliveryBoyId: req.user._id,
      deliveryDate:  { $gte: today, $lt: tomorrow },
    })
      .populate('userId', 'name phone address')
      .sort({ status: 1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/delivery/stats
router.get('/stats', protect, deliveryOnly, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, delivered] = await Promise.all([
      Order.countDocuments({ deliveryBoyId: req.user._id, deliveryDate: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments({ deliveryBoyId: req.user._id, deliveryDate: { $gte: today, $lt: tomorrow }, status: 'delivered' }),
    ]);

    res.json({ total, delivered, pending: total - delivered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/delivery/order/:id/status  — update status (assigned → out_for_delivery)
router.patch('/order/:id/status', protect, deliveryOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['out_for_delivery', 'cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ error: 'Invalid status transition' });

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, deliveryBoyId: req.user._id },
      { status },
      { new: true }
    ).populate('userId', 'name phone address');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Status updated', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/delivery/verify-otp  — OTP verification → mark delivered
router.post('/verify-otp', protect, deliveryOnly, async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    if (!orderId || !otp)
      return res.status(400).json({ error: 'orderId and otp are required' });

    const order = await Order.findOne({ _id: orderId, deliveryBoyId: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status === 'delivered')
      return res.status(400).json({ error: 'Order already delivered' });

    if (order.otp !== String(otp).trim())
      return res.status(400).json({ error: 'Invalid OTP. Please ask customer again.' });

    order.status        = 'delivered';
    order.otpVerifiedAt = new Date();
    order.deliveredAt   = new Date();
    await order.save();

    res.json({ message: '✅ Order delivered successfully!', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
