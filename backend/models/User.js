import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    phone:    { type: String, required: true, unique: true, trim: true },
    email:    { type: String, trim: true, lowercase: true },
    address:  { type: String, required: true },
    pincode:  { type: String, required: true },
    area:     { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    password: { type: String, required: true },
    role:     { type: String, enum: ['customer', 'delivery', 'admin'], default: 'customer' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);