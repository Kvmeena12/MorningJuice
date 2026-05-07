import mongoose from 'mongoose';

const juiceScheduleSchema = new mongoose.Schema(
  {
    juice: { type: String, required: true },
    emoji: { type: String, default: '🥤' },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema({
  key:      { type: String, required: true },
  label:    { type: String, required: true },
  name:     { type: String },
  days:     { type: Number, required: true },
  price:    { type: Number, required: true },
  emoji:    { type: String, default: '🥤' },
  color:    { type: String, default: 'orange' },
  popular:  { type: Boolean, default: false },
  features: { type: [String], default: [] },
  schedule: {
    fruit:     { type: [juiceScheduleSchema], default: [] },
    vegetable: { type: [juiceScheduleSchema], default: [] },
    mix:       { type: [juiceScheduleSchema], default: [] },
  },
});

const settingsSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    label: { type: String },
    plans: [planSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);