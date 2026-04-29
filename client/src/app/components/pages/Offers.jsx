import { Percent, Tag, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/vouchers');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        const formattedOffers = data.map(v => ({
          id: v.id || v._id,
          code: v.code,
          title: v.label || "Ưu đãi",
          description: v.description,
          type: v.type,
          value: v.value,
          image: v.image || "https://images.unsplash.com/photo-1723942699831-ae8f323a43bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBiZWFjaCUyMHZhY2F0aW9ufGVufDF8fHx8MTc3NTExNjMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
          validUntil: v.expiryDate,
          tag: v.category || "Chung"
        }));
        setOffers(formattedOffers);
      } catch (err) {
        console.error("Error fetching vouchers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="bg-[#FDFAF6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="bg-sky-100 text-sky-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Percent className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
            Khuyến mãi & Ưu đãi
          </h1>

          <p className="text-slate-600 text-lg">
            Khám phá các chương trình khuyến mãi độc quyền từ AquaStays để tận hưởng kỳ nghỉ tuyệt vời với mức giá siêu ưu đãi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-10">
              Hiện tại chưa có ưu đãi nào.
            </div>
          ) : offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-[40px] overflow-hidden border border-sky-100 shadow-sm hover:shadow-2xl hover:shadow-sky-100/30 transition-all duration-500 group flex flex-col h-full hover:-translate-y-2"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                {/* Tag Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                  <Tag className="w-3.5 h-3.5 text-sky-500" /> {offer.tag}
                </div>

                {/* Discount Badge */}
                <div className="absolute bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-[24px] shadow-2xl shadow-red-500/40 flex flex-col items-center justify-center animate-pulse border-2 border-white/30">
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">Giảm</span>
                  <span className="text-2xl font-black">
                    {offer.type === 'percent' ? `-${offer.value}%` : `-${(offer.value / 1000).toLocaleString()}k`}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-sky-100">
                    Mã: {offer.code}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {offer.title}
                </h3>

                <p className="text-slate-500 font-bold leading-relaxed mb-8 flex-grow line-clamp-3">
                  {offer.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Hạn dùng</span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 font-bold">
                      <Clock className="w-4 h-4 text-sky-500" />
                      {offer.validUntil}
                    </span>
                  </div>

                  <Link
                    to="/search"
                    className="bg-slate-900 hover:bg-sky-600 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-sky-200 group/btn"
                  >
                    <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}