import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userName: { type: String }, // cached for easy rendering
  userAvatar: { type: String },
  replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    userAvatar: { type: String },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
