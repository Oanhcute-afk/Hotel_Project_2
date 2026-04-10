import express from 'express';
import multer from 'multer';
import path from 'path';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Voucher from '../models/Voucher.js';
import { protect, verifyManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get manager stats
router.get('/stats', protect, verifyManager, async (req, res) => {
  try {
    // Find hotels for this manager (Admin sees all)
    const query = req.user.role === 'admin' ? {} : { managerId: req.user._id };
    const managerHotels = await Hotel.find(query);
    const hotelIds = managerHotels.map(h => h.idStr);

    // Get bookings for these hotels
    const bookings = await Booking.find({ hotelId: { $in: hotelIds } });

    // Calculate stats
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalCapacity = managerHotels.reduce((sum, h) => sum + (h.totalRooms || 30), 0);
    const occupancyRate = totalCapacity > 0 ? ((totalBookings / (totalCapacity * 30)) * 100).toFixed(1) : 0;

    // Grouping by date (monthly)
    const monthlyStats = {};
    bookings.forEach(b => {
      const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    const chartData = Object.keys(monthlyStats).map(month => ({
      name: month,
      bookings: monthlyStats[month]
    }));

    // Best hotel
    const hotelBookings = {};
    bookings.forEach(b => {
       hotelBookings[b.hotelId] = (hotelBookings[b.hotelId] || 0) + 1;
    });
    
    let topHotelId = null;
    let maxCount = 0;
    Object.keys(hotelBookings).forEach(id => {
      if (hotelBookings[id] > maxCount) {
        maxCount = hotelBookings[id];
        topHotelId = id;
      }
    });

    const topHotel = managerHotels.find(h => h.idStr === topHotelId);

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        occupancyRate,
        chartData,
        topHotel: topHotel ? { name: topHotel.name, bookings: maxCount } : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê' });
  }
});

// Get manager hotels
router.get('/hotels', protect, verifyManager, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { managerId: req.user._id };
    const hotels = await Hotel.find(query);
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Add hotel
router.post('/hotels', protect, verifyManager, upload.array('images', 3), async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      managerId: req.user._id,
      images: []
    };

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      hotelData.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }

    // Process image links if provided (as a fallback or addition)
    if (req.body.imageLinks) {
       let links = [];
       try {
         links = JSON.parse(req.body.imageLinks);
       } catch (e) {
         links = req.body.imageLinks.split(',').map(l => l.trim());
       }
       hotelData.images = [...hotelData.images, ...links].slice(0, 3);
    }

    // Parse amenities if it comes as a JSON string from FormData
    if (typeof hotelData.amenities === 'string') {
      try {
        hotelData.amenities = JSON.parse(hotelData.amenities);
      } catch (e) {
        hotelData.amenities = hotelData.amenities.split(',').map(s => s.trim());
      }
    }

    // Parse rooms if it comes as a JSON string
    if (typeof hotelData.rooms === 'string') {
      try {
        hotelData.rooms = JSON.parse(hotelData.rooms);
      } catch (e) {
        hotelData.rooms = [];
      }
    }

    // Ensure idStr is generated or provided
    if (!hotelData.idStr) {
      hotelData.idStr = 'hotel-' + Math.random().toString(36).substr(2, 9);
    }

    const hotel = new Hotel(hotelData);
    await hotel.save();
    res.status(201).json({ success: true, hotel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo khách sạn' });
  }
});

// Update hotel
router.put('/hotels/:id', protect, verifyManager, upload.array('images', 3), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ idStr: req.params.id, managerId: req.user._id });
    if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn hoặc bạn không có quyền' });

    const updateData = { ...req.body };
    
    // Handle images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }
    
    // If new images uploaded, replace or add
    if (newImages.length > 0) {
      updateData.images = newImages; 
    }

    // Parse amenities if it comes as a JSON string from FormData
    if (typeof updateData.amenities === 'string') {
      try {
        updateData.amenities = JSON.parse(updateData.amenities);
      } catch (e) {
        updateData.amenities = updateData.amenities.split(',').map(s => s.trim());
      }
    }

    // Parse rooms if it comes as a JSON string
    if (typeof updateData.rooms === 'string') {
      try {
        updateData.rooms = JSON.parse(updateData.rooms);
      } catch (e) {
        updateData.rooms = [];
      }
    }

    Object.assign(hotel, updateData);
    await hotel.save();
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Delete hotel
router.delete('/hotels/:id', protect, verifyManager, async (req, res) => {
  try {
    const result = await Hotel.deleteOne({ idStr: req.params.id, managerId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy khách sạn' });
    res.json({ success: true, message: 'Đã xóa khách sạn' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Get all bookings (Invoices)
router.get('/bookings', protect, verifyManager, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { managerId: req.user._id };
    // We need to find hotels first if not admin
    let filter = {};
    if (req.user.role !== 'admin') {
      const hotels = await Hotel.find({ managerId: req.user._id });
      filter = { hotelId: { $in: hotels.map(h => h.idStr) } };
    }
    
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Get all users (Customers) with activity
router.get('/users', protect, verifyManager, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 }).lean();
    
    // Add activity data (Total bookings)
    const usersWithActivity = await Promise.all(users.map(async (u) => {
      const bookings = await Booking.find({ email: u.email }).sort({ createdAt: -1 });
      return {
        ...u,
        totalBookings: bookings.length,
        lastBookingDate: bookings.length > 0 ? bookings[0].createdAt : null,
        lastBookingHotel: bookings.length > 0 ? bookings[0].hotelId : null
      };
    }));

    res.json({ success: true, users: usersWithActivity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Voucher Management
router.get('/vouchers', protect, verifyManager, async (req, res) => {
  try {
    const vouchers = await Voucher.find({}).sort({ createdAt: -1 });
    res.json({ success: true, vouchers });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/vouchers', protect, verifyManager, upload.single('image'), async (req, res) => {
  try {
    const voucherData = { ...req.body };
    if (req.file) {
      voucherData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const voucher = new Voucher(voucherData);
    await voucher.save();
    res.status(201).json({ success: true, voucher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo voucher' });
  }
});

router.put('/vouchers/:id', protect, verifyManager, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, voucher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật voucher' });
  }
});

router.delete('/vouchers/:id', protect, verifyManager, async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa voucher' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa voucher' });
  }
});

export default router;
