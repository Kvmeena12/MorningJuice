import mongoose from 'mongoose';

const juiceSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true },
    emoji:       { type: String, default: '🥤' },
    category:    { type: String, enum: ['immunity', 'detox', 'energy', 'glow'], required: true },
    description: { type: String },
    ingredients: [String],
    benefits:    { type: String },
    tags:        [String],
    headerBg:    { type: String, default: '#fff3e0' },
    available:   { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Juice', juiceSchema);
