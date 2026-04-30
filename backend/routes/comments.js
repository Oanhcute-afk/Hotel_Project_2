import express from 'express';
import Comment from '../models/Comment.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lấy tất cả bình luận cho một khách sạn cụ thể, bao gồm cả các phản hồi lồng nhau
router.get('/:hotelId', async (req, res) => {
  try {
    const comments = await Comment.find({ hotelId: req.params.hotelId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// Đăng một bình luận hoặc phản hồi mới
router.post('/', protect, async (req, res) => {
  try {
    const { hotelId, content, rating, parentId } = req.body;

    // Kiểm tra xem đó có phải là bình luận gốc không (không có parentId)
    // Nếu là bình luận gốc, kiểm tra xem người dùng đã thanh toán đơn đặt phòng cho khách sạn này chưa
    if (!parentId) {
      const hasBooked = await Booking.findOne({ 
        userId: req.user._id, 
        hotelId: hotelId,
        status: 'paid' 
      });

      if (!hasBooked && req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ success: false, message: 'Bạn cần đặt phòng và thanh toán thành công để đánh giá.' });
      }
    }

    const comment = await Comment.create({
      hotelId,
      userId: req.user._id,
      content,
      rating: parentId ? 0 : rating,
      parentId: parentId || null
    });

    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username avatar');

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// Cập nhật bình luận
router.put('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });

    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền chỉnh sửa' });
    }

    comment.content = req.body.content || comment.content;
    if (!comment.parentId && req.body.rating !== undefined) {
      comment.rating = req.body.rating;
    }
    
    await comment.save();

    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// Xóa bình luận
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });

    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa' });
    }

    // Đồng thời xóa tất cả các phản hồi của bình luận này
    if (!comment.parentId) {
      await Comment.deleteMany({ parentId: comment._id });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Đã xóa bình luận' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

export default router;
