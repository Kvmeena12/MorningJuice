import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders/my  — customer's own orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ deliveryDate: -1 })
      .limit(60);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/upcoming — next 7 days orders for customer
router.get('/upcoming', protect, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const next7 = new Date(today); next7.setDate(next7.getDate() + 7);
    const orders = await Order.find({
      userId: req.user._id,
      deliveryDate: { $gte: today, $lte: next7 },
    }).sort({ deliveryDate: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
