import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/Destination.js';
import Hotel from './models/Hotel.js';
import Voucher from './models/Voucher.js';

dotenv.config();

const DESTINATIONS = [
  { id: "dest-1", name: "Phú Quốc", properties: 124, image: "https://images.unsplash.com/photo-1698809807960-758cf416e96e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwYmVhY2glMjB2aWV0bmFtfGVufDF8fHx8MTc3NTE0MjYxN3ww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "dest-2", name: "Nha Trang", properties: 85, image: "https://images.unsplash.com/photo-1658992461978-a6bcfd4bd956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaGElMjB0cmFuZyUyMGJlYWNoJTIwY2l0eXxlbnwxfHx8fDE3NzUxNDI2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "dest-3", name: "Đà Nẵng", properties: 210, image: "https://images.unsplash.com/photo-1771425953641-cb49685460b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYSUyMG5hbmclMjBicmlkZ2UlMjByaXZlcnxlbnwxfHx8fDE3NzUxNDI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080" }
];

const HOTELS = [
  { id: "h-1", name: "Ocean Pearl Resort & Spa", location: "Bãi Dài, Phú Quốc", price: 2500000, rating: 4.8, reviews: 1240, stars: 5, image: "https://images.unsplash.com/photo-1671798747374-48d3f3d43e6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NzUxNDI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", amenities: ["Bãi biển riêng", "Hồ bơi", "Spa", "Wi-Fi miễn phí", "Bữa sáng miễn phí"], propertyType: "Resort" },
  { id: "h-2", name: "Nha Trang Bay View Hotel", location: "Đường Trần Phú, Nha Trang", price: 1200000, rating: 4.5, reviews: 856, stars: 4, image: "https://images.unsplash.com/photo-1772764767922-876826060f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwcmVzb3J0JTIwcG9vbHxlbnwxfHx8fDE3NzUxNDI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", amenities: ["Hồ bơi vô cực", "Phòng gym", "Wi-Fi miễn phí", "Bữa sáng miễn phí"], propertyType: "Khách sạn" },
  { id: "h-3", name: "Sandy Beach Non Nuoc Resort", location: "Bãi biển Non Nước, Đà Nẵng", price: 1800000, rating: 4.6, reviews: 1022, stars: 4, image: "https://images.unsplash.com/photo-1772860812099-30373d1f3045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbmZyb250JTIwaG90ZWwlMjBiYWxjb255fGVufDF8fHx8MTc3NTE0MjYxOHww&ixlib=rb-4.1.0&q=80&w=1080", amenities: ["Bãi biển riêng", "Hồ bơi", "Nhà hàng ven biển", "Wi-Fi miễn phí"], propertyType: "Resort" },
  { id: "h-4", name: "Cozy Homestay An Bàng", location: "Biển An Bàng, Hội An", price: 650000, rating: 4.9, reviews: 340, stars: 3, image: "https://images.unsplash.com/photo-1632803716902-8d5e1b7246e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhlcm8lMjBvY2VhbiUyMHZpZXd8ZW58MXx8fHwxNzc1MTQyNjE3fDA&ixlib=rb-4.1.0&q=80&w=1080", amenities: ["Xe đạp miễn phí", "Wi-Fi miễn phí", "Bếp chung", "Gần biển"], propertyType: "Homestay" },
  { id: "h-5", name: "Vinpearl Resort & Spa", location: "Đảo Hòn Tre, Nha Trang", price: 3200000, rating: 4.7, reviews: 2150, stars: 5, image: "https://images.unsplash.com/photo-1698809807960-758cf416e96e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwYmVhY2glMjB2aWV0bmFtfGVufDF8fHx8MTc3NTE0MjYxN3ww&ixlib=rb-4.1.0&q=80&w=1080", amenities: ["Bãi biển riêng", "Hồ bơi lớn", "Spa", "Công viên nước", "Bữa sáng miễn phí"], propertyType: "Resort" },
  { id: "h-6", name: "My Khe Beach Villa", location: "Biển Mỹ Khê, Đà Nẵng", price: 4500000, rating: 4.8, reviews: 88, stars: 5, image: "https://images.unsplash.com/photo-1772764767922-876826060f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwcmVzb3J0JTIwcG9vbHxlbnwxfHx8fDE3NzUxNDI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080", amenities: ["Bãi biển riêng", "Hồ bơi riêng", "BBQ", "Nhà bếp", "Wi-Fi miễn phí"], propertyType: "Villa" }
];

const VOUCHERS = [
  { code: 'AQUA10', label: 'Giảm 10% (Tối đa 300k)', type: 'percent', value: 0.1, maxDiscount: 300000 },
  { code: 'SUMMER20', label: 'Giảm 20% (Tối đa 500k)', type: 'percent', value: 0.2, maxDiscount: 500000 },
  { code: 'MINUS200', label: 'Giảm trực tiếp 200,000đ', type: 'fixed', value: 200000 },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    await Voucher.deleteMany({});
    
    for (let d of DESTINATIONS) {
      await Destination.create({ idStr: d.id, name: d.name, properties: d.properties, image: d.image });
    }
    
    for (let h of HOTELS) {
      await Hotel.create({
        idStr: h.id, name: h.name, location: h.location, price: h.price, 
        rating: h.rating, reviews: h.reviews, stars: h.stars, image: h.image, 
        amenities: h.amenities, propertyType: h.propertyType
      });
    }
    
    for (let v of VOUCHERS) {
      await Voucher.create(v);
    }
    
    console.log('Data seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
