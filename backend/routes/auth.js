import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import * as bcrypt from 'bcryptjs';

const router = express.Router();

const randomAvatar = () => {
  const seed = Math.random().toString(36).substring(7);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role || 'customer'
  };
  // Sử dụng khóa bí mật từ process.env, nếu không có thì mặc định là 'dev-secret-key'
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '7d' });
};

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, dob, citizenId, phone, address } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }

    // Tạo người dùng mới với ảnh đại diện ngẫu nhiên
    const user = new User({
      email,
      password,
      username,
      dob,
      citizenId,
      phone,
      address,
      avatar: randomAvatar()
    });

    await user.save();

    // Tạo mã token
    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites || []
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra thông tin đăng nhập Admin đặc biệt
    if ((email === 'TranOanh123@admin.com') && password === 'TranOanh123') {
      let adminUser = await User.findOne({ email: 'TranOanh123@admin.com' }); // or any designated email
      if (!adminUser) {
        // Tạo tài khoản admin nếu chưa tồn tại
        adminUser = new User({
          email: 'TranOanh123@admin.com',
          username: 'TranOanh Admin',
          password: 'TranOanh123',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
        });
        await adminUser.save();
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }
      
      adminUser.lastLogin = new Date();
      await adminUser.save();
      
      const token = generateToken(adminUser);
      return res.json({
        success: true,
        token,
        user: {
          id: adminUser._id,
          email: adminUser.email,
          username: adminUser.username,
          avatar: adminUser.avatar,
          phone: adminUser.phone,
          role: adminUser.role,
          favorites: adminUser.favorites || []
        }
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites || []
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// Đồng bộ đăng nhập Google
router.post('/google', async (req, res) => {
  try {
    const { email, username, avatar, firebaseUid } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // Đăng ký tự động
      user = new User({
        email,
        username,
        avatar,
        firebaseUid
      });
      await user.save();
    } else {
      // Cập nhật Firebase UID nếu chưa có
      if (!user.firebaseUid && firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites || []
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập bằng Google', err: error.message });
  }
});

export default router;
