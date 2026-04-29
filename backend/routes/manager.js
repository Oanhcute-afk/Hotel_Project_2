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

/**
 * MULTER CONFIG: Cấu hình lưu trữ file ảnh khi upload
 * File sẽ được lưu vào thư mục 'uploads/' với tên file là duy nhất (timestamp + random)
 */
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

/**
 * API: Lấy thống kê cho Manager/Admin
 * Logic: Lọc theo thời gian (Ngày, Tuần, Tháng) và tính toán các chỉ số kinh doanh
 */
router.get('/stats', protect, verifyManager, async (req, res) => {
  try {
    const { range } = req.query;
    // Nếu là admin thì xem được tất cả khách sạn, nếu là manager chỉ xem được khách sạn mình quản lý
    const query = req.user.role === 'admin' ? {} : { managerId: req.user._id };
    const managerHotels = await Hotel.find(query);
    
    // Thu thập danh sách ID của các khách sạn để lọc đơn đặt phòng
    const hotelIds = managerHotels.flatMap(h => [h.idStr, h._id.toString()]);

    // Xây dựng bộ lọc thời gian
    let timeFilter = {};
    // Chỉ manager mới bị giới hạn theo hotelId, Admin xem tổng thể toàn hệ thống
    if (req.user.role !== 'admin') {
      timeFilter.hotelId = { $in: hotelIds };
    }
    
    const now = new Date();
    
    // Lọc theo mốc thời gian: Hôm nay, Tuần này, Tháng này
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

    // Tính toán các chỉ số chính
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalHotels = managerHotels.length;
    
    // Lấy số lượng đánh giá của các khách sạn đang quản lý
    const totalReviews = await Review.countDocuments({ hotelId: { $in: hotelIds } });
    
    // Tính tổng công suất phòng (mặc định 20 phòng/khách sạn nếu không có dữ liệu)
    const totalCapacity = managerHotels.reduce((sum, h) => sum + (h.totalRooms || 20), 0);
    
    // Tính Tỷ lệ lấp đầy: (Tổng số đêm đã đặt / Tổng số đêm khả dụng) * 100
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

    // Chuẩn bị dữ liệu cho Biểu đồ (Grouping theo ngày/tháng)
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

    // Tìm khách sạn có doanh thu/lượt đặt cao nhất (Top Hotel)
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
    res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
});

/**
 * QUẢN LÝ KHÁCH SẠN
 */
router.get('/hotels', protect, verifyManager, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { managerId: req.user._id };
    const hotels = await Hotel.find(query);
    res.json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm khách sạn mới kèm Upload ảnh
router.post('/hotels', protect, verifyManager, upload.array('images', 3), async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      managerId: req.user._id,
      images: []
    };

    // Lưu các đường dẫn ảnh đã upload thành công
    if (req.files && req.files.length > 0) {
      hotelData.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }

    // Nếu người dùng cung cấp link ảnh trực tiếp (từ web) thì gộp chung vào
    if (req.body.imageLinks) {
       let links = [];
       try {
         links = JSON.parse(req.body.imageLinks);
       } catch (e) {
         links = req.body.imageLinks.split(',').map(l => l.trim());
       }
       hotelData.images = [...hotelData.images, ...links].slice(0, 3);
    }

    // Chuyển đổi dữ liệu từ chuỗi (do FormData gửi lên) sang Array/Object
    if (typeof hotelData.amenities === 'string') {
      try {
        hotelData.amenities = JSON.parse(hotelData.amenities);
      } catch (e) {
        hotelData.amenities = hotelData.amenities.split(',').map(s => s.trim());
      }
    }

    if (typeof hotelData.rooms === 'string') {
      try {
        hotelData.rooms = JSON.parse(hotelData.rooms);
      } catch (e) {
        hotelData.rooms = [];
      }
    }

    // Tự động tạo mã định danh duy nhất cho khách sạn (idStr)
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

// Cập nhật thông tin khách sạn
router.put('/hotels/:id', protect, verifyManager, upload.array('images', 3), async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? { idStr: req.params.id } : { idStr: req.params.id, managerId: req.user._id };
    const hotel = await Hotel.findOne(query);
    if (!hotel) return res.status(404).json({ message: 'Không tìm thấy khách sạn hoặc bạn không có quyền' });

    const updateData = { ...req.body };
    
    // Xử lý ảnh mới nếu có upload
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }
    
    if (req.body.imageLinks) {
      try {
        const links = JSON.parse(req.body.imageLinks);
        newImages = [...newImages, ...links];
      } catch (e) {
        console.error("Lỗi khi phân giải imageLinks:", e);
      }
    }
    
    if (newImages.length > 0) {
      updateData.images = newImages; 
      updateData.image = newImages[0];
    }

    if (typeof updateData.amenities === 'string') {
      try {
        updateData.amenities = JSON.parse(updateData.amenities);
      } catch (e) {
        updateData.amenities = updateData.amenities.split(',').map(s => s.trim());
      }
    }

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

// Xóa khách sạn
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

/**
 * QUẢN LÝ HÓA ĐƠN (BOOKINGS)
 */
router.get('/bookings', protect, verifyManager, async (req, res) => {
  try {
    // Admin xem toàn bộ, Manager chỉ xem hóa đơn của khách sạn mình quản lý
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

// Xóa hóa đơn
router.delete('/bookings/:id', protect, verifyManager, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });

    // Kiểm tra quyền: Manager chỉ được xóa đơn thuộc khách sạn của mình
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

/**
 * QUẢN LÝ NGƯỜI DÙNG (CUSTOMERS)
 */
router.get('/users', protect, verifyManager, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { role: 'customer' };
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).lean();
    
    // Gắn thêm thông tin hoạt động: Tổng số đơn hàng, đơn cuối cùng...
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

/**
 * QUẢN LÝ VOUCHER
 */
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

