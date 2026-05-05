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
