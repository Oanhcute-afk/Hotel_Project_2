import React from 'react';
import { Link } from "react-router-dom";
import { Waves } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-sky-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-sky-600 mb-6">
              <Waves className="h-8 w-8" />
              <span className="font-black text-2xl tracking-tighter">AquaStays</span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Nền tảng đặt phòng khách sạn ven biển hàng đầu Việt Nam. Tận hưởng kỳ nghỉ trong mơ của bạn với dịch vụ tận tâm và chất lượng tuyệt vời nhất.
            </p>
          </div>

          <div>
            <h3 className="font-black text-slate-800 mb-6 text-xl uppercase tracking-wider">Về chúng tôi</h3>
            <ul className="space-y-4 text-base font-bold text-slate-600">
              <li><Link to="/about" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Giới thiệu</Link></li>
              <li><Link to="/careers" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Tuyển dụng</Link></li>
              <li><Link to="/press" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Báo chí</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-slate-800 mb-6 text-xl uppercase tracking-wider">Khám phá</h3>
            <ul className="space-y-4 text-base font-bold text-slate-600">
              <li><Link to="/search?q=Phú%20Quốc" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Phú Quốc</Link></li>
              <li><Link to="/search?q=Nha%20Trang" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Nha Trang</Link></li>
              <li><Link to="/search?q=Đà%20Nẵng" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Đà Nẵng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-slate-800 mb-6 text-xl uppercase tracking-wider">Hỗ trợ</h3>
            <ul className="space-y-4 text-base font-bold text-slate-600">
              <li><Link to="/support" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Trung tâm trợ giúp</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="hover:text-sky-600 hover:pl-2 transition-all duration-300">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 mt-12 pt-8 text-center text-sm font-bold text-slate-400">
          © 2026 AquaStays. Đã đăng ký bản quyền. Mọi quyền lợi được bảo hộ.
        </div>
      </div>
    </footer>
  );
}
