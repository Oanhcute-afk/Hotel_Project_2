import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: String },
  hotelId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  subTotal: { type: Number },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number },
  totalPrice: { type: Number, required: true },
  invoiceNumber: { type: String },
  voucherCode: { type: String },
  status: { type: String, default: 'pending' },
  paymentMethod: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
