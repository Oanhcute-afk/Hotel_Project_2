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
  // use a secret from process.env, fallback to 'dev-secret-key' for now
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, dob, citizenId, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }

    // Create user with random avatar
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

    // Generate token
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for Special Admin Credentials
    if ((email === 'TranOanh123@admin.com') && password === 'TranOanh123') {
      let adminUser = await User.findOne({ email: 'TranOanh123@admin.com' }); // or any designated email
      if (!adminUser) {
        // Create the admin user if doesn't exist
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

// Google Login sync
router.post('/google', async (req, res) => {
  try {
    const { email, username, avatar, firebaseUid } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // Register seamlessly 
      user = new User({
        email,
        username,
        avatar,
        firebaseUid
      });
      await user.save();
    } else {
      // Update firebase uid if not set
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
