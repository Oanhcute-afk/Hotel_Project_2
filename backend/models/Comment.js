import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  hotelId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  rating: { type: Number, default: 0 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
