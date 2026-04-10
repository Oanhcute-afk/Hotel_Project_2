import React from "react";
import { MapPin, Target, Users, Heart } from "lucide-react";

export const About = () => {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Chất lượng hàng đầu",
      desc: "Luôn đặt chất lượng dịch vụ lên hàng đầu.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Khách hàng là trung tâm",
      desc: "Mọi nỗ lực đều hướng tới trải nghiệm của khách hàng.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Tận tâm phục vụ",
      desc: "Phục vụ với cả trái tim và sự nhiệt huyết.",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Khám phá không giới hạn",
      desc: "Mang đến những điểm đến ven biển tuyệt đẹp nhất.",
    },
  ];

  return (
    <div className="bg-[#FDFAF6] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565503187147-6b0012bab4da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwYmVhdXRpZnVsJTIwYmVhY2glMjByZXNvcnR8ZW58MXx8fHwxNzc1MTQzMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AquaStays Resort"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Về AquaStays
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl font-light leading-relaxed">
            Chúng tôi sinh ra với sứ mệnh kết nối những trái tim yêu biển với
            những khu nghỉ dưỡng tuyệt vời nhất trên khắp Việt Nam.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                Được thành lập vào năm 2024, AquaStays bắt đầu từ một ý tưởng
                đơn giản: Làm sao để mọi người có thể dễ dàng tìm kiếm và đặt
                phòng tại các khách sạn, resort ven biển một cách minh bạch và
                nhanh chóng nhất.
              </p>
              <p>
                Trải qua quá trình phát triển, chúng tôi tự hào đã trở thành cầu
                nối cho hàng ngàn chuyến đi đáng nhớ, giúp du khách tận hưởng
                trọn vẹn vẻ đẹp của những bãi biển nên thơ trải dài khắp mảnh đất
                hình chữ S.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-96">
            <img
              src="https://images.unsplash.com/photo-1748346918817-0b1b6b2f9bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMGluJTIwbW9kZXJuJTIwb2ZmaWNlfGVufDF8fHx8MTc3NTEwNTY4N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Our Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Giá trị cốt lõi
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kim chỉ nam cho mọi hoạt động của AquaStays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm hover:shadow-xl hover:shadow-sky-50 transition duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition duration-300">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {v.title}
              </h3>
              <p className="text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
