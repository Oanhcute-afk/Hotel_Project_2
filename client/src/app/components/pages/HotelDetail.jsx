import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Check,
  ChevronDown,
  Info,
  Heart,
  Share2
} from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";
import { GuestReviews } from "../ui/GuestReviews";

export function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, requireAuth } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [checkIn, setCheckIn] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]); // Day after tomorrow
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [filteredRooms, setFilteredRooms] = useState([]);
  
  // roomId -> quantity selected
  const [roomSelections, setRoomSelections] = useState({});

  useEffect(() => {
    fetch(`/api/hotels/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.message) {
          setHotel(data);
          // Set initial rooms
          const roomsStr = JSON.stringify([{ idStr: 'legacy-room', name: 'Phòng Tiêu Chuẩn', capacity: { adults: 2, children: 0 }, size: 20, bedType: '1 giường đôi', price: data.price, count: 5, facilities: data.amenities || [] }]);
          const parsedRooms = (data.rooms && data.rooms.length > 0) ? data.rooms : JSON.parse(roomsStr);
          setFilteredRooms(parsedRooms);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Không tìm thấy chỗ nghỉ</h2>
        <button onClick={() => navigate("/search")} className="bg-sky-500 text-white px-6 py-2 rounded-xl">Quay lại tìm kiếm</button>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const cin = new Date(checkIn);
    const cout = new Date(checkOut);
    const diffTime = Math.abs(cout.getTime() - cin.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const nights = calculateNights() || 1;

  // Use hotel.images if available
  const images = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image, hotel.image, hotel.image];
  const primaryImage = images[0];
  const secondaryImages = images.slice(1, images.length > 1 ? 5 : 1);

  // Use hotel.rooms if available, fallback for old objects
  const roomsStr = JSON.stringify([
    { idStr: 'legacy-room', name: 'Phòng Tiêu Chuẩn', capacity: { adults: 2, children: 0 }, size: 20, bedType: '1 giường đôi', price: hotel.price, count: 5, facilities: hotel.amenities || [] }
  ]);
  const rooms = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : JSON.parse(roomsStr);

  const handleSearchChange = () => {
    const matchedRooms = rooms.filter(r => {
      const adultCap = r.capacity?.adults ?? 2;
      const childCap = r.capacity?.children ?? 0;
      return adultCap >= adults && childCap >= children;
    });
    setFilteredRooms(matchedRooms);
    setRoomSelections({});
  };

  const handleRoomSelect = (roomId, qty) => {
    setRoomSelections(prev => ({
      ...prev,
      [roomId]: qty
    }));
  };

  const handleBooking = () => {
    const selectedEntries = Object.entries(roomSelections).filter(([_, qty]) => qty > 0);
    if (selectedEntries.length === 0) {
      alert("Vui lòng chọn ít nhất 1 phòng!");
      return;
    }

    requireAuth(() => {
      const selections = selectedEntries.map(([roomId, qty]) => ({ roomId, qty }));
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults: String(adults),
        children: String(children),
        selections: JSON.stringify(selections),
        nights: String(nights)
      });
      navigate(`/checkout/${hotel.id || hotel.idStr || hotel._id}?${params.toString()}`);
    });
  };

  // Helper text
  let ratingText = "Tốt";
  if (hotel.rating >= 9) ratingText = "Tuyệt hảo";
  else if (hotel.rating >= 8) ratingText = "Rất tốt";

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Top Nav Tabs */}
      <div className="border-b border-slate-200 sticky top-16 z-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 overflow-x-auto">
          {["Overview", "Availability", "Facilities", "House rules", "Important and legal info", "Guest reviews"].map((tab, i) => (
            <button key={tab} className={`py-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${i === 0 ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(hotel.stars || 0)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{hotel.name}</h1>
            <p className="text-sm font-medium flex items-center gap-1 text-slate-700">
              <MapPin className="w-4 h-4 text-sky-600" />
              {hotel.location} 
              <span className="text-sky-600 font-bold ml-2 cursor-pointer hover:underline">– Excellent location – show map</span>
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><Heart className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><Share2 className="w-5 h-5" /></button>
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded font-bold transition shadow-sm">Reserve</button>
          </div>
        </div>

        {/* Image Grid Section */}
        <div className="flex gap-2 mb-8 h-[300px] md:h-[400px]">
          <div className="w-2/3 h-full overflow-hidden rounded-l-md">
            <img src={primaryImage} className="w-full h-full object-cover transition-transform hover:scale-105" />
          </div>
          {secondaryImages.length > 0 ? (
            <div className="w-1/3 flex flex-col gap-2 h-full overflow-hidden">
               {secondaryImages.slice(0, 2).map((img, i) => (
                 <div key={i} className={`flex-1 overflow-hidden ${i === 0 ? 'rounded-tr-md' : 'rounded-br-md'} bg-slate-100`}>
                   <img src={img} className="w-full h-full object-cover transition-transform hover:scale-105" />
                 </div>
               ))}
            </div>
          ) : (
            <div className="w-1/3 bg-slate-100 h-full rounded-r-md flex flex-col items-center justify-center">
               <span className="text-slate-400 font-bold">No additional images</span>
            </div>
          )}
        </div>

        {/* Summary Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <p className="text-sm text-slate-800 leading-relaxed mb-6">{hotel.description || 'Welcome to our luxurious hotel offering incredible service and fantastic rooms tailored exactly to your needs. Located in the heart of the city, perfectly situated for your exploration and relaxation.'}</p>
            <h3 className="font-extrabold text-lg mb-4 text-slate-900">Most popular facilities</h3>
            <div className="flex flex-wrap gap-4">
              {hotel.amenities?.map(amenity => (
                 <div key={amenity} className="flex items-center gap-2 text-sm text-green-700 font-bold">
                   <Check className="w-4 h-4" /> {amenity}
                 </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#EBF3FF] p-4 rounded-md h-fit">
            <div className="flex justify-between items-start mb-4">
              <span className="font-extrabold text-slate-900">{ratingText}</span>
              <div className="bg-sky-700 text-white font-bold p-1.5 rounded-t-lg rounded-br-lg rounded-bl-sm text-lg w-10 text-center">
                {hotel.rating?.toFixed(1) || '10'}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4">{hotel.reviews} reviews</p>
            
            <h4 className="font-extrabold text-sm mb-2 text-slate-900 mt-6">Guests who stayed here loved</h4>
            <p className="text-xs text-slate-700 italic border-l-2 border-slate-300 pl-3">"Perfect location, incredibly clean and the staff were wonderful..."</p>
          </div>
        </div>

        {/* Availability Section */}
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Availability</h2>
        
        {/* Availability Bar */}
        <div className="bg-amber-100/50 p-4 border-2 border-amber-400 rounded-md mb-6 flex flex-wrap gap-4 items-end shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Check-in date</label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-40 border border-amber-400 px-3 py-2 text-sm font-bold text-slate-900 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Check-out date</label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-40 border border-amber-400 px-3 py-2 text-sm font-bold text-slate-900 bg-white" />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-800 mb-1">Người lớn</label>
             <input type="number" min="1" value={adults} onChange={e => setAdults(Number(e.target.value))} className="w-20 border border-amber-400 px-3 py-2 text-sm font-bold text-slate-900 bg-white" />
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-800 mb-1">Trẻ em</label>
             <input type="number" min="0" value={children} onChange={e => setChildren(Number(e.target.value))} className="w-20 border border-amber-400 px-3 py-2 text-sm font-bold text-slate-900 bg-white" />
          </div>
          <button onClick={handleSearchChange} className="bg-sky-600 text-white font-bold px-6 py-2 border-2 border-sky-600 rounded whitespace-nowrap">Change search</button>
        </div>

        {/* Room Table */}
        {filteredRooms.length === 0 ? (
           <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg">
             <h3 className="text-xl font-bold text-slate-800 mb-2">Không có phòng phù hợp</h3>
             <p className="text-slate-500">Xin lỗi, không có phòng nào đáp ứng yêu cầu của bạn. Vui lòng thay đổi số lượng khách.</p>
           </div>
        ) : (
        <div className="border border-slate-300 rounded overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#4873B5] text-white">
              <tr>
                <th className="p-3 font-bold border-r border-slate-300/30 w-1/4">Room type</th>
                <th className="p-3 font-bold border-r border-slate-300/30 text-center">Number of guests</th>
                <th className="p-3 font-bold border-r border-slate-300/30">Price for {nights} nights</th>
                <th className="p-3 font-bold border-r border-slate-300/30 w-1/4">Your choices</th>
                <th className="p-3 font-bold border-r border-slate-300/30">Select Rooms</th>
                <th className="p-3 font-bold w-1/6"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, idx) => {
                const roomPriceForNights = room.price * nights;
                const originalPrice = Math.floor(roomPriceForNights * 1.3);
                
                return (
                  <tr key={idx} className="border-b border-slate-300">
                    <td className="p-4 align-top border-r border-slate-300">
                      <h3 className="font-bold text-sky-700 underline text-lg mb-2">{room.name}</h3>
                      <p className="text-xs text-slate-600 font-bold mb-2 break-words">{room.bedType}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs border border-slate-300 px-1 py-0.5 rounded flex items-center gap-1"><Check className="w-3 h-3 text-slate-500" /> 1 room</span>
                        <span className="text-xs border border-slate-300 px-1 py-0.5 rounded flex items-center gap-1"><Check className="w-3 h-3 text-slate-500" /> {room.size} m²</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[11px] text-green-700 font-medium">
                        {room.facilities?.map(f => (
                           <span key={f} className="flex gap-1 items-start"><Check className="w-3 h-3 mt-0.5" /> {f}</span>
                        ))}
                      </div>
                    </td>
                    
                    <td className="p-4 align-top border-r border-slate-300 text-center">
                       <div className="flex justify-center text-slate-700">
                         {/* Draw adult figures */}
                         {[...Array(room.capacity?.adults || 2)].map((_, i) => (
                           <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                         ))}
                       </div>
                    </td>

                    <td className="p-4 align-top border-r border-slate-300">
                      <div className="line-through text-red-500 text-sm font-medium">VND {originalPrice.toLocaleString('vi-VN')}</div>
                      <div className="text-xl font-extrabold text-slate-900 mb-1">VND {roomPriceForNights.toLocaleString('vi-VN')}</div>
                      <p className="text-[11px] text-slate-500 mb-2">Includes taxes and fees</p>
                      <span className="bg-green-700 text-white text-[11px] font-bold px-1 py-0.5 rounded">Special limited-time Deal</span>
                    </td>

                    <td className="p-4 align-top border-r border-slate-300 bg-green-50/30">
                      <p className="text-xs font-bold text-slate-800 flex items-center justify-between mb-2"> Breakfast included <Info className="w-3 h-3 text-sky-600" /></p>
                      <p className="text-xs font-bold text-green-700 flex items-start gap-1 mb-2">
                        <Check className="w-4 h-4 mt-0.5" /> Free cancellation before 2:00 PM on {checkIn}
                      </p>
                      <p className="text-xs font-bold text-green-700 flex items-start gap-1 mb-2">
                        <Check className="w-4 h-4 mt-0.5" /> No prepayment needed – pay at the property
                      </p>
                      <p className="text-xs font-bold text-red-600 mt-2">Only {room.count} room(s) left on our site</p>
                    </td>

                    <td className="p-4 align-top border-r border-slate-300">
                      <select 
                        value={roomSelections[room.idStr] || 0}
                        onChange={(e) => handleRoomSelect(room.idStr || room._id, parseInt(e.target.value))}
                        className="w-full border border-slate-300 rounded p-1 text-sm bg-white"
                      >
                        {[...Array((room.count || 5) + 1)].map((_, i) => (
                           <option key={i} value={i}>{i} &nbsp;&nbsp;&nbsp;&nbsp; {i > 0 ? `(VND ${(roomPriceForNights * i).toLocaleString('vi-VN')})` : ''}</option>
                        ))}
                      </select>
                    </td>

                    {/* Reserve Section - Only render button on first row or merge conceptually. Here we just put it on first row spanning */}
                    {idx === 0 && (
                      <td className="p-4 align-top text-center" rowSpan={filteredRooms.length}>
                        {Object.values(roomSelections).some(q => q > 0) ? (
                           <>
                             <div className="font-extrabold text-slate-900 mb-2">{Object.values(roomSelections).reduce((a,b)=>a+b,0)} rooms selected</div>
                             <button onClick={handleBooking} className="bg-sky-600 hover:bg-sky-700 text-white w-full py-2.5 rounded font-bold text-sm shadow mb-2 transition">I'll reserve</button>
                             <ul className="text-[11px] text-slate-600 text-left list-disc pl-4 space-y-1">
                               <li>Instant confirmation</li>
                               <li>No booking or credit card fees!</li>
                             </ul>
                           </>
                        ) : (
                           <div className="bg-slate-50 border border-slate-200 text-slate-400 w-full py-2.5 rounded font-bold text-sm">Select rooms</div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}

        {/* REVIEWS SECTION */}
        <GuestReviews hotelId={hotel.id || hotel.idStr || hotel._id} />

      </div>
    </div>
  );
}