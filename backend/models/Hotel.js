import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  idStr: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  stars: { type: Number, required: true },
  image: { type: String }, // Dự phòng cho dữ liệu cũ
  images: [{ type: String }], // Được cập nhật để hỗ trợ 3 ảnh theo yêu cầu
  amenities: [{ type: String }],
  propertyType: { type: String, required: true },
  description: { type: String, default: '' },
  totalRooms: { type: Number, default: 30 },
  rooms: [{
    idStr: { type: String }, // UUID tùy chọn cho loại phòng
    name: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 }
    },
    size: { type: Number, default: 20 },
    bedType: { type: String, default: '1 queen bed' },
    count: { type: Number, default: 1 }
  }],
  managerId: { type: String, default: 'admin' } // Liên kết với _id của model User hoặc 'admin' cho các khách sạn hệ thống
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);
