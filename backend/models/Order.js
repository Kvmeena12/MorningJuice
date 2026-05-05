import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    subscriptionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryBoyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deliveryDate:    { type: Date, required: true },
    juiceType:       { type: String, required: true },
    quantity:        { type: Number, default: 1 },
    deliveryAddress: { type: String },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    otp:           { type: String },
    otpVerifiedAt: { type: Date },
    deliveredAt:   { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
