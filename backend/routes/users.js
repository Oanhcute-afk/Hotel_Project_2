import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import * as bcrypt from 'bcryptjs';
import Hotel from '../models/Hotel.js';

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

// Toggle favorite hotel
router.post('/favorites/toggle', protect, async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) return res.status(400).json({ message: 'Thiếu ID khách sạn' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    // Ensure favorites array exists
    if (!user.favorites) user.favorites = [];

    const index = user.favorites.indexOf(hotelId);
    let isFavorited = false;
    
    if (index === -1) {
      user.favorites.push(hotelId);
      isFavorited = true;
    } else {
      user.favorites.splice(index, 1);
      isFavorited = false;
    }

    await user.save();
    
    res.json({
      success: true,
      isFavorited,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật yêu thích' });
  }
});

// Get user favorite hotels
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (!user.favorites || user.favorites.length === 0) {
      return res.json({ success: true, hotels: [] });
    }

    // Fetch hotel data for the favorited IDs
    const hotels = await Hotel.find({ idStr: { $in: user.favorites } });
    
    const formatted = hotels.map(h => ({
      id: h.idStr || h._id,
      name: h.name,
      location: h.location,
      price: h.price,
      rating: h.rating,
      reviews: h.reviews,
      stars: h.stars,
      image: h.images && h.images.length > 0 ? h.images[0] : h.image,
      amenities: h.amenities,
      propertyType: h.propertyType
    }));

    res.json({ success: true, hotels: formatted });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách yêu thích' });
  }
});

export default router;
