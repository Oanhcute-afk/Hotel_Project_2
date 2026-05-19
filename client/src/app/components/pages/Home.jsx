import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, Calendar, Users, Ticket, Copy, CheckCircle2, Tag, Star, ChevronRight, Navigation, Compass } from "lucide-react";

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
      {/* Phần Hero (Ảnh bìa & Tìm kiếm) */}
      <section className="relative h-[600px] flex items-center justify-center">
        {/* Ảnh nền */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1632803716902-8d5e1b7246e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhlcm8lMjBvY2VhbiUyMHZpZXd8ZW58MXx8fHwxNzc1MTQyNjE3fDA&ixlib=rb-4.1.0&q=80&w=1080')` }}
        >
          <div className="absolute inset-0 bg-sky-950/40" />
        </div>

        {/* Nội dung Hero */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-12">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-[1.1] tracking-tight">
            Tìm kỳ nghỉ ven biển <br />
            <span className="text-sky-300">trong mơ của bạn</span>
          </h1>


          {/* Thanh tìm kiếm */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-3 md:p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col md:flex-row gap-3 md:gap-5 max-w-5xl mx-auto items-stretch ring-8 ring-white/10"
          >
            {/* Điểm đến */}
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

            {/* Ngày tháng */}
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

            {/* Khách hàng */}
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

            {/* Nút tìm kiếm */}
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

      {/* Phần Khách sạn cao cấp */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="bg-sky-100 text-sky-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-6 h-6 text-amber-600 fill-amber-600 " />
          </div>

          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight text-center">Khách sạn cao cấp</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto text-center leading-relaxed -ml-50">Khám phá bộ sưu tập những khách sạn sang trọng bậc nhất, mang đến trải nghiệm nghỉ dưỡng đẳng cấp 5 sao.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...HOTELS].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 3).map((hotel) => {
            const urlId = hotel.id || hotel.idStr || hotel._id;
            return (
              <div
                key={urlId}
                onClick={() => {
                  if (urlId) navigate(`/hotel/${urlId}`);
                }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/50">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.stars || 5} sao</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-sky-600 transition line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(hotel.stars || 0)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-400" /> {hotel.location}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Giá chỉ từ</span>
                      <span className="text-xl font-black text-sky-600">{hotel.price.toLocaleString('vi-VN')} ₫</span>
                      <span className="text-xs text-slate-400 font-medium"> / đêm</span>
                    </div>
                    <button className="bg-sky-50 text-sky-600 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Phần Khuyến mãi */}
      {vouchers.length > 0 && (
        <section className="py-20 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="bg-sky-100 text-sky-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-6 h-6 text-sky-600" />
              </div>

              <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Khuyến mãi & Ưu đãi đặc biệt</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto text-center leading-relaxed">Tận hưởng những ưu đãi độc quyền từ AquaStays để có kỳ nghỉ mơ ước với chi phí tối ưu nhất.</p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vouchers.map((voucher) => {
                const discountDisplay = voucher.type === 'percent'
                  ? (voucher.value <= 1 ? (voucher.value * 100) : voucher.value) + '%'
                  : voucher.value.toLocaleString('vi-VN') + '₫';

                return (
                  <div key={voucher.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={voucher.image || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={voucher.label}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-[#FF3B3B] text-white px-3 py-1 rounded-md text-xs font-bold shadow flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        {voucher.category || 'Ưu đãi'}
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-sky-600 px-3 py-1 rounded-lg text-sm font-black shadow-sm border border-white/50">
                        Giảm {discountDisplay}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-[#1A2B4C] mb-3">{voucher.label}</h3>
                      <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
                        {voucher.description || `Nhận ngay ưu đãi giảm ${discountDisplay} khi đặt phòng và thanh toán trực tuyến qua AquaStays.`}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          Hết hạn: {voucher.expiryDate || '31/05/2026'}
                        </div>

                        <button
                          onClick={() => copyToClipboard(voucher.code)}
                          className="text-sm font-bold text-sky-600 hover:text-sky-700 transition flex items-center gap-1"
                        >
                          {copiedCode === voucher.code ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              Đã lưu!
                            </>
                          ) : (
                            <>
                              Khám phá ngay
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Phần Đang thịnh hành */}
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
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/50">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{hotel.stars || 5} sao</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex flex-col gap-1.5 mb-2">
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-sky-600 transition">{hotel.name}</h3>
                      <div className="flex items-center">
                        {[...Array(hotel.stars || 0)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
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
              )
            })}
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