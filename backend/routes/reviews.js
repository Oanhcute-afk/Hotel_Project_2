import express from 'express';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lấy danh sách đánh giá của một khách sạn cụ thể theo ID
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy đánh giá' });
  }
});

// Đăng một đánh giá mới
router.post('/', protect, async (req, res) => {
  try {
    const { hotelId, rating, comment } = req.body;
    
    // KIỂM TRA: Chỉ cho phép nếu người dùng đã từng đặt khách sạn này trước đó
    // Kiểm tra trong model Booking xem userId và hotelId có khớp không và trạng thái là 'paid'
    const hasBooked = await Booking.findOne({ 
      userId: req.user._id.toString(), 
      hotelId: hotelId,
      status: 'paid' 
    });

    if (!hasBooked) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn chỉ có thể đánh giá khách sạn mà bạn đã từng đặt phòng thành công.' 
      });
    }

    // Xử lý tạo đánh giá mới
    const newReview = new Review({
      userId: req.user._id,
      hotelId,
      rating,
      comment,
      userName: req.user.username,
      userAvatar: req.user.avatar
    });

    await newReview.save();
    
    // Tùy chọn: Cập nhật tổng số lượng đánh giá của 'Hotel'
    await Hotel.findOneAndUpdate(
       { idStr: hotelId },
       { $inc: { reviews: 1 } }
    );

    res.status(201).json({ success: true, message: 'Thêm đánh giá thành công!', review: newReview });

  } catch (error) {
    console.error('Lỗi thêm đánh giá:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi gửi đánh giá' });
  }
});

// Chỉnh sửa đánh giá
router.put('/:id', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }

    // Kiểm tra quyền sở hữu
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa đánh giá này' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json({ success: true, message: 'Cập nhật đánh giá thành công', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi cập nhật đánh giá' });
  }
});

// Phản hồi đánh giá
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá để phản hồi' });
    }

    const reply = {
      userId: req.user._id,
      userName: req.user.username,
      userAvatar: req.user.avatar,
      comment,
      createdAt: new Date()
    };

    review.replies.push(reply);
    await review.save();

    res.status(201).json({ success: true, message: 'Phản hồi thành công', reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi phản hồi' });
  }
});

export default router;
