import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
// Trước: import bcrypt from 'bcryptjs';
import * as bcrypt from 'bcryptjs';

const router = express.Router();

// Update user profile
router.put('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (req.user._id.toString() !== user._id.toString()) {
        return res.status(401).json({ message: 'Không có quyền chỉnh sửa tài khoản này' });
      }

      user.phone = req.body.phone || user.phone;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          phone: updatedUser.phone,
          avatar: updatedUser.avatar
        }
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật hồ sơ' });
  }
});

export default router;
