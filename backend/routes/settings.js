import express from 'express';
import Settings from '../models/Settings.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Default pricing fallback
export const DEFAULT_PRICING = {
  weekly:  { label: 'Weekly Plan',  days: 7,  price: 699  },
  '10day': { label: '10-Day Plan',  days: 10, price: 899  },
  monthly: { label: 'Monthly Plan', days: 30, price: 2399 },
};

// GET /api/settings/pricing  — PUBLIC (frontend needs this)
router.get('/pricing', async (req, res) => {
  try {
    const doc = await Settings.findOne({ key: 'pricing' });
    res.json(doc ? doc.value : DEFAULT_PRICING);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/settings/pricing  — ADMIN only
router.put('/pricing', protect, adminOnly, async (req, res) => {
  try {
    const weekly = req.body.weekly;
    const tenday = req.body['10day'] || req.body['15day'];
    const monthly = req.body.monthly;

    // Validate
    const plans = { weekly, '10day': tenday, monthly };
    for (const [key, plan] of Object.entries(plans)) {
      if (!plan || typeof plan.price !== 'number' || plan.price < 1) {
        return res.status(400).json({ error: `Invalid price for ${key} plan` });
      }
    }

    const updated = await Settings.findOneAndUpdate(
      { key: 'pricing' },
      { key: 'pricing', value: plans, label: 'Subscription Pricing' },
      { upsert: true, new: true }
    );

    res.json({ message: 'Pricing updated successfully ✅', pricing: updated.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings/all  — admin only, all settings
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const all = await Settings.find({});
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
// GET /api/settings/reset-pricing  — reset to defaults
router.get('/reset-pricing', async (req, res) => {
  try {
    await Settings.findOneAndUpdate(
      { key: 'pricing' },
      { key: 'pricing', value: {
        weekly:  { label: 'Weekly Plan',  days: 7,  price: 699  },
        '10day': { label: '10-Day Plan',  days: 10, price: 899  },
        monthly: { label: 'Monthly Plan', days: 30, price: 2399 },
      }},
      { upsert: true }
    );
    res.json({ message: 'Pricing reset to defaults ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

