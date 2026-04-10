import { Outlet, Link } from "react-router-dom";
import { Waves, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { AuthModal } from "../../../components/AuthModal";

export function Layout() {
  const { user, setAuthModalOpen, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFAF6] text-slate-800 font-sans flex flex-col relative">
      <AuthModal />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition">
              <Waves className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">
                AquaStays
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-slate-600 hover:text-sky-600 font-medium">
                Trang chủ
              </Link>

              <Link to="/discover" className="text-slate-600 hover:text-sky-600 font-medium">
                Khám phá
              </Link>

              <Link to="/offers" className="text-slate-600 hover:text-sky-600 font-medium">
                Ưu đãi
              </Link>

              <Link to="/support" className="text-slate-600 hover:text-sky-600 font-medium">
                Hỗ trợ
              </Link>

              {(user?.role === 'manager' || user?.role === 'admin') && (
                <Link
                  to="/manager/dashboard"
                  className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100"
                >
                  Quản lý
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">

              {!user ? (
                <>
                  <button
                    onClick={() => setAuthModalOpen('login')}
                    className="text-slate-600 hover:text-sky-600 font-medium"
                  >
                    Đăng nhập
                  </button>

                  <button
                    onClick={() => setAuthModalOpen('register')}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-medium transition shadow-sm shadow-sky-200 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Đăng ký
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 font-medium text-slate-700 hover:text-sky-600 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-full transition"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-sky-600" />
                    )}

                    <span className="max-w-[100px] truncate">
                      {user.username || user.email || 'Khách'}
                    </span>
                  </Link>

                  <button
                    onClick={logout}
                    className="text-slate-500 hover:text-red-500 transition tooltip"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>

                </div>
              )}

            </div>

            {/* Mobile */}
            <button className="md:hidden text-slate-600">
              <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-sky-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 text-sky-600 mb-4">
                <Waves className="h-6 w-6" />
                <span className="font-bold text-lg">AquaStays</span>
              </Link>
              <p className="text-slate-500 text-sm">
                Nền tảng đặt phòng khách sạn ven biển hàng đầu Việt Nam. Tận hưởng kỳ nghỉ trong mơ của bạn.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Về chúng tôi</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/about" className="hover:text-sky-600">Giới thiệu</Link></li>
                <li><Link to="/careers" className="hover:text-sky-600">Tuyển dụng</Link></li>
                <li><Link to="/press" className="hover:text-sky-600">Báo chí</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Khám phá</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/search?q=Phú%20Quốc" className="hover:text-sky-600">Phú Quốc</Link></li>
                <li><Link to="/search?q=Nha%20Trang" className="hover:text-sky-600">Nha Trang</Link></li>
                <li><Link to="/search?q=Đà%20Nẵng" className="hover:text-sky-600">Đà Nẵng</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/support" className="hover:text-sky-600">Trung tâm trợ giúp</Link></li>
                <li><Link to="/privacy" className="hover:text-sky-600">Chính sách bảo mật</Link></li>
                <li><Link to="/terms" className="hover:text-sky-600">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2026 AquaStays. Đã đăng ký bản quyền.
          </div>
        </div>
      </footer>

    </div>
  );
}