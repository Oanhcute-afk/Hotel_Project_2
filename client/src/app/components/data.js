export const DESTINATIONS = [
  {
    id: "da-nang",
    name: "Đà Nẵng",
    properties: 450,
    image: "https://images.unsplash.com/photo-1559592442-7e182c8c6f5d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "phu-quoc",
    name: "Phú Quốc",
    properties: 320,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "nha-trang",
    name: "Nha Trang",
    properties: 280,
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "vung-tau",
    name: "Vũng Tàu",
    properties: 190,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800"
  }
];

export const PROPERTY_TYPES = [
  "Khách sạn",
  "Resort",
  "Villa",
  "Căn hộ",
  "Homestay"
];

export const AMENITIES = [
  "Wi-Fi miễn phí",
  "Hồ bơi",
  "Bữa sáng",
  "Spa",
  "Gym",
  "Bãi biển riêng",
  "Chỗ đậu xe",
  "Điều hòa",
  "Nhà hàng"
];

export const HOTELS = [
  {
    id: "1",
    idStr: "h1",
    name: "Aqua Blue Resort",
    location: "Sơn Trà, Đà Nẵng",
    price: 2500000,
    rating: 4.8,
    reviews: 124,
    stars: 5,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800",
    propertyType: "Resort",
    amenities: ["Bãi biển riêng", "Hồ bơi", "Spa"]
  },
  {
    id: "2",
    idStr: "h2",
    name: "Sky Ocean Hotel",
    location: "Trần Phú, Nha Trang",
    price: 1200000,
    rating: 4.5,
    reviews: 89,
    stars: 4,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    propertyType: "Khách sạn",
    amenities: ["Wi-Fi miễn phí", "Nhà hàng", "Chỗ đậu xe"]
  }
];
