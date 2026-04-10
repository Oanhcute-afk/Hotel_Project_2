import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  category: { type: String, default: 'Chung' },
  description: { type: String, default: 'Áp dụng cho tất cả các khách sạn thuộc hệ thống AquaStays.' },
  expiryDate: { type: String, default: 'Kéo dài suốt năm 2026' },
  type: { type: String, required: true, enum: ['percent', 'fixed'] },
  value: { type: Number, required: true },
  maxDiscount: { type: Number },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Voucher', voucherSchema);
