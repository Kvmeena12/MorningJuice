import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.DB_URI);

  const existing = await User.findOne({ phone: '6375292488' });

  if (existing) {
    console.log('⚠️ Admin already exists');
    return;
  }

  const admin = new User({
    name: 'Admin',
    phone: '6375292488',
    password: 'Kunj@1234',
    role: 'admin',

    // 👇 IMPORTANT (required fields)
    address: 'Admin Office',
    pincode: '000000',
    area: 'System'
  });

  await admin.save();

  console.log('✅ Admin created');

  await mongoose.disconnect();
}

createAdmin();