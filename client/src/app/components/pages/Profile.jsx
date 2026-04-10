import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { User, Settings, History, MessageSquare, Camera, Download, Star } from "lucide-react";
import { Navigate } from "react-router";

export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Edit State
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarStr, setAvatarStr] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (user && activeTab === "bookings") {
      setLoadingBookings(true);
      fetch(`/api/bookings/user/${user.id}`, {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setBookings(data.bookings);
          setLoadingBookings(false);
        })
        .catch(() => setLoadingBookings(false));
    }
  }, [user, activeTab]);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ phone, email, avatar: avatarStr })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage("Cập nhật thông tin thành công!");
        updateUser({ phone, email, avatar: avatarStr });
      } else {
        setSaveMessage(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      setSaveMessage("Lỗi kết nối server");
    }
    setIsSaving(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveMessage("Lỗi: Kích thước file không được vượt quá 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarStr(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintInvoice = (bookingId) => {
    const printWindow = window.open('', '_blank');
    const booking = bookings.find(b => b._id === bookingId);
    if (!printWindow || !booking) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Hoa don thanh toan - ${booking.invoiceNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #0284c7; }
            .info { margin-bottom: 30px; line-height: 1.6; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background-color: #f8fafc; }
            .total { text-align: right; font-size: 1.2rem; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN XÁC NHẬN ĐẶT PHÒNG</h1>
            <p>Mã hóa đơn: <strong>${booking.invoiceNumber}</strong></p>
            <p>Ngày tạo: ${new Date(booking.createdAt).toLocaleDateString("vi-VN")}</p>
          </div>
          <div class="info">
            <strong>Thông tin khách hàng:</strong><br/>
             Khách hàng: ${booking.lastName} ${booking.firstName}<br/>
             Email: ${booking.email} - SĐT: ${booking.phone}
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Nhận phòng</th>
                <th>Trả phòng</th>
                <th>Khách</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Khách sạn lưu trú (ID: ${booking.hotelId})</td>
                <td>${new Date(booking.checkIn).toLocaleDateString("vi-VN")}</td>
                <td>${new Date(booking.checkOut).toLocaleDateString("vi-VN")}</td>
                <td>${booking.guests} người</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Tổng thanh toán: ${booking.totalPrice.toLocaleString("vi-VN")} VND
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-sky-50 flex items-center justify-center border-4 border-white shadow-md relative group">
              {avatarStr || user.avatar ? (
                <img src={avatarStr || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-sky-400" />
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <h2 className="text-xl font-bold text-slate-800 text-center">{user.username}</h2>
            <p className="text-sm text-slate-500 mb-6">{user.email}</p>

            <nav className="w-full flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === "profile" ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Settings className="w-5 h-5" /> Hồ sơ cá nhân
              </button>
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === "bookings" ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <History className="w-5 h-5" /> Lịch sử đặt phòng
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${activeTab === "reviews" ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <MessageSquare className="w-5 h-5" /> Bài đánh giá
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Cập nhật hồ sơ</h3>
              <form onSubmit={handleSaveProfile} className="max-w-xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ảnh đại diện</label>
                  <div 
                    onClick={() => {
                      const input = document.getElementById('avatar-upload');
                        if (input) input.click();
                    }}
                    className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm border border-slate-100 flex-shrink-0">
                      {avatarStr || user.avatar ? (
                        <img src={avatarStr || user.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><User /></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Tải ảnh mới...</p>
                      <p className="text-xs text-slate-500">Hỗ trợ JPG, PNG, WEBP (Max 2MB)</p>
                    </div>
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email đăng nhập mới</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/50 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/50 outline-none transition"
                  />
                </div>

                {saveMessage && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${saveMessage.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {saveMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-sky-500/30 transition active:scale-95"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Lịch sử đặt phòng</h3>
              {loadingBookings ? (
                <div className="text-center py-10 text-slate-500">Đang tải lịch sử...</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-slate-400 mb-4 flex justify-center">
                    <History className="w-16 h-16" />
                  </div>
                  <p className="text-lg font-medium text-slate-600 mb-2">Chưa có lịch sử đặt phòng nào.</p>
                  <p className="text-slate-500">Có vẻ bạn chưa thực hiện đặt phòng nào trên hệ thống của chúng tôi.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map(booking => (
                    <div key={booking._id} className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition">
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg text-slate-800">Mã: {booking.invoiceNumber}</h4>
                              <p className="text-sm text-slate-500">Khách sạn ID: {booking.hotelId}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full tracking-wider">
                              {booking.status === 'paid' ? 'Đã thanh toán' : booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-slate-500 block mb-1">Nhận phòng</span>
                              <span className="font-medium text-slate-800">{new Date(booking.checkIn).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">Trả phòng</span>
                              <span className="font-medium text-slate-800">{new Date(booking.checkOut).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                          
                          <div className="font-bold text-sky-600 text-lg">
                            Tổng tiền: {booking.totalPrice.toLocaleString("vi-VN")} ₫
                          </div>
                       </div>
                       
                       <div className="md:w-auto w-full pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 flex flex-col gap-3">
                          <button 
                            onClick={() => handlePrintInvoice(booking._id)}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                          >
                            <Download className="w-4 h-4" /> Tải hóa đơn PDF
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Đánh giá của tôi</h3>
              <div className="text-center py-10">
                <div className="text-slate-400 mb-4 flex justify-center">
                  <Star className="w-16 h-16" />
                </div>
                <p className="text-lg font-medium text-slate-600 mb-2">Đang xây dựng tính năng này.</p>
                <p className="text-slate-500">Phần lịch sử đánh giá sẽ sớm ra mắt.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}