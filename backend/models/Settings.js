import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    label: { type: String }, // human readable label for admin UI
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);

import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: String,
  days: Number,
  price: Number
});

const settingsSchema = new mongoose.Schema({
  plans: [planSchema]
});

export default mongoose.model('Settings', settingsSchema);