import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// GET plans
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings?.plans || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE plans (from admin)
router.post('/', async (req, res) => {
  try {
    const { plans } = req.body;

    await Settings.updateOne(
      {},
      { plans },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;