import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token || token === 'undefined' || token === 'null') {
         return res.status(401).json({ message: 'Không được cấp quyền, token không hợp lệ' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');

      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({ message: 'Không được cấp quyền, token thất bại' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không được cấp quyền, không có token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Quyền truy cập bị từ chối cho vai trò: ${req.user ? req.user.role : 'unauthenticated'}` 
      });
    }
    next();
  };
};

export const verifyManager = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ dành cho Quản lý hoặc Admin' });
  }
};
