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
          id: v.id,
          title: v.label || "Ưu đãi",
          description: v.description,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-xl hover:shadow-sky-50 transition duration-300 group flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md shadow-red-500/20">
                  <Tag className="w-3 h-3" /> {offer.tag}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  {offer.title}
                </h3>

                <p className="text-slate-600 mb-6 flex-grow">
                  {offer.description}
                </p>

                <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                    <Clock className="w-4 h-4 text-sky-500" />
                    {offer.validUntil}
                  </span>

                  <Link
                    to="/search"
                    className="text-sky-600 font-bold hover:text-sky-700 transition"
                  >
                    Khám phá ngay →
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