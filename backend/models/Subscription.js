import mongoose from 'mongoose';

const dayScheduleSchema = new mongoose.Schema(
  {
    day:       { type: String, enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] },
    enabled:   { type: Boolean, default: true },
    juiceType: { type: String, default: 'Rotate Daily' },
  },
  { _id: false }
);

const subscriptionSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planType:       { type: String, enum: ['weekly', '10day', 'monthly'], required: true },
    bottlesPerDay:  { type: Number, default: 1, min: 1, max: 4 },
    weeklySchedule: [dayScheduleSchema],
    skippedDates: [{ type: Date }],   // ← ADD THIS LINE
    startDate:      { type: Date, required: true },
    endDate:        { type: Date, required: true },
    totalAmount:    { type: Number, required: true },
    status:         { type: String, enum: ['active', 'paused', 'cancelled', 'expired'], default: 'active' },
    paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId:      { type: String },
    razorpayOrderId:{ type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
