import React from 'react';
import { Link } from "react-router-dom";
import { Waves, User, LogOut } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export function Navbar() {
  const { user, setAuthModalOpen, logout } = useAuth();

  return (
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
            <Link to="/" className="text-slate-600 hover:text-sky-600 font-bold text-lg transition-all hover:scale-105">
              Trang chủ
            </Link>

            <Link to="/discover" className="text-slate-600 hover:text-sky-600 font-bold text-lg transition-all hover:scale-105">
              Khám phá
            </Link>

            <Link to="/offers" className="text-slate-600 hover:text-sky-600 font-bold text-lg transition-all hover:scale-105">
              Ưu đãi
            </Link>

            <Link to="/support" className="text-slate-600 hover:text-sky-600 font-bold text-lg transition-all hover:scale-105">
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
                  className="text-slate-600 hover:text-sky-600 font-bold"
                >
                  Đăng nhập
                </button>

                <button
                  onClick={() => setAuthModalOpen('register')}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-bold transition shadow-sm shadow-sky-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Đăng ký
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">

                <Link
                  to="/profile"
                  className="flex items-center gap-2 font-bold text-slate-700 hover:text-sky-600 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-full transition"
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}
