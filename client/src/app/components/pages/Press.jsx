import { ArrowUpRight, Download } from "lucide-react";

export function Press() {
  const news = [
    {
      date: "15 Tháng 3, 2026",
      title: "AquaStays nhận giải thưởng Nền tảng Du lịch Sáng tạo nhất 2026",
      publication: "Vietnam Travel Award",
      link: "#"
    },
    {
      date: "02 Tháng 2, 2026",
      title: "Khởi động chiến dịch 'Làm sạch biển' cùng các đối tác resort 5 sao",
      publication: "Báo Môi Trường",
      link: "#"
    },
    {
      date: "10 Tháng 12, 2025",
      title: "AquaStays công bố nhận khoản đầu tư vòng Series A trị giá 10 triệu USD",
      publication: "TechAsia",
      link: "#"
    }
  ];

  return (
    <div className="bg-[#FDFAF6] min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-200 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">
              Góc Báo chí
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Cập nhật những tin tức mới nhất, thông cáo báo chí và tài nguyên truyền thông về hành trình của AquaStays.
            </p>
          </div>

          <div className="flex-shrink-0">
            <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Liên hệ báo chí
            </p>
            <a
              href="mailto:press@aquastays.vn"
              className="text-sky-600 font-bold text-lg hover:underline"
            >
              press@aquastays.vn
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Tin tức nổi bật
            </h2>

            {news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="block group bg-white p-6 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-3">
                  <span className="text-sky-600">
                    {item.publication}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{item.date}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition mb-4 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1 text-sky-500 font-medium text-sm group-hover:gap-2 transition-all">
                  Đọc toàn bài
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>

          <div className="space-y-8">

            <div className="bg-sky-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">
                  Tài nguyên Truyền thông
                </h3>

                <p className="text-sky-200 mb-8 opacity-90">
                  Tải xuống bộ nhận diện thương hiệu, logo chất lượng cao và hình ảnh giới thiệu của chúng tôi.
                </p>

                <button className="bg-white text-sky-900 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-sky-50 transition w-full">
                  <Download className="w-5 h-5" />
                  Tải Brand Kit (ZIP)
                </button>
              </div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sky-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-400 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-sky-100 h-64">
              <img
                src="https://images.unsplash.com/photo-1557804506-e969d7b32a4b"
                alt="Press Media"
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-500"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}