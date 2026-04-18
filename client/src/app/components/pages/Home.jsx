import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Calendar, Users, Ticket, Copy, CheckCircle2, Tag } from "lucide-react";

export function Home() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch('/api/vouchers');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setVouchers(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchVouchers();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [DESTINATIONS, setDestinations] = useState([]);
  const [HOTELS, setHotels] = useState([]);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setDestinations(data);
        else console.error('Expected array of destinations, got:', data);
      })
      .catch(console.error);

    fetch('/api/hotels')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setHotels(data);
        else console.error('Expected array of hotels, got:', data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('q', destination);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1632803716902-8d5e1b7246e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhlcm8lMjBvY2VhbiUyMHZpZXd8ZW58MXx8fHwxNzc1MTQyNjE3fDA&ixlib=rb-4.1.0&q=80&w=1080')` }}
        >
          <div className="absolute inset-0 bg-sky-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-12">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-[1.1] tracking-tight">
            Tìm kỳ nghỉ ven biển <br />
            <span className="text-sky-300">trong mơ của bạn</span>
          </h1>
          <p className="text-lg md:text-2xl text-sky-50/90 mb-12 font-medium max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Khám phá hàng ngàn resort và khách sạn cao cấp dọc bờ biển xanh mát.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-3 md:p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col md:flex-row gap-3 md:gap-5 max-w-5xl mx-auto items-stretch ring-8 ring-white/10"
          >
            {/* Destination */}
            <div className="flex-[1.5] flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500/50 transition-all">
              <MapPin className="text-sky-500 w-6 h-6 flex-shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Điểm đến</span>
                <input
                  type="text"
                  placeholder="Nơi bạn muốn đến?"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-bold text-base"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex-[2] flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500/50 transition-all">
                <Calendar className="text-sky-500 w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Nhận phòng</span>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full cursor-pointer appearance-none"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500/50 transition-all">
                <Calendar className="text-sky-500 w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col w-full text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Trả phòng</span>
                  <input
                    type="date"
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent outline-none text-slate-800 font-bold text-sm w-full cursor-pointer appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500/50 transition-all">
              <Users className="text-sky-500 w-6 h-6 flex-shrink-0" />
              <div className="flex flex-col text-left w-full">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Khách & Phòng</span>
                <input
                  type="text"
                  placeholder="2 Người lớn, 1 Phòng"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-bold text-base"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="md:w-16 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-sky-500/30 transition-all transform active:scale-95 py-4 md:py-0"
            >
              <Search className="w-6 h-6" />
              <span className="md:hidden">Tìm kiếm ngay</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Điểm đến nổi bật</h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed text-center">Khám phá những vùng biển đẹp nhất Việt Nam với cát trắng, nắng vàng và làn nước trong xanh.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {DESTINATIONS.slice(0, 4).map((dest) => {
            const count = HOTELS.filter(h => h.location.toLowerCase().includes(dest.name.toLowerCase())).length;
            return (
            <div key={dest.id} onClick={() => navigate(`/search?q=${encodeURIComponent(dest.name)}`)} className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 shadow-md bg-slate-100 flex items-center justify-center">
              {dest.image ? (
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
              ) : (
                <MapPin className="w-12 h-12 text-slate-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><MapPin className="w-5 h-5 text-sky-400" /> {dest.name}</h3>
                <p className="text-slate-200 text-sm font-medium">{count} chỗ nghỉ tuyệt vời</p>
              </div>
            </div>
          )})}
        </div>
      </section>

      {/* Special Offers Section */}
      {vouchers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-[#1A2B4C] mb-4 tracking-tight">Khuyến mãi & Ưu đãi</h2>
              <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed text-center">Khám phá các chương trình khuyến mãi độc quyền từ AquaStays để tận hưởng kỳ<br/>nghỉ tuyệt vời với mức giá siêu ưu đãi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={voucher.image || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={voucher.label} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4 bg-[#FF3B3B] text-white px-3 py-1 rounded-md text-xs font-bold shadow flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {voucher.category || 'Ưu đãi'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#1A2B4C] mb-3">{voucher.label}</h3>
                    <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
                      {voucher.description || `Giảm ngay ${voucher.type === 'percent' ? voucher.value * 100 + '%' : voucher.value.toLocaleString() + '₫'} khi thanh toán.`}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        Hết hạn: {voucher.expiryDate || '31/05/2026'}
                      </div>
                      
                      <button 
                         onClick={() => copyToClipboard(voucher.code)} 
                         className="text-sm font-bold text-sky-600 hover:text-sky-700 transition"
                      >
                         {copiedCode === voucher.code ? 'Đã lưu mã!' : 'Khám phá ngay →'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-20 border-t border-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Đang thịnh hành</h2>
              <p className="text-slate-500">Các chỗ nghỉ ven biển được yêu thích nhất trong tuần qua.</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="hidden md:block text-sky-600 font-semibold hover:text-sky-700 transition"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOTELS.slice(0, 4).map((hotel) => {
              const urlId = hotel.id || hotel.idStr || hotel._id;
              return (
              <div
                key={urlId}
                onClick={() => {
                   if (urlId) navigate(`/hotel/${urlId}`);
                }}
                className="group flex flex-col bg-[#FDFAF6] rounded-2xl overflow-hidden border border-sky-100 hover:shadow-xl hover:shadow-sky-100/50 transition cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                    ⭐ {hotel.rating}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-sky-600 transition">{hotel.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                  </p>
                  <div className="mt-auto pt-4 border-t border-sky-100/50 flex justify-between items-end">
                    <div>
                      <span className="text-xs text-slate-500 block">Bắt đầu từ</span>
                      <span className="text-lg font-bold text-sky-600">{hotel.price.toLocaleString('vi-VN')} ₫</span>
                      <span className="text-xs text-slate-500"> / đêm</span>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>

          <button
            onClick={() => navigate('/search')}
            className="md:hidden w-full mt-8 py-3 border border-sky-200 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition">
            Xem tất cả chỗ nghỉ
          </button>
        </div>
      </section>
    </div>
  );
}