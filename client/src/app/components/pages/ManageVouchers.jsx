import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Ticket, Plus, Edit2, Trash2, Search, 
  Percent, DollarSign, Calendar, X, Save, AlertCircle, Image as ImageIcon, ChevronRight
} from 'lucide-react';

export default function ManageVouchers() {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    label: '',
    category: 'Chung',
    description: 'Áp dụng cho tất cả các khách sạn thuộc hệ thống AquaStays.',
    expiryDate: 'Kéo dài suốt năm 2026',
    type: 'percent',
    value: 0,
    maxDiscount: 0,
    image: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchVouchers = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:5000/api/manager/vouchers', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) setVouchers(data.vouchers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
       fetchVouchers();
    }
  }, [user]);

  const filteredVouchers = vouchers.filter(v => 
    (v.code || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.label || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedVouchers = filteredVouchers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVouchers.length;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: '' })); // Xóa URL khi file được chọn
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingVoucher 
      ? `http://localhost:5000/api/manager/vouchers/${editingVoucher._id}`
      : 'http://localhost:5000/api/manager/vouchers';
    
    const method = editingVoucher ? 'PUT' : 'POST';

    try {
      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (
          key !== '_id' &&
          key !== 'createdAt' &&
          key !== 'updatedAt' &&
          key !== '__v'
        ) {
          data.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${user?.token}` 
        },
        body: data
      });

      const resData = await res.json();

      if (resData.success) {
        setIsModalOpen(false);
        setEditingVoucher(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchVouchers();
      }

    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/manager/vouchers/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user?.token}` }
        }
      );

      const data = await res.json();

      if (data.success) fetchVouchers();

    } catch (err) {
      console.error(err);
    }
  };

   return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Ticket className="w-8 h-8 text-sky-500" />
            Quản lý Voucher
          </h1>
          <p className="text-slate-500 mt-1">Tạo và quản lý các chương trình khuyến mãi của bạn.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
                type="text" 
                placeholder="Tìm kiếm voucher..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(6); }}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" 
             />
          </div>
          <button 
            onClick={() => {
              setEditingVoucher(null);
              setFormData({ 
                code: '', 
                label: '', 
                category: 'Chung',
                description: 'Áp dụng cho tất cả các khách sạn thuộc hệ thống AquaStays.',
                expiryDate: 'Kéo dài suốt năm 2026',
                type: 'percent', 
                value: 0, 
                maxDiscount: 0, 
                image: '' 
              });
              setSelectedFile(null);
              setPreviewUrl(null);
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tạo Voucher
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVouchers.map(voucher => (
              <div key={voucher._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition group relative overflow-hidden flex flex-col">
                 <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                    {voucher.image ? (
                      <img src={voucher.image} alt="Voucher" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-sky-50">
                         <Ticket className="w-10 h-10 text-sky-200" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-sky-600 shadow-sm">
                      {voucher.code}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { 
                          setEditingVoucher(voucher); 
                          setFormData(voucher); 
                          setPreviewUrl(null);
                          setSelectedFile(null);
                          setIsModalOpen(true); 
                        }} className="p-2 bg-white/90 backdrop-blur-md text-slate-800 rounded-full hover:bg-white transition shadow-sm">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(voucher._id)} className="p-2 bg-red-500/90 backdrop-blur-md text-white rounded-full hover:bg-red-600 transition shadow-sm">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                 </div>
                 
                 <div className="p-5 flex-grow relative z-10 flex flex-col">
                    <div className="flex flex-col gap-1 mt-2">
                       <h3 className="font-bold text-slate-800">{voucher.label || 'Voucher'}</h3>
                       <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{voucher.description}</p>
                       <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-1">
                          <Calendar className="w-3 h-3" />
                          {voucher.expiryDate}
                       </div>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                       <span className="text-xl font-black text-sky-600">
                         {voucher.type === 'percent' ? `${voucher.value}%` : `${voucher.value.toLocaleString()}₫`}
                       </span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                         {voucher.category}
                       </span>
                    </div>
                 </div>
              </div>
            ))}
            {displayedVouchers.length === 0 && (
              <div className="col-span-full py-10 text-center text-slate-500">
                Không tìm thấy voucher nào.
              </div>
            )}
          </div>
          
          {hasMore && (
            <div className="flex justify-center pt-8">
               <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-900 hover:bg-slate-50 hover:border-sky-200 hover:text-sky-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 group"
               >
                 Xem thêm mã giảm giá
                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
               </button>
            </div>
          )}
        </>
      )}

      {/* Hộp thoại (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300 p-8 flex flex-col max-h-[90vh]">
            <h2 className="text-2xl font-black text-slate-900 mb-8">{editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề (Label)</label>
                    <input required type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold" placeholder="VD: Ưu đãi mùa hè" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mã Voucher</label>
                    <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold tracking-widest" placeholder="VD: SUMMER2024" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phân loại (Tag)</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold" placeholder="VD: Summer Sale" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Thời hạn hiển thị</label>
                    <input required type="text" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-bold" placeholder="VD: Hết hạn: 31/05" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả chi tiết</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-medium h-24 resize-none" placeholder="VD: Giảm ngay 20% khi đặt từ 3 đêm..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại hình</label>
                    <select 
                        value={formData.type} 
                        onChange={e => setFormData({...formData, type: e.target.value})}
                        className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 appearance-none bg-white font-bold">
                      <option value="percent">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (₫)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Giá trị</label>
                    <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 font-black text-sky-600" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Hình ảnh ưu đãi</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="flex-grow border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative group"
                        onClick={() => document.getElementById('voucher-image-upload')?.click()}
                      >
                        <ImageIcon className="w-8 h-8 text-slate-300 mb-1 group-hover:text-sky-400 transition" />
                        <p className="text-xs text-slate-500 font-bold">Tải ảnh lên</p>
                        <input 
                          id="voucher-image-upload"
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                      
                      {(previewUrl || formData.image) && (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-xl shrink-0">
                          <img src={previewUrl || formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({...formData, image: e.target.value});
                          setSelectedFile(null); // Xóa file khi URL được nhập trực tiếp
                          setPreviewUrl(null);
                        }}
                        className="w-full px-5 py-3 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 text-xs font-medium" 
                        placeholder="Hoặc dán URL ảnh tại đây..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition">Hủy</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold transition flex items-center justify-center gap-2 font-black shadow-lg shadow-sky-500/30"><Save className="w-5 h-5" />{editingVoucher ? 'Cập nhật' : 'Tạo ngay'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}