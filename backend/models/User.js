import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Tùy chọn đối với người dùng đăng nhập bằng Google
  username: { type: String, required: true },
  dob: { type: String },
  citizenId: { type: String },
  phone: { type: String },
  address: { type: String },
  avatar: { type: String, default: '' },
  firebaseUid: { type: String }, // Tùy chọn, để liên kết với người dùng Firebase hiện có
  role: { type: String, enum: ['customer', 'manager', 'admin'], default: 'customer' },
  lastLogin: { type: Date },
  favorites: [{ type: String }] // Mảng chứa idStr của các khách sạn yêu thích
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Phương thức kiểm tra mật khẩu
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
