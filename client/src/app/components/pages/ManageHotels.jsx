import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Building2, Plus, Edit2, Trash2, Search, MapPin,
  Star, Image as ImageIcon, X, Save, AlertCircle,
  Wifi, Waves, Coffee, Car, Dumbbell, Utensils,
  Map as MapIcon, ClipboardList, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AMENITIES, PROPERTY_TYPES } from '../data';

/**
 * COMPONENT: Manage Hotels
 * Logic: Cho phép Manager/Admin quản lý danh sách khách sạn, thêm mới, sửa và xóa.
 * Hỗ trợ upload nhiều ảnh và quản lý chi tiết từng loại phòng.
 */
export default function ManageHotels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6); // Số lượng khách sạn hiển thị ban đầu
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null); // Lưu thông tin khách sạn đang sửa
  
  // Dữ liệu form cho khách sạn
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: 0,
    rating: 5,
    reviews: 0,
    stars: 5,
    image: '',
    amenities: [],
    propertyType: 'Khách sạn',
    description: '',
    rooms: []
  });

  const [activeTab, setActiveTab] = useState('basic'); // Quản lý Tab trong Modal: 'basic', 'images', 'rooms'

  // Quản lý ảnh (File upload và URL link)
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null, null]);
  const [imageLinks, setImageLinks] = useState(['', '', '']);
  
  // Tiện ích và loại chỗ nghỉ tự định nghĩa (Khác...)
  const [otherAmenity, setOtherAmenity] = useState('');
  const [otherPropertyType, setOtherPropertyType] = useState('');
  const [isOtherPropertyActive, setIsOtherPropertyActive] = useState(false);
  const [isOtherAmenityActive, setIsOtherAmenityActive] = useState(false);

  /**
   * ACTION: Xử lý khi người dùng chọn file ảnh từ máy tính
   */
  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);

      // Tạo URL tạm thời để xem trước ảnh
      const newPreviews = [...previewUrls];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviewUrls(newPreviews);
    }
  };

  /**
   * ACTION: Lấy danh sách khách sạn từ API
   */
  const fetchHotels = async () => {
    try {
      const res = await fetch('/api/manager/hotels', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (data.success) setHotels(data.hotels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'manager' || user.role === 'admin') {
        fetchHotels();
      } else {
        navigate('/'); // Nếu không có quyền thì đá về trang chủ
      }
    }
  }, [user, navigate]);

  /**
   * ACTION: Lưu thông tin khách sạn (Thêm mới hoặc Cập nhật)
   * Sử dụng FormData để gửi kèm cả dữ liệu text và file ảnh
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra số lượng ảnh tối thiểu (3 ảnh)
    const totalImages =
      selectedFiles.filter(f => f !== null).length +
      imageLinks.filter(l => l.trim() !== '').length;

    if (!editingHotel && totalImages < 3) {
      alert("Vui lòng tải lên hoặc cung cấp URL cho ít nhất 3 ảnh.");
      return;
    }

    const url = editingHotel
      ? `/api/manager/hotels/${editingHotel.idStr}`
      : '/api/manager/hotels';

    const method = editingHotel ? 'PUT' : 'POST';

    try {
      // Xử lý các tiện ích tùy chọn
      const finalAmenities = [...(formData.amenities || [])];
      if (isOtherAmenityActive && otherAmenity) {
        finalAmenities.push(otherAmenity);
      }

      const finalPropertyType = isOtherPropertyActive
        ? otherPropertyType
        : formData.propertyType;

      const data = new FormData();

      // Đóng gói dữ liệu vào FormData
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          data.append(key, JSON.stringify(finalAmenities));
        } else if (key === 'rooms') {
          data.append(key, JSON.stringify(formData.rooms));
        } else if (key === 'propertyType') {
          data.append(key, finalPropertyType);
        } else if (key === 'image' || key === 'images') {
          // Bỏ qua để xử lý riêng
        } else {
          data.append(key, formData[key]);
        }
      });

      // Đính kèm các file ảnh đã chọn
      selectedFiles.forEach(file => {
        if (file) data.append('images', file);
      });

      // Đính kèm các link ảnh trực tiếp
      const links = imageLinks.filter(l => l.trim() !== '');
      if (links.length > 0) {
        data.append('imageLinks', JSON.stringify(links));
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
        setEditingHotel(null);
        setSelectedFiles([null, null, null]);
        setPreviewUrls([null, null, null]);
        setImageLinks(['', '', '']);
        setActiveTab('basic');
        fetchHotels(); // Tải lại danh sách sau khi lưu thành công
      }

    } catch (err) {
      console.error(err);
    }
  };

  /**
   * ACTION: Xóa khách sạn
   */
  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) return;

    try {
      const res = await fetch(
        `/api/manager/hotels/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${user?.token}` }
        }
      );

      const data = await res.json();
      if (data.success) fetchHotels();

    } catch (err) {
      console.error(err);
    }
  };

  /**
   * ACTION: Mở modal chỉnh sửa và điền dữ liệu cũ vào form
   */
  const openEditModal = (hotel) => {
    setEditingHotel(hotel);
    setFormData(hotel);
    setIsOtherAmenityActive(false);
    setIsOtherPropertyActive(false);
    setOtherAmenity('');
    setOtherPropertyType('');

    // Load lại ảnh cũ để hiển thị preview
    setPreviewUrls(
      hotel.images ||
      (hotel.image ? [hotel.image, null, null] : [null, null, null])
    );

    setImageLinks(
      hotel.images ||
      (hotel.image ? [hotel.image, '', ''] : ['', '', ''])
    );

    setSelectedFiles([null, null, null]);
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  /**
   * PHÒNG (ROOMS): Logic quản lý danh sách phòng con
   */
  const addRoom = () => {
    setFormData({
      ...formData,
      rooms: [
        ...formData.rooms,
        {
          idStr: 'room-' + Math.random().toString(36).substr(2, 9),
          name: '',
          price: 0,
          capacity: { adults: 2, children: 0 },
          size: 20,
          bedType: '1 giường đôi',
          count: 1
        }
      ]
    });
  };

  const removeRoom = (index) => {
    const newRooms = [...formData.rooms];
    newRooms.splice(index, 1);
    setFormData({ ...formData, rooms: newRooms });
  };

  const updateRoom = (index, field, value) => {
    const newRooms = JSON.parse(JSON.stringify(formData.rooms));
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (!newRooms[index][parent]) newRooms[index][parent] = {};
      newRooms[index][parent][child] = value;
    } else {
      newRooms[index][field] = value;
    }
    setFormData({ ...formData, rooms: newRooms });
  };

  // Logic tìm kiếm khách sạn theo tên hoặc địa điểm
  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedHotels = filteredHotels.slice(0, visibleCount);
  const hasMore = visibleCount < filteredHotels.length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Thanh Header và nút Thêm mới */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-sky-500" />
              Quản lý khách sạn
            </h1>
            <button
              onClick={() => {
                setEditingHotel(null);
                setFormData({ name: '', location: '', price: 0, rating: 5, reviews: 0, stars: 5, image: '', amenities: [], propertyType: 'Khách sạn', rooms: [] });
                setIsOtherAmenityActive(false);
                setIsOtherPropertyActive(false);
                setOtherAmenity('');
                setOtherPropertyType('');
                setActiveTab('basic');
                setSelectedFiles([null, null, null]);
                setPreviewUrls([null, null, null]);
                setImageLinks(['', '', '']);
                setIsModalOpen(true);
              }}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full font-medium transition shadow-lg shadow-sky-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm khách sạn mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ô tìm kiếm */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm khách sạn..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedHotels.map(hotel => (
              <div key={hotel.idStr} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition group flex flex-col h-full">
                {/* Ảnh xem trước và nút chức năng (Sửa/Xóa) khi hover */}
                <div className="aspect-[16/9] relative group bg-slate-100 flex items-center justify-center">
                  {hotel.image ? (
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs font-bold">Chưa có ảnh</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/50 z-10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.stars || 5} sao</span>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                    <button onClick={() => openEditModal(hotel)} className="bg-white/90 backdrop-blur-sm text-slate-800 p-2 rounded-full hover:bg-white transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(hotel.idStr)} className="bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{hotel.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <span className="text-sky-600 font-bold">{hotel.price?.toLocaleString()} VNĐ <span className="text-xs text-slate-400 font-normal">/ đêm</span></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">{hotel.propertyType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nút Load more (Xem thêm) */}
        {hasMore && (
          <div className="flex justify-center pt-10 pb-4">
            <button 
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-12 py-4 bg-white border border-slate-200 rounded-[20px] text-sm font-black text-slate-900 hover:bg-slate-50 hover:border-sky-200 hover:text-sky-600 transition-all duration-300 shadow-sm hover:shadow-lg flex items-center gap-2 group"
            >
              Xem thêm khách sạn
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        )}

        {filteredHotels.length === 0 && !loading && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <Building2 className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Không tìm thấy khách sạn nào</p>
          </div>
        )}
      </div>

      {/* MODAL THÊM/SỬA KHÁCH SẠN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingHotel ? 'Chỉnh sửa khách sạn' : 'Đăng khách sạn mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              {/* Tab Navigation */}
              <div className="flex gap-4 border-b border-slate-200 mb-6 px-1">
                <button type="button" onClick={() => setActiveTab('basic')} className={`py-2 px-4 border-b-2 font-bold transition-all ${activeTab === 'basic' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Thông tin cơ bản</button>
                <button type="button" onClick={() => setActiveTab('images')} className={`py-2 px-4 border-b-2 font-bold transition-all ${activeTab === 'images' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Hình ảnh</button>
                <button type="button" onClick={() => setActiveTab('rooms')} className={`py-2 px-4 border-b-2 font-bold transition-all ${activeTab === 'rooms' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Các loại phòng</button>
              </div>

              {/* TAB 1: THÔNG TIN CƠ BẢN */}
              {activeTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tên khách sạn</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm</label>
                    <input required type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Giá khởi điểm chung (VNĐ)</label>
                    <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Số sao khách sạn</label>
                    <select required value={formData.stars} onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 bg-white font-bold">
                      {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} sao</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả khách sạn</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 resize-none font-medium text-slate-600" />
                  </div>
                </div>
              )}

              {/* TAB 2: HÌNH ẢNH */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className="space-y-4">
                        <div className="aspect-[4/3] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden group" onClick={() => document.getElementById(`hotel-image-upload-${idx}`)?.click()}>
                          {previewUrls[idx] ? (
                            <img src={previewUrls[idx] || ''} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                          )}
                          <input id={`hotel-image-upload-${idx}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(idx, e)} />
                        </div>
                        <input type="text" value={imageLinks[idx]} onChange={(e) => {
                          const newLinks = [...imageLinks];
                          newLinks[idx] = e.target.value;
                          setImageLinks(newLinks);
                          const newPreviews = [...previewUrls];
                          newPreviews[idx] = e.target.value;
                          setPreviewUrls(newPreviews);
                        }} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[11px]" placeholder="Dán URL ảnh..." />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CÁC LOẠI PHÒNG */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800">Quản lý loại phòng</h3>
                    <button type="button" onClick={addRoom} className="bg-sky-100 text-sky-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1"><Plus className="w-4 h-4" /> Thêm phòng</button>
                  </div>

                  {formData.rooms?.map((room, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 relative group">
                      <button type="button" onClick={() => removeRoom(index)} className="absolute top-4 right-4 text-red-400 p-1 bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <input type="text" placeholder="Tên loại phòng" value={room.name} onChange={(e) => updateRoom(index, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                        <input type="number" placeholder="Giá phòng" value={room.price} onChange={(e) => updateRoom(index, 'price', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 flex justify-end gap-3 mt-8 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition text-sm">Hủy</button>
                <button type="submit" className="px-8 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold transition flex items-center gap-2 text-sm shadow-lg shadow-sky-500/20">
                  <Save className="w-4 h-4" />
                  {editingHotel ? 'Cập nhật thay đổi' : 'Đăng khách sạn ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}