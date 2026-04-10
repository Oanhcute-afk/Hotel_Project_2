import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  LayoutDashboard, Home, Building2, Ticket, 
  Users, Receipt, LogOut, Waves, User
} from 'lucide-react';

export function ManagerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Trang chủ', path: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Quản lý khách sạn', path: '/manager/hotels', icon: <Building2 className="w-5 h-5" /> },
    { label: 'Quản lý voucher', path: '/manager/vouchers', icon: <Ticket className="w-5 h-5" /> },
    { label: 'Quản lý khách hàng', path: '/manager/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Quản lý hóa đơn', path: '/manager/invoices', icon: <Receipt className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-[100] shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link 
                to="/manager/dashboard" 
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition"
              >
                <Waves className="h-8 w-8" />
                <span className="font-bold text-xl tracking-tighter">
                  AquaStays 
                  <span className="text-white/50 text-xs uppercase tracking-widest ml-1">
                    Admin
                  </span>
                </span>
              </Link>
            </div>

            {/* Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User */}
            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {user?.role}
                  </p>

                  <p className="text-sm font-bold text-white truncate max-w-[150px]">
                    {user?.username}
                  </p>
                </div>

                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border-2 border-sky-500 p-0.5"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}

              </div>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1500px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            © 2026 AquaStays Management Portal. Vận hành bởi Admin System.
          </p>
        </div>
      </footer>

    </div>
  );
}