/**
 * reset-admin.js
 * Run this once to fix/create the admin account
 * Usage: node reset-admin.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

console.log('🔧 Connecting to MongoDB...');
await mongoose.connect(process.env.DB_URI);
console.log('✅ Connected\n');

// Delete old admin (in case password was corrupted)
const deleted = await User.deleteOne({ phone: '9000000000' });
if (deleted.deletedCount > 0) {
  console.log('🗑️  Old admin account removed');
}

// Create fresh admin — password will be bcrypt hashed by User model
const admin = await User.create({
  name:     'Admin',
  phone:    '9000000000',
  address:  'JuiceMorning HQ, Mumbai',
  password: 'admin123',
  role:     'admin',
});

console.log('\n✅ Admin account created fresh!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   Phone    : 9000000000');
console.log('   Password : admin123');
console.log('   Role     : admin');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Verify login works
const found = await User.findOne({ phone: '9000000000' });
const ok    = await found.comparePassword('admin123');
console.log(ok ? '✅ Password verification: PASSED — login will work!' : '❌ Password verification: FAILED — check bcrypt');

await mongoose.disconnect();
console.log('\n🎉 Done! Now open admin panel and login.');