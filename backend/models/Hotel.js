import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  idStr: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  stars: { type: Number, required: true },
  images: [{ type: String }], // Updated to support 3 images as requested
  amenities: [{ type: String }],
  propertyType: { type: String, required: true },
  description: { type: String, default: '' },
  totalRooms: { type: Number, default: 30 },
  rooms: [{
    idStr: { type: String }, // optional uuid for the room type
    name: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 }
    },
    size: { type: Number, default: 20 },
    bedType: { type: String, default: '1 queen bed' },
    facilities: [{ type: String }],
    count: { type: Number, default: 1 }
  }],
  managerId: { type: String, default: 'admin' } // linked to User model _id or 'admin' for system hotels
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);
