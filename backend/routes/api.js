import express from 'express';
import Destination from '../models/Destination.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import Voucher from '../models/Voucher.js';

const router = express.Router();

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
    res.status(500).json({ message: 'Server Error' });
  }
});

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
      image: h.images && h.images.length > 0 ? h.images[0] : h.image, // Fallback for old data
      images: h.images || (h.image ? [h.image] : []),
      amenities: h.amenities,
      propertyType: h.propertyType
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/hotels/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    const isObjectId = idParam.length === 24;
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
      propertyType: hotel.propertyType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

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
    res.status(500).json({ message: 'Server Error' });
  }
});

// Mock Payment Gateway Logic simulating network behavior
const mockPaymentGateway = (cardNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock logic: fail if card number ends with '000' or is fake invalid
      if (cardNumber && (cardNumber.endsWith('000') || cardNumber === '123456789')) {
        resolve({ success: false, message: 'Thẻ bị từ chối do thẻ không hợp lệ hoặc lỗi hệ thống.' });
      } else {
        resolve({ success: true, transactionId: 'txn_' + Math.random().toString(36).substr(2, 9) });
      }
    }, 1500);
  });
};

router.post('/bookings', async (req, res) => {
  try {
    const { 
      hotelId, firstName, lastName, email, phone, 
      checkIn, checkOut, guests, totalPrice, 
      subTotal, discountAmount, taxAmount, voucherCode, userId,
      paymentMethod, cardNumber 
    } = req.body;

    // Simulate Payment Processing if paying via credit_card/atm
    if (paymentMethod === 'credit_card' || paymentMethod === 'atm') {
       const paymentResult = await mockPaymentGateway(cardNumber);
       if (!paymentResult.success) {
         return res.status(400).json({ success: false, message: paymentResult.message });
       }
    }

    const invoiceNumber = `INV-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    // Save booking
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

router.post('/support', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin.' });
    }

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
