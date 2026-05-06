import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

const DEFAULT_PLANS = [
  {
    key: 'weekly',
    label: 'Weekly',
    days: 7,
    price: 699,
    emoji: '🍊',
    popular: false,
    features: [
      '7 fresh bottles',
      'Morning delivery (6–8 AM)',
      'Customise daily juice',
      'Pause anytime',
    ],
  },
  {
    key: '10day',
    label: '10-Day',
    days: 10,
    price: 899,
    emoji: '🥬',
    popular: true,
    features: [
      '10 fresh bottles',
      'Morning delivery (6–8 AM)',
      'Customise daily juice',
      'Pause anytime',
      'Save ₹90 vs weekly',
    ],
  },
  {
    key: 'monthly',
    label: 'Monthly',
    days: 30,
    price: 2399,
    emoji: '🌿',
    popular: false,
    features: [
      '30 fresh bottles',
      'Morning delivery (6–8 AM)',
      'Customise daily juice',
      'Pause anytime',
      'Save ₹596',
      'Priority support',
    ],
  },
];

// GET plans
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne({ key: 'plans' });
    res.json(settings?.plans?.length ? settings.plans : DEFAULT_PLANS);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE plans (from admin)
router.post('/', async (req, res) => {
  try {
    const { plans } = req.body;

    await Settings.updateOne(
      { key: 'plans' },
      { key: 'plans', label: 'Subscription Plans', plans },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;