import express from 'express';
import Destination from '../models/Destination.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import Voucher from '../models/Voucher.js';

const router = express.Router();

/**
 * Lấy danh sách các điểm đến (Destinations)
 */
router.get('/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find({});
    const formatted = destinations.map(d => ({
      id: d.idStr || d._id,
      name: d.name,
      properties: d.properties,
      image: d.image
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
});

/**
 * Lấy danh sách toàn bộ khách sạn (Dùng cho trang Khám phá/Tìm kiếm)
 */
router.get('/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    const formatted = hotels.map(h => ({
      id: h.idStr || h._id,
      name: h.name,
      location: h.location,
      price: h.price,
      rating: h.rating,
      reviews: h.reviews,
      stars: h.stars,
      image: h.images && h.images.length > 0 ? h.images[0] : h.image, // Ảnh bìa đầu tiên
      images: h.images || (h.image ? [h.image] : []),
      amenities: h.amenities,
      propertyType: h.propertyType
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
});

/**
 * Lấy chi tiết một khách sạn theo ID
 */
router.get('/hotels/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    const isObjectId = idParam.length === 24;
    // Tìm kiếm linh hoạt theo cả ID hệ thống (_id) hoặc mã chuỗi (idStr)
    const query = isObjectId ? { $or: [{ idStr: idParam }, { _id: idParam }] } : { idStr: idParam };
    
    const hotel = await Hotel.findOne(query);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    
    res.json({
      id: hotel.idStr || hotel._id,
      name: hotel.name,
      location: hotel.location,
      price: hotel.price,
      rating: hotel.rating,
      reviews: hotel.reviews,
      stars: hotel.stars,
      image: hotel.images && hotel.images.length > 0 ? hotel.images[0] : hotel.image,
      images: hotel.images || (hotel.image ? [hotel.image] : []),
      amenities: hotel.amenities,
      propertyType: hotel.propertyType,
      rooms: hotel.rooms || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
});

/**
 * Lấy danh sách Voucher (Dùng cho trang Ưu đãi)
 */
router.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await Voucher.find({});
    res.json(vouchers.map(v => ({
      id: v._id,
      code: v.code,
      label: v.label,
      type: v.type,
      value: v.value,
      maxDiscount: v.maxDiscount,
      image: v.image,
      category: v.category,
      description: v.description,
      expiryDate: v.expiryDate
    })));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
});

/**
 * Giả lập cổng thanh toán (Mock Payment)
 * Logic: Trả về thành công sau 1.5s, thất bại nếu số thẻ kết thúc bằng '000'
 */
const mockPaymentGateway = (cardNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (cardNumber && (cardNumber.endsWith('000') || cardNumber === '123456789')) {
        resolve({ success: false, message: 'Thẻ bị từ chối do thẻ không hợp lệ hoặc lỗi hệ thống.' });
      } else {
        resolve({ success: true, transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) });
      }
    }, 1500);
  });
};

/**
 * Tạo Đơn đặt phòng mới (Booking)
 * Quy trình: Nhận thông tin -> Giả lập thanh toán -> Tạo hóa đơn (Invoice) -> Lưu DB
 */
router.post('/bookings', async (req, res) => {
  try {
    const { 
      hotelId, firstName, lastName, email, phone, 
      checkIn, checkOut, guests, totalPrice, 
      subTotal, discountAmount, taxAmount, voucherCode, userId,
      paymentMethod, cardNumber 
    } = req.body;

    // Xử lý thanh toán nếu khách chọn thẻ
    if (paymentMethod === 'credit_card' || paymentMethod === 'atm') {
       const paymentResult = await mockPaymentGateway(cardNumber);
       if (!paymentResult.success) {
         return res.status(400).json({ success: false, message: paymentResult.message });
       }
    }

    // Tự động tạo mã hóa đơn ngẫu nhiên
    const invoiceNumber = `INV-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    // Lưu thông tin vào Database
    const newBooking = new Booking({
      hotelId,
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      subTotal,
      discountAmount,
      taxAmount,
      totalPrice,
      paymentMethod,
      voucherCode,
      userId,
      invoiceNumber,
      status: 'paid'
    });

    await newBooking.save();

    res.status(201).json({ 
      success: true, 
      message: 'Đặt phòng thành công!',
      bookingId: newBooking._id,
      invoiceNumber: newBooking.invoiceNumber
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đặt phòng' });
  }
});

/**
 * Lấy lịch sử đặt phòng của người dùng
 */
router.get('/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đặt phòng' });
  }
});

import nodemailer from 'nodemailer';

/**
 * Gửi yêu cầu hỗ trợ (Support Contact)
 * Sử dụng Ethereal Email (Giả lập gửi mail thực tế)
 */
router.post('/support', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin.' });
    }

    // Cấu hình mail giả lập
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Gửi mail thông báo đã nhận yêu cầu
    let info = await transporter.sendMail({
      from: '"AquaStays Support" <support@aquastays.vn>',
      to: email,
      subject: "Tiếp nhận yêu cầu hỗ trợ",
      html: `
        <h3>Kính gửi ${name},</h3>
        <p>Cảm ơn bạn đã gửi yêu cầu hỗ trợ. Nhân viên bên tôi sẽ sớm liên lạc với quý khách thông qua email trong thời gian sớm nhất.</p>
        <hr/>
        <p><strong>Nội dung yêu cầu của bạn:</strong></p>
        <blockquote style="font-style: italic; color: #555;">${message}</blockquote>
        <br/>
        <p>Trân trọng,</p>
        <p>Đội ngũ AquaStays</p>
      `,
    });

    console.log("Email sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.json({ success: true, message: 'Yêu cầu hỗ trợ đã được gửi thành công!' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống khi gửi email.' });
  }
});

export default router;

