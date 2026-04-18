import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google Login users
  username: { type: String, required: true },
  dob: { type: String },
  citizenId: { type: String },
  phone: { type: String },
  address: { type: String },
  avatar: { type: String, default: '' },
  firebaseUid: { type: String }, // optional, to link existing firebase users
  role: { type: String, enum: ['customer', 'manager', 'admin'], default: 'customer' },
  lastLogin: { type: Date },
  favorites: [{ type: String }] // array of hotel idStr
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to test password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
