import express from 'express';
import Juice from '../models/Juice.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/juices — public
router.get('/', async (req, res) => {
  try {
    const filter = { available: true };
    if (req.query.category) filter.category = req.query.category;
    const juices = await Juice.find(filter).sort('sortOrder');
    res.json(juices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/juices — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const juice = await Juice.create(req.body);
    res.status(201).json(juice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
