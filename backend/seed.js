/**
 * Seed script — run once to populate the database
 * Usage: node seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Juice from './models/Juice.js';

await mongoose.connect(process.env.DATABASE_URI);
console.log('✅ Connected to MongoDB');

// ── Juices ────────────────────────────────────
await Juice.deleteMany({});
await Juice.insertMany([
  {
    name: 'Sunrise Orange', emoji: '🍊', category: 'immunity', sortOrder: 1,
    description: 'Fresh orange, ginger & a touch of turmeric. Your morning immunity shot in a bottle.',
    ingredients: ['Orange', 'Ginger', 'Turmeric'], benefits: 'Vitamin C, anti-inflammatory',
    tags: ['Immunity', 'Detox'], headerBg: '#fff3e0',
  },
  {
    name: 'Green Detox', emoji: '🥬', category: 'detox', sortOrder: 2,
    description: 'Spinach, cucumber, mint & lemon. Flush out toxins and start fresh every morning.',
    ingredients: ['Spinach', 'Cucumber', 'Mint', 'Lemon'], benefits: 'Liver cleanse, alkalizing',
    tags: ['Detox', 'Energy'], headerBg: 'rgba(82,183,136,0.15)',
  },
  {
    name: 'Red Power', emoji: '🍎', category: 'energy', sortOrder: 3,
    description: 'Apple, beetroot, carrot & ginger. Packed with iron and natural energy — no caffeine.',
    ingredients: ['Apple', 'Beetroot', 'Carrot', 'Ginger'], benefits: 'Iron boost, stamina',
    tags: ['Energy', 'Immunity'], headerBg: 'rgba(239,68,68,0.12)',
  },
  {
    name: 'Tropical Glow', emoji: '🍍', category: 'glow', sortOrder: 4,
    description: 'Pineapple, mango, coconut water & lime. Radiant skin starts from the inside out.',
    ingredients: ['Pineapple', 'Mango', 'Coconut Water', 'Lime'], benefits: 'Skin radiance, hydration',
    tags: ['Skin Glow', 'Immunity'], headerBg: 'rgba(249,199,79,0.15)',
  },
  {
    name: 'Antioxidant Grape', emoji: '🍇', category: 'immunity', sortOrder: 5,
    description: 'Black grapes, pomegranate & lemon. Rich in resveratrol and antioxidants for heart health.',
    ingredients: ['Black Grapes', 'Pomegranate', 'Lemon'], benefits: 'Heart health, antioxidants',
    tags: ['Immunity', 'Detox'], headerBg: 'rgba(139,92,246,0.12)',
  },
  {
    name: 'Coconut Cool', emoji: '🥥', category: 'energy', sortOrder: 6,
    description: "Fresh coconut water, mint & cucumber. Pure hydration — nature's sports drink.",
    ingredients: ['Coconut Water', 'Mint', 'Cucumber'], benefits: 'Hydration, electrolytes',
    tags: ['Detox', 'Energy'], headerBg: 'rgba(59,130,246,0.1)',
  },
  {
    name: 'Golden Heal', emoji: '🫚', category: 'immunity', sortOrder: 7,
    description: 'Turmeric, black pepper, ginger & orange. Anti-inflammatory powerhouse.',
    ingredients: ['Turmeric', 'Black Pepper', 'Ginger', 'Orange'], benefits: 'Anti-inflammatory, gut health',
    tags: ['Immunity', 'Glow'], headerBg: 'rgba(234,179,8,0.15)',
  },
  {
    name: 'Lemon Zing', emoji: '🍋', category: 'detox', sortOrder: 8,
    description: 'Lemon, cucumber, mint & a pinch of pink salt. Alkalizing and refreshing.',
    ingredients: ['Lemon', 'Cucumber', 'Mint', 'Pink Salt'], benefits: 'Alkalizing, detox',
    tags: ['Detox', 'Skin Glow'], headerBg: 'rgba(250,204,21,0.12)',
  },
]);
console.log('✅ Juices seeded (8 blends)');

// ── Admin user ────────────────────────────────
const existingAdmin = await User.findOne({ phone: '9000000000' });
if (!existingAdmin) {
  await User.create({
    name: 'Admin',
    phone: '9000000000',
    address: 'JuiceMorning HQ, Mumbai',
    password: 'admin123',
    role: 'admin',
  });
  console.log('✅ Admin created  | phone: 9000000000 | password: admin123');
} else {
  console.log('ℹ️  Admin already exists');
}

// ── Demo delivery boy ─────────────────────────
const existingBoy = await User.findOne({ phone: '9111111111' });
if (!existingBoy) {
  await User.create({
    name: 'Raju Delivery',
    phone: '9111111111',
    address: 'Andheri West, Mumbai',
    password: 'delivery123',
    role: 'delivery',
  });
  console.log('✅ Delivery boy created | phone: 9111111111 | password: delivery123');
} else {
  console.log('ℹ️  Delivery boy already exists');
}

await mongoose.disconnect();
console.log('\n🎉 Seeding complete!');
