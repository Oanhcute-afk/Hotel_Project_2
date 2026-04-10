import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  ArrowRight,
  X,
  Mail,
  CheckCircle,
  Gift,
  Star,
} from "lucide-react";

export const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    {
      title: "Senior Frontend Developer (React)",
      department: "Engineering",
      location: "Hà Nội",
      type: "Full-time",
      salary: "25tr - 45tr VND",
      description:
        "Chúng tôi tìm kiếm chuyên gia React tài năng để tối ưu hóa trải nghiệm người dùng trên nền tảng AquaStays. Bạn sẽ lead các dự án quan trọng về UX/UI và Micro-frontends.",
      requirements: [
        "Ít nhất 4 năm kinh nghiệm làm việc với React/TypeScript.",
        "Sử dụng thành thạo Tailwind CSS và Framer Motion.",
        "Có tư duy thiết kế và tối ưu hiệu năng tốt.",
        "Kỹ năng giải quyết vấn đề và làm việc nhóm xuất sắc.",
      ],
      benefits: [
        "Môi trường làm việc trẻ trung, năng động.",
        "Thưởng KPI tháng, quý, năm hấp dẫn.",
        "Đóng BHXH đầy đủ, bảo hiểm sức khỏe PVI.",
        "Du lịch cùng công ty 2 lần/năm.",
      ],
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Hồ Chí Minh",
      type: "Full-time",
      salary: "20tr - 35tr VND",
      description:
        "Tham gia kiến tạo ngôn ngữ thiết kế mới cho hệ thống AquaStays từ Website đến Mobile App. Tập trung vào 'Coastal Aesthetics' - phong cách nghỉ dưỡng ven biển.",
      requirements: [
        "Ít nhất 3 năm kinh nghiệm Product Design (UI/UX).",
        "Thành thạo Figma, Prototyping.",
        "Yêu thích phong cách thiết kế hiện đại, sạch sẽ.",
        "Có kiến thức về Design System.",
      ],
      benefits: [
        "Laptop Macbook Pro đời mới nhất.",
        "Voucher nghỉ dưỡng 5 sao miễn phí cho gia đình.",
        "Tea-break hàng chiều, Pantry đầy đủ snacks.",
        "Thưởng sáng tạo hàng tháng.",
      ],
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Đà Nẵng",
      type: "Full-time",
      salary: "15tr - 25tr VND",
      description:
        "Đảm bảo mọi khách hàng tại AquaStays đều có trải nghiệm nghỉ dưỡng hoàn hảo nhất. Quản lý feedback và cộng tác với các đối tác khách sạn.",
      requirements: [
        "Ít nhất 2 năm kinh nghiệm ở vị trí tương đương.",
        "Kỹ năng giao tiếp và xử lý tình huống khéo léo.",
        "Ngoại ngữ: Tiếng Anh giao tiếp tốt (IELTS 6.0+).",
        "Có đam mê với ngành du lịch, khách sạn.",
      ],
      benefits: [
        "Phụ cấp ăn trưa, xăng xe đầy đủ.",
        "Lương tháng 13 + thưởng nóng theo hiệu suất.",
        "Tham gia các lộ trình đào tạo kỹ năng mềm chuyên sâu.",
        "Cơ hội thăng tiến lên Head of Operations.",
      ],
    },
  ];

  const handleApply = (jobTitle) => {
    const subject = encodeURIComponent(
      `Ứng tuyển vị trí ${jobTitle} - [Họ tên của bạn]`
    );
    const body = encodeURIComponent(
      `Chào bộ phận Tuyển dụng AquaStays,\n\nTôi rất quan tâm đến vị trí ${jobTitle} và muốn gửi CV để ứng tuyển. Dưới đây là thông tin giới thiệu ngắn về tôi:\n\n- Họ tên: \n- Số điện thoại: \n- Link LinkedIn/Portfolio: \n\nTôi mong muốn có cơ hội được phỏng vấn cùng quý công ty.\n\nTrân trọng,\n[Họ tên của bạn]`
    );

    window.location.href = `mailto:tuyendung@aquastays.vn?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-[#FDFAF6] min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6">
            Đồng hành cùng AquaStays
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Tham gia cùng chúng tôi để kiến tạo nên nền tảng đặt phòng nghỉ dưỡng ven biển tốt nhất Việt Nam.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl mb-24 h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1756885465373-bce82fd5c944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
            alt="Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent flex items-center">
            <div className="p-8 md:p-16 max-w-lg text-white">
              <h2 className="text-3xl font-bold mb-4">Môi trường làm việc mở</h2>
              <p className="text-lg opacity-90">
                Chúng tôi đề cao sự sáng tạo và phát triển cá nhân.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {jobs.map((job, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedJob(job)}
              className="bg-white p-6 rounded-2xl border hover:shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-bold">{job.title}</h3>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Briefcase size={16} /> {job.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> {job.location}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
