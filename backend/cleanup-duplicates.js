/**
 * cleanup-duplicates.js
 * Removes duplicate orders for same subscription + same date
 * Run ONCE: node cleanup-duplicates.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';

await mongoose.connect(process.env.DB_URI);
console.log('✅ Connected to MongoDB\n');

const Order = mongoose.model('Order', new mongoose.Schema({
  subscriptionId: mongoose.Schema.Types.ObjectId,
  userId:         mongoose.Schema.Types.ObjectId,
  deliveryDate:   Date,
  juiceType:      String,
  quantity:       Number,
  deliveryAddress:String,
  otp:            String,
  status:         String,
}, { timestamps: true }));

// Find all duplicates: same subscriptionId + same deliveryDate
const duplicates = await Order.aggregate([
  {
    $group: {
      _id:   { subscriptionId: '$subscriptionId', deliveryDate: '$deliveryDate' },
      ids:   { $push: '$_id' },
      count: { $sum: 1 },
    },
  },
  { $match: { count: { $gt: 1 } } },
]);

console.log(`Found ${duplicates.length} dates with duplicate orders\n`);

let deletedTotal = 0;
for (const dup of duplicates) {
  // Keep the first (oldest), delete the rest
  const [keep, ...remove] = dup.ids;
  await Order.deleteMany({ _id: { $in: remove } });
  deletedTotal += remove.length;
  console.log(`  Date ${dup._id.deliveryDate?.toDateString()} — kept 1, deleted ${remove.length}`);
}

console.log(`\n✅ Cleanup done! Deleted ${deletedTotal} duplicate orders.`);
console.log('Restart your backend server now.\n');

await mongoose.disconnect();