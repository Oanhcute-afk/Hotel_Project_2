import { MapPin, Star, Heart, Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HotelCard({ hotel }) {
  // Try to use images[0], fallback to image
  const primaryImage = hotel.images && hotel.images.length > 0 ? hotel.images[0] : hotel.image;

  // Rating badge text logic
  let ratingText = "Tốt";
  if (hotel.rating >= 9) ratingText = "Tuyệt hảo";
  else if (hotel.rating >= 8) ratingText = "Rất tốt";
  
  // Calculate a fake original price for the UI (30% more)
  const originalPrice = Math.floor(hotel.price * 1.3);

  // Grab the first room for display info, or fallback
  const fallbackRoom = hotel.rooms && hotel.rooms.length > 0 
    ? hotel.rooms[0] 
    : { name: 'Phòng tiêu chuẩn', bedType: '1 giường đôi' };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row p-4 gap-4">
      
      {/* Image Section */}
      <div className="relative w-full sm:w-[240px] h-[240px] flex-shrink-0">
        <img 
          src={primaryImage} 
          alt={hotel.name} 
          className="w-full h-full object-cover rounded-lg"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition">
          <Heart className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow justify-between">
        
        {/* Top Info row */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-xl font-extrabold text-sky-700">
                {hotel.name}
              </h3>
              <div className="flex items-center">
                {[...Array(hotel.stars || 0)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-3 h-3 fill-amber-400 text-amber-400" 
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-sky-600 underline cursor-pointer font-bold flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-sky-600" /> 
              {hotel.location} <span className="text-slate-400 no-underline font-normal">Cách trung tâm 1 km</span>
            </p>
            
            <span className="inline-block bg-green-700 text-white text-[11px] font-bold px-2 py-0.5 rounded mb-3">
              Ưu Đãi Tuyệt Vời
            </span>

            {/* Room mini info */}
            <div className="border-l-2 border-slate-200 pl-3 mb-2">
              <h4 className="font-bold text-sm text-slate-800">{fallbackRoom.name}</h4>
              <p className="text-xs text-slate-600 mb-2">{fallbackRoom.bedType}</p>
              
              <p className="text-[11px] font-bold text-green-700 flex items-center gap-1 mb-0.5">
                <Check className="w-3 h-3" /> Hủy miễn phí
              </p>
              <p className="text-[11px] font-bold text-green-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Không cần thanh toán trước - thanh toán tại chỗ nghỉ
              </p>
            </div>
            
            <p className="text-xs font-bold text-red-600">Chúng tôi chỉ còn 1 phòng ở giá này!</p>
          </div>

          {/* Right rating & price side */}
          <div className="flex flex-col items-end min-w-[140px] text-right">
            {/* Rating row */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{ratingText}</span>
                <span className="text-xs text-slate-500">{hotel.reviews || 0} đánh giá</span>
              </div>
              <div className="bg-sky-700 text-white font-bold p-1.5 rounded-t-lg rounded-br-lg rounded-bl-sm text-sm min-w-[32px] text-center">
                {hotel.rating?.toFixed(1) || '10'}
              </div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded mb-4 mt-2">
              Mới trên Khách sạn
            </span>
          </div>
        </div>

        {/* Bottom Price row */}
        <div className="flex justify-end items-end mt-4">
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-slate-500 mb-0.5">2 người lớn, 1 đêm</span>
            <span className="line-through text-red-500 text-xs">{originalPrice.toLocaleString("vi-VN")} ₫</span>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">
              VND {hotel.price.toLocaleString("vi-VN")}
            </div>
            <span className="text-[11px] text-slate-500 mb-3">+ Thuế và phí</span>
            
            <Link
              to={`/hotel/${hotel.id || hotel.idStr || hotel._id}`}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-bold transition text-sm flex items-center"
            >
              Hiển thị giá <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}