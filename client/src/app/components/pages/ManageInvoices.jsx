import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Receipt, Search, Calendar, DollarSign, User, 
  Hotel, CreditCard, ChevronRight, FileText, CheckCircle, 
  Clock, AlertTriangle
} from 'lucide-react';

export default function ManageInvoices() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/manager/bookings', {
          headers: { 'Authorization': `Bearer ${user?.token}` }
        });
        const data = await res.json();
        if (data.success) setBookings(data.bookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredInvoices = bookings.filter(b => 
    b.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const displayedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': 
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      default: return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Receipt className="w-8 h-8 text-sky-500" />
            Quản lý Hóa đơn
          </h1>
          <p className="text-slate-500 mt-1">
            Theo dõi các giao dịch thanh toán và thông tin đặt phòng khách sạn.
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm theo số hóa đơn hoặc tên khách..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Hóa đơn</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Chi tiết đặt phòng</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Thanh toán</th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {displayedInvoices.map(b => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition group">
                    
                    {/* Hóa đơn */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-sky-100 group-hover:text-sky-600 transition">
                            <FileText className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-black text-slate-900">
                              {b.invoiceNumber || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                      </div>
                    </td>

                    {/* Khách hàng */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">
                          {b.firstName} {b.lastName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {b.email}
                        </p>
                      </div>
                    </td>

                    {/* Booking */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                           <Hotel className="w-3.5 h-3.5 text-slate-400" />
                           {b.hotelId}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           {new Date(b.checkIn).toLocaleDateString()} - 
                           {new Date(b.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900">
                          {b.totalPrice.toLocaleString()}₫
                        </p>

                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <CreditCard className="w-3 h-3" />
                           {b.paymentMethod === 'credit_card'
                             ? 'Thẻ tín dụng'
                             : b.paymentMethod === 'atm'
                             ? 'Thẻ ATM'
                             : 'Tiền mặt'}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(b.status)}`}>
                         {getStatusIcon(b.status)}
                         {b.status === 'paid'
                           ? 'Đã thanh toán'
                           : b.status === 'pending'
                           ? 'Chờ thanh toán'
                           : 'Đã hủy'}
                       </span>
                    </td>

                    {/* Button */}
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

          {filteredInvoices.length === 0 && (
            <div className="py-20 text-center">
              <Receipt className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">
                Chưa có hóa đơn nào
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-6 border-t border-slate-100">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition font-medium text-sm text-slate-600"
              >
                Trước
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-9 h-9 rounded-xl transition text-sm font-bold ${currentPage === idx + 1 ? 'bg-sky-500 text-white shadow-md' : 'border border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition font-medium text-sm text-slate-600"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}