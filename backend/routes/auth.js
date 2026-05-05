import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, address, pincode, area, location, password } = req.body;
    if (!name || !phone || !address || !pincode || !password)
      return res.status(400).json({ error: 'All fields required' });

    if (await User.findOne({ phone }))
      return res.status(409).json({ error: 'Phone number already registered' });

    const user = await User.create({ 
  name, phone, email, address, 
  pincode, area, location,   // ← ADD
  password 
});
    const token = signToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ error: 'Phone and password required' });

    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid phone or password' });

    const token = signToken(user._id);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
