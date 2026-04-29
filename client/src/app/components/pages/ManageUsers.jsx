import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Users, Search, User as UserIcon, Mail, Phone,
  MapPin, Calendar, ShieldCheck, ExternalLink, ChevronRight, Clock
} from 'lucide-react';

export default function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/manager/users', {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const data = await res.json();
        if (data.success) setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    (u.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredUsers.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-sky-500" />
            Quản lý Khách hàng
          </h1>
          <p className="text-slate-500 mt-1">
            Xem và quản lý thông tin các tài khoản khách hàng trên hệ thống.
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(8); }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Địa chỉ</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Hoạt động mới nhất</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Thống kê</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {displayedUsers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition group">
                    
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden bg-sky-100 flex-shrink-0">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sky-600">
                              <UserIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {u.username}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            #{u._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {u.email}
                        </div>

                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {u.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 max-w-[200px]">
                        <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                        <span className="truncate">
                          {u.address || '—'}
                        </span>
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          {u.lastLogin
                            ? `Đăng nhập: ${new Date(u.lastLogin).toLocaleString()}`
                            : 'Chưa đăng nhập'}
                        </div>

                        {u.lastBookingDate && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium italic">
                            <Calendar className="w-3 h-3" />
                            Đặt lần cuối:{" "}
                            {new Date(u.lastBookingDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider w-fit">
                          <ShieldCheck className="w-3 h-3" />
                          {u.totalBookings || 0} Đơn đặt
                        </span>

                        <span className="text-[10px] text-slate-400 ml-2 font-bold uppercase tracking-tighter">
                          Thành viên {u.role}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-sky-500 transition opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <UserIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">
                Không tìm thấy khách hàng nào
              </p>
            </div>
          )}

          {hasMore && (
            <div className="p-8 flex justify-center border-t border-slate-100">
              <button 
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="px-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-900 hover:bg-slate-50 hover:border-sky-200 hover:text-sky-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 group"
              >
                Xem thêm người dùng
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}