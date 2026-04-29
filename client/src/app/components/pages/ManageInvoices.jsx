import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Receipt, Search, Calendar, DollarSign, User, 
  Hotel, CreditCard, ChevronRight, FileText, CheckCircle, 
  Clock, AlertTriangle, Trash2, X, Eye, MapPin, Ticket
} from 'lucide-react';

export default function ManageInvoices() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này? Thao tác này không thể hoàn tác.')) return;

    try {
      const res = await fetch(`/api/manager/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b._id !== id));
        if (selectedInvoice?._id === id) setSelectedInvoice(null);
      } else {
        alert(data.message || 'Lỗi khi xóa hóa đơn');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối server');
    }
  };

  const filteredInvoices = bookings.filter(b => 
    b.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedInvoices = filteredInvoices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredInvoices.length;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
                          {b.totalPrice?.toLocaleString()}₫
                        </p>

                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                           <CreditCard className="w-3 h-3" />
                           {b.paymentMethod === 'credit_card'
                             ? 'Thẻ tín dụng'
                             : b.paymentMethod === 'atm'
                             ? 'Thẻ ATM'
                             : b.paymentMethod === 'qr'
                             ? 'Mã QR'
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

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                         <button 
                           onClick={() => setSelectedInvoice(b)}
                           className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
                           title="Xem chi tiết"
                         >
                           <Eye className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => handleDelete(b._id)}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                           title="Xóa hóa đơn"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                       </div>
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

          {hasMore && (
            <div className="p-8 flex justify-center border-t border-slate-50">
               <button 
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="px-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-900 hover:bg-slate-50 hover:border-sky-200 hover:text-sky-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 group"
               >
                 Xem thêm hóa đơn
                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
               </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center">
                  <Receipt className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Chi tiết hóa đơn</h2>
                  <p className="text-slate-500 font-medium">#{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {/* Customer & Booking Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-500" />
                    Thông tin khách hàng
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900">{selectedInvoice.firstName} {selectedInvoice.lastName}</p>
                    <p className="text-sm text-slate-600">{selectedInvoice.email}</p>
                    <p className="text-sm text-slate-600">{selectedInvoice.phone}</p>
                    <p className="text-sm text-slate-600 mt-2 font-medium">CCCD: {selectedInvoice.cccd || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-sky-500" />
                    Thông tin đặt phòng
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900">{selectedInvoice.hotelId}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(selectedInvoice.checkIn).toLocaleDateString()} - {new Date(selectedInvoice.checkOut).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-slate-600 mt-2 font-medium">Khách: {selectedInvoice.guests} người</p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-sky-500" />
                  Chi tiết thanh toán
                </h3>
                <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Tạm tính</span>
                    <span>{selectedInvoice.subTotal?.toLocaleString()}₫</span>
                  </div>
                  {selectedInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 text-sm">
                      <span className="flex items-center gap-1"><Ticket className="w-3.5 h-3.5"/> Giảm giá</span>
                      <span>-{selectedInvoice.discountAmount?.toLocaleString()}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Thuế & phí (10%)</span>
                    <span>{selectedInvoice.taxAmount?.toLocaleString()}₫</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="text-2xl font-black text-sky-400">{selectedInvoice.totalPrice?.toLocaleString()}₫</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest pt-2">
                    <CreditCard className="w-3 h-3" />
                    Thanh toán qua: {selectedInvoice.paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 flex gap-4 bg-slate-50/50">
               <button 
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition"
               >
                 Đóng
               </button>
               <button 
                onClick={() => handleDelete(selectedInvoice._id)}
                className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition flex items-center justify-center gap-2"
               >
                 <Trash2 className="w-5 h-5" />
                 Xóa hóa đơn
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}