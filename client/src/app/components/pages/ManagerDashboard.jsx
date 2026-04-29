import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Hotel as HotelIcon, 
  Calendar, ChevronRight, Package, AlertCircle, Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/manager/stats?range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Không thể kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate, timeRange]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-800 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Bảng điều khiển Quản lý
              </h1>
              <p className="text-slate-500 text-sm">
                Chào mừng trở lại, {user?.username}. Kiểm tra số liệu thống kê của bạn hôm nay.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
              >
                <option value="day">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>

              <Link 
                to="/manager/hotels" 
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Đăng khách sạn
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Tổng doanh thu" 
            value={`${stats?.totalRevenue?.toLocaleString() || 0} VNĐ`} 
            icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
            trend="+12.5%" 
            color="bg-emerald-50"
          />

          <StatCard 
            title="Tỷ lệ lấp đầy" 
            value={`${stats?.occupancyRate || 0}%`} 
            icon={<TrendingUp className="w-6 h-6 text-indigo-600" />} 
            trend="+2.1%" 
            color="bg-indigo-50"
          />

          <StatCard 
            title="Tổng lượt đặt" 
            value={stats?.totalBookings?.toString() || '0'} 
            icon={<Users className="w-6 h-6 text-sky-600" />} 
            trend="+5.2%" 
            color="bg-sky-50"
          />
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-500" />
              Lượt đặt theo thời gian
            </h3>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#0ea5e9" 
                    fill="#0ea5e9" 
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-500" />
                Thao tác nhanh
              </h3>

              <div className="space-y-3">
                <QuickLink to="/manager/hotels" label="Quản lý khách sạn" count={stats?.totalHotels?.toString() || '0'} />
                <QuickLink to="/manager/bookings" label="Danh sách đặt phòng" count={stats?.totalBookings?.toString() || '0'} />
                <QuickLink to="/manager/reviews" label="Đánh giá từ khách" count={stats?.totalReviews?.toString() || '0'} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, trend, color }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>

        {trend && (
          <span className="text-emerald-600 text-xs font-bold">
            {trend}
          </span>
        )}
      </div>

      <p className="text-slate-500 text-sm">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
      {subtitle && <p className="text-xs">{subtitle}</p>}
    </div>
  );
}

function QuickLink({ to, label, count }) {
  return (
    <Link 
      to={to} 
      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50"
    >
      <span>{label}</span>

      <div className="flex items-center gap-2">
        <span className="text-xs bg-slate-100 px-2 py-1 rounded">
          {count}
        </span>

        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}