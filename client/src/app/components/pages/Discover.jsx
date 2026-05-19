import { Map, MapPin, Compass, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { DESTINATIONS } from "../data";

export function Discover() {
  const articles = [
    {
      id: 1,
      title: "Cẩm nang du lịch Phú Quốc 3 ngày 2 đêm từ A-Z",
      excerpt:
        "Khám phá đảo ngọc Phú Quốc với lịch trình chi tiết, những bãi biển hoang sơ đẹp nhất và ẩm thực hải sản phong phú.",
      image:
        "https://images.unsplash.com/photo-1698809807960-758cf416e96e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHUlMjBxdW9jJTIwYmVhY2glMjB2aWV0bmFtfGVufDF8fHx8MTc3NTE0MjYxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      link:
        "https://www.bing.com/videos/riverview/relatedvideo?q=du+l%e1%bb%8bch+ph%c3%ba+qu%e1%bb%91c+3+ng%c3%a0y+2+%c4%91%c3%aam&mid=E7394A241F7FDB8C5653E7394A241F7FDB8C5653&FORM=VIRE",
    },
    {
      id: 2,
      title: "Top 5 vịnh biển đẹp nhất Việt Nam phải đến một lần",
      excerpt:
        "Từ Vịnh Hạ Long hùng vĩ đến Vịnh Ninh Vân hoang sơ, điểm danh những vùng vịnh đẹp đến nao lòng của nước ta.",
      image:
        "https://images.unsplash.com/photo-1671468158340-11c74b9466d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwaGFsb25nJTIwYmF5JTIwb3IlMjBiZWFjaHxlbnwxfHx8fDE3NzUxNDMwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      link:
        "https://www.bing.com/search?pglt=427&q=top+5+vịnh+biển",
    },
    {
      id: 3,
      title: "Trải nghiệm resort cao cấp tại Đà Nẵng",
      excerpt:
        "Review chân thực về những khu nghỉ dưỡng 5 sao bậc nhất bên bờ biển Mỹ Khê thơ mộng, nơi đáng sống nhất Việt Nam.",
      image:
        "https://images.unsplash.com/photo-1771425953641-cb49685460b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYSUyMG5hbmclMjBicmlkZ2UlMjByaXZlcnxlbnwxfHx8fDE3NzUxNDI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      link:
        "https://danangfantasticity.com/cam-nang/top-resort-dang-cap-nhat-tai-da-nang.html",
    },
  ];

  return (
    <div className="bg-[#FDFAF6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Hero */}

        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="bg-sky-100 text-sky-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-6 h-6 text-sky-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
            Khám phá vùng đất mới
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Cùng AquaStays tìm hiểu về những điểm đến ven biển xinh đẹp và tận hưởng kỳ nghỉ trọn vẹn.
          </p>
        </div>


        {/* Featured Destinations */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Map className="w-6 h-6 text-sky-500" />
            Điểm đến hấp dẫn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <Link
                to={`/search?q=${dest.name}`}
                key={dest.id}
                className="group relative rounded-3xl overflow-hidden cursor-pointer h-80 shadow-md"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-sky-300" />
                      {dest.name}
                    </h3>
                    <p className="text-sky-200 font-medium">
                      {dest.properties} chỗ nghỉ tuyệt vời
                    </p>
                  </div>

                  <div className="bg-white/20 backdrop-blur p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Navigation className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Travel Guides */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-t border-slate-200 pt-12">
            Cẩm nang du lịch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-sky-100 hover:shadow-xl hover:shadow-sky-50 transition duration-300 group flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-sky-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Review trải nghiệm
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group-hover:text-sky-600 transition"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-3 leading-snug">
                      {article.title}
                    </h3>
                  </a>

                  <p className="text-slate-600 mb-6 flex-grow line-clamp-3 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>

                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 font-bold hover:text-sky-700 transition self-start text-sm border-b-2 border-sky-600 pb-0.5"
                  >
                    Đọc tiếp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}