import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Building2, Plus, Edit2, Trash2, Search, MapPin, 
  Star, Image as ImageIcon, X, Save, AlertCircle, 
  Wifi, Waves, Coffee, Car, Dumbbell, Utensils,
  Map as MapIcon, ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AMENITIES, PROPERTY_TYPES } from '../data';

export default function ManageHotels() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: 0,
    rating: 5,
    reviews: 0,
    stars: 5,
    image: '',
    amenities: [],
    amenities: [],
    propertyType: 'Khách sạn',
    description: '',
    rooms: []
  });

  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'images', 'rooms'

  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null, null]);
  const [imageLinks, setImageLinks] = useState(['', '', '']);
  const [otherAmenity, setOtherAmenity] = useState('');
  const [otherPropertyType, setOtherPropertyType] = useState('');
  const [isOtherPropertyActive, setIsOtherPropertyActive] = useState(false);
  const [isOtherAmenityActive, setIsOtherAmenityActive] = useState(false);

  const handleFileChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);

      const newPreviews = [...previewUrls];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviewUrls(newPreviews);
    }
  };

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
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      const finalAmenities = [...(formData.amenities || [])];
      if (isOtherAmenityActive && otherAmenity) {
        finalAmenities.push(otherAmenity);
      }
      
      const finalPropertyType = isOtherPropertyActive
        ? otherPropertyType
        : formData.propertyType;

      const data = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          data.append(key, JSON.stringify(finalAmenities));
        } else if (key === 'rooms') {
          data.append(key, JSON.stringify(formData.rooms));
        } else if (key === 'propertyType') {
          data.append(key, finalPropertyType);
        } else if (key === 'image' || key === 'images') {
        } else {
          data.append(key, formData[key]);
        }
      });

      selectedFiles.forEach(file => {
        if (file) data.append('images', file);
      });

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
        fetchHotels();
      }

    } catch (err) {
      console.error(err);
    }
  };

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

  const openEditModal = (hotel) => {
    setEditingHotel(hotel);
    setFormData(hotel);
    setIsOtherAmenityActive(false);
    setIsOtherPropertyActive(false);
    setOtherAmenity('');
    setOtherPropertyType('');

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
          facilities: [],
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
    const newRooms = [...formData.rooms];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newRooms[index][parent] = { ...newRooms[index][parent], [child]: value };
    } else {
      newRooms[index][field] = value;
    }
    setFormData({ ...formData, rooms: newRooms });
  };

  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const displayedHotels = filteredHotels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
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
        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm kiếm khách sạn..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
              <div key={hotel.idStr} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition group">
                <div className="aspect-[16/9] relative group">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                    <button onClick={() => openEditModal(hotel)} className="bg-white/90 backdrop-blur-sm text-slate-800 p-2 rounded-full hover:bg-white transition">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(hotel.idStr)} className="bg-red-500/90 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{hotel.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700">{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{hotel.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-sky-600 font-bold">{hotel.price.toLocaleString()} VNĐ <span className="text-xs text-slate-400 font-normal">/ đêm</span></span>
                    <span className="text-xs text-slate-400">{hotel.stars} sao • {hotel.propertyType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredHotels.length === 0 && !loading && (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">Chưa có khách sạn nào được đăng.</p>
          </div>
        )}

        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-2 mt-8">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingHotel ? 'Chỉnh sửa khách sạn' : 'Đăng khách sạn mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="flex gap-4 border-b border-slate-200 mb-6 px-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`py-2 px-4 border-b-2 font-bold transition-all ${activeTab === 'basic' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Thông tin cơ bản
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className={`py-2 px-4 border-b-2 font-bold transition-all ${activeTab === 'images' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Hình ảnh
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rooms')}
                  className={`py-2 px-4 border-b-2 font-bold transition-all ${activeTab === 'rooms' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Các loại phòng
                </button>
              </div>

              {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tên khách sạn</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Địa điểm</label>
                  <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Giá khởi điểm chung (VNĐ)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Loại chỗ nghỉ</label>
                  <select 
                    value={isOtherPropertyActive ? 'Khác' : formData.propertyType}
                    onChange={(e) => {
                      if (e.target.value === 'Khác') {
                        setIsOtherPropertyActive(true);
                      } else {
                        setIsOtherPropertyActive(false);
                        setFormData({...formData, propertyType: e.target.value});
                      }
                    }}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 bg-white font-bold"
                  >
                    {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    <option value="Khác">Khác...</option>
                  </select>
                  {isOtherPropertyActive && (
                    <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-black text-sky-500 mb-1 uppercase">Tên loại chỗ nghỉ mới</label>
                      <input 
                        type="text" 
                        placeholder="VD: Glamping, Tàu du lịch..."
                        value={otherPropertyType}
                        onChange={(e) => setOtherPropertyType(e.target.value)}
                        className="w-full px-4 py-2 border border-sky-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 text-sm font-bold bg-sky-50/30"
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-sky-500" />
                    Mô tả khách sạn
                  </label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    placeholder="Nhập mô tả chi tiết về khách sạn, không gian, dịch vụ..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 resize-none font-medium text-slate-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-sky-500" />
                    Tiện ích chung (Chọn theo bộ lọc sẵn)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-100">
                        <input 
                          type="checkbox" 
                          checked={formData.amenities?.includes(amenity)}
                          onChange={(e) => {
                            const newAmenities = e.target.checked 
                              ? [...(formData.amenities || []), amenity]
                              : (formData.amenities || []).filter(a => a !== amenity);
                            setFormData({...formData, amenities: newAmenities});
                          }}
                          className="w-4 h-4 text-sky-500 rounded border-slate-300 focus:ring-sky-400"
                        />
                        <span className="text-xs font-bold text-slate-600 truncate">{amenity}</span>
                      </label>
                    ))}
                    
                    {/* Other Amenity */}
                    <label className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-all cursor-pointer border border-transparent hover:border-slate-100 bg-sky-50/50">
                        <input 
                          type="checkbox" 
                          checked={isOtherAmenityActive}
                          onChange={(e) => setIsOtherAmenityActive(e.target.checked)}
                          className="w-4 h-4 text-sky-500 rounded border-slate-400 focus:ring-sky-400"
                        />
                        <span className="text-xs font-bold text-sky-600 truncate">Khác...</span>
                    </label>
                  </div>
                  {isOtherAmenityActive && (
                    <div className="mt-3 p-3 bg-white border border-sky-100 rounded-xl animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-xs font-black text-sky-500 mb-1 uppercase">Tên tiện ích mới</label>
                      <input 
                        type="text" 
                        placeholder="VD: Rạp phim ngoài trời, Yoga..."
                        value={otherAmenity}
                        onChange={(e) => setOtherAmenity(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500/50 text-sm font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>
              )}

              {activeTab === 'images' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 mt-4 flex items-center gap-2">
                     <ImageIcon className="w-5 h-5 text-sky-500" /> Ảnh khách sạn (Đủ 3 ảnh để hiển thị tốt nhất)
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    {[0, 1, 2].map(idx => (
                      <div key={idx} className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase">Ảnh {idx + 1}</label>
                        <div 
                          className="aspect-[4/3] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative overflow-hidden group"
                          onClick={() => document.getElementById(`hotel-image-upload-${idx}`)?.click()}
                        >
                          {previewUrls[idx] ? (
                            <img src={previewUrls[idx] || ''} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-slate-300 mb-1 group-hover:text-sky-400 transition" />
                              <p className="text-[10px] text-slate-500 font-medium px-2 text-center">Tải lên</p>
                            </>
                          )}
                          <input 
                            id={`hotel-image-upload-${idx}`}
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(idx, e)}
                          />
                        </div>
                        
                        <div>
                          <input 
                            type="text" 
                            value={imageLinks[idx]}
                            onChange={(e) => {
                              const newLinks = [...imageLinks];
                              newLinks[idx] = e.target.value;
                              setImageLinks(newLinks);
                              
                              const newPreviews = [...previewUrls];
                              newPreviews[idx] = e.target.value;
                              setPreviewUrls(newPreviews);
                            }}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500/20 text-[11px]"
                            placeholder="Hoặc dán URL ảnh..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <h3 className="font-bold text-slate-800">Quản lý loại phòng</h3>
                      <p className="text-xs text-slate-500">Thêm các loại phòng khả dụng cho khách sạn này để khách hàng có thể chọn đặt.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={addRoom} 
                      className="bg-sky-100 text-sky-600 hover:bg-sky-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition"
                    >
                      <Plus className="w-4 h-4" /> Thêm phòng
                    </button>
                  </div>

                  {formData.rooms?.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                      Chưa có loại phòng nào. Vùi lòng thêm thông tin phòng.
                    </div>
                  )}

                  {formData.rooms?.map((room, index) => (
                    <div key={index} className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative group animate-in slide-in-from-bottom-2">
                       <button type="button" onClick={() => removeRoom(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded-md transition opacity-0 group-hover:opacity-100">
                         <Trash2 className="w-4 h-4" />
                       </button>

                       <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Phòng {index + 1}</h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1">Tên loại phòng (VD: Superior Double)</label>
                           <input type="text" required value={room.name} onChange={(e) => updateRoom(index, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1">Giá mỗi 24 đêm (VNĐ) (Tạm tính)</label>
                           <input type="number" required value={room.price} onChange={(e) => updateRoom(index, 'price', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                           <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Sức chứa (Người lớn)</label>
                             <input type="number" required value={room.capacity.adults} onChange={(e) => updateRoom(index, 'capacity.adults', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Trẻ em</label>
                             <input type="number" required value={room.capacity.children} onChange={(e) => updateRoom(index, 'capacity.children', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1">Loại giường (VD: 1 giường Queen)</label>
                           <input type="text" required value={room.bedType} onChange={(e) => updateRoom(index, 'bedType', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                           <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Tiện nghi (Ngăn cách bởi dấu phẩy)</label>
                             <input type="text" value={room.facilities.join(', ')} onChange={(e) => updateRoom(index, 'facilities', e.target.value.split(',').map(s => s.trim()))} placeholder="VD: Bếp, TV, Tủ lạnh..." className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Diện tích (m²)</label>
                             <input type="number" value={room.size} onChange={(e) => updateRoom(index, 'size', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-700 mb-1">Số lượng phòng loại này hiện có</label>
                           <input type="number" required min="1" value={room.count} onChange={(e) => updateRoom(index, 'count', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-sky-500 text-sm" />
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 mt-8 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-full font-bold text-slate-600 hover:bg-slate-100 transition text-sm"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold transition flex items-center gap-2 text-sm shadow-lg shadow-sky-500/20"
                >
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