import express from 'express';
import multer from 'multer';
import path from 'path';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Voucher from '../models/Voucher.js';
import Review from '../models/Review.js';
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
    const { range } = req.query;
    const query = req.user.role === 'admin' ? {} : { managerId: req.user._id };
    const managerHotels = await Hotel.find(query);
    
    // Include both idStr and _id to be safe
    const hotelIds = managerHotels.flatMap(h => [h.idStr, h._id.toString()]);

    // Build time filter
    let timeFilter = {};
    if (req.user.role !== 'admin') {
      timeFilter.hotelId = { $in: hotelIds };
    }
    
    const now = new Date();
    
    if (range === 'day') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      timeFilter.createdAt = { $gte: startOfDay };
    } else if (range === 'week') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      timeFilter.createdAt = { $gte: startOfWeek };
    } else if (range === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      timeFilter.createdAt = { $gte: startOfMonth };
    }

    const bookings = await Booking.find(timeFilter);

    // Calculate stats
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalHotels = managerHotels.length;
    
    // Get review count for manager's hotels
    const totalReviews = await Review.countDocuments({ hotelId: { $in: hotelIds } });
    
    const totalCapacity = managerHotels.reduce((sum, h) => sum + (h.totalRooms || 20), 0);
    
    // Tính tổng số đêm đã đặt
    let totalNights = 0;
    bookings.forEach(b => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      totalNights += (diff > 0 ? diff : 1);
    });

    let daysInRange = 30;
    if (range === 'day') daysInRange = 1;
    else if (range === 'week') daysInRange = 7;
    
    const availableRoomNights = totalCapacity * daysInRange;
    const occupancyRate = availableRoomNights > 0 
      ? Math.min(((totalNights / availableRoomNights) * 100), 100).toFixed(1) 
      : 0;

    // Grouping by date for chart
    const chartData = [];
    if (range === 'month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const statsByDay = {};
      bookings.forEach(b => {
        const day = new Date(b.createdAt).getDate();
        statsByDay[day] = (statsByDay[day] || 0) + 1;
      });

      for (let i = 1; i <= daysInMonth; i++) {
        chartData.push({
          name: `${i}/${now.getMonth() + 1}`,
          bookings: statsByDay[i] || 0
        });
      }
    } else if (range === 'week') {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const statsByDay = {};
      bookings.forEach(b => {
        const day = new Date(b.createdAt).getDay();
        statsByDay[day] = (statsByDay[day] || 0) + 1;
      });

      for (let i = 0; i < 7; i++) {
        chartData.push({
          name: days[i],
          bookings: statsByDay[i] || 0
        });
      }
    } else {
      const vnMonths = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const monthlyStats = {};
      bookings.forEach(b => {
        const monthIdx = new Date(b.createdAt).getMonth();
        const label = vnMonths[monthIdx];
        monthlyStats[label] = (monthlyStats[label] || 0) + 1;
      });

      vnMonths.forEach(month => {
        chartData.push({
          name: month,
          bookings: monthlyStats[month] || 0
        });
      });
    }

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

    const topHotel = managerHotels.find(h => h.idStr === topHotelId || h._id.toString() === topHotelId);

    res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        occupancyRate,
        totalHotels,
        totalReviews,
        chartData,
        topHotel: topHotel ? { name: topHotel.name, bookings: maxCount } : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
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
    const query = req.user.role === 'admin' ? { idStr: req.params.id } : { idStr: req.params.id, managerId: req.user._id };
    const hotel = await Hotel.findOne(query);
    if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn hoặc bạn không có quyền' });

    const updateData = { ...req.body };
    
    // Handle images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }
    
    // Handle image links from body
    if (req.body.imageLinks) {
      try {
        const links = JSON.parse(req.body.imageLinks);
        newImages = [...newImages, ...links];
      } catch (e) {
        console.error("Error parsing imageLinks:", e);
      }
    }
    
    // If new images uploaded or links provided, update
    if (newImages.length > 0) {
      updateData.images = newImages; 
      updateData.image = newImages[0];
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
    const query = req.user.role === 'admin' ? { idStr: req.params.id } : { idStr: req.params.id, managerId: req.user._id };
    const result = await Hotel.deleteOne(query);
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

// Delete booking
router.delete('/bookings/:id', protect, verifyManager, async (req, res) => {
  try {
    // Basic protection: if manager, check if they own the hotel of this booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });

    if (req.user.role !== 'admin') {
      const hotel = await Hotel.findOne({ idStr: booking.hotelId, managerId: req.user._id });
      if (!hotel) return res.status(403).json({ message: 'Bạn không có quyền xóa đơn đặt phòng này' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa đơn đặt phòng' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi xóa đơn đặt phòng' });
  }
});

// Get all users (Customers) with activity
router.get('/users', protect, verifyManager, async (req, res) => {
  try {
    // Admin can see all users, managers see only customers
    const query = req.user.role === 'admin' ? {} : { role: 'customer' };
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();
    
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
