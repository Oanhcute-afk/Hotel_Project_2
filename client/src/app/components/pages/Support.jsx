import { Mail, PhoneCall, HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function Support() {
  const faqs = [
    {
      q: "Làm thế nào để hủy phòng đã đặt?",
      a: "Bạn có thể hủy phòng trong mục 'Tài khoản của tôi' -> 'Lịch sử đặt phòng'. Chính sách hoàn tiền phụ thuộc vào từng khách sạn cụ thể mà bạn đã đặt."
    },
    {
      q: "Tôi có thể thay đổi ngày đặt phòng không?",
      a: "Bạn có thể liên hệ trực tiếp với bộ phận chăm sóc khách hàng của chúng tôi để được hỗ trợ đổi ngày miễn phí nếu phòng trống."
    },
    {
      q: "Làm sao để tôi lấy hóa đơn đỏ (VAT)?",
      a: "Sau khi trả phòng, bạn có thể yêu cầu xuất hóa đơn tại quầy lễ tân khách sạn hoặc qua ứng dụng AquaStays trong vòng 7 ngày làm việc."
    }
  ];

  const [openFaq, setOpenFaq] = useState(0);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }
    
    // basic email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Vui lòng nhập định dạng email hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setToast({ show: true, message: 'Gửi yêu cầu thành công! Chúng tôi đã tự động gửi email xác nhận. Vui lòng kiểm tra email của bạn.', type: 'success' });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
      } else {
        setErrorMsg(data.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } catch (error) {
      setErrorMsg("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-[#FDFAF6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Trung tâm hỗ trợ</h1>
          <p className="text-slate-600 text-lg">Chúng tôi ở đây để giúp bạn có một kỳ nghỉ hoàn hảo nhất.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Methods */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Liên hệ trực tiếp</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-sky-50 text-sky-600 p-4 rounded-full mb-4">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Gọi cho chúng tôi</h3>
                <p className="text-slate-500 mb-4">Hỗ trợ 24/7 qua tổng đài</p>
                <a href="tel:19001234" className="text-sky-600 font-bold text-lg hover:underline">1900 1234</a>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm flex flex-col items-center text-center">
                <div className="bg-sky-50 text-sky-600 p-4 rounded-full mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Gửi Email</h3>
                <p className="text-slate-500 mb-4">Chúng tôi sẽ phản hồi trong 2h</p>
                <a href="mailto:support@aquastays.vn" className="text-sky-600 font-bold hover:underline">support@aquastays.vn</a>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-sm relative h-[400px]">
              <img src="https://images.unsplash.com/photo-1766066014237-00645c74e9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjBhZ2VudHxlbnwxfHx8fDE3NzUxNDMwMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Customer Support" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Đội ngũ tận tâm</h3>
                <p>Luôn sẵn sàng hỗ trợ bạn 24/7 để đảm bảo kỳ nghỉ của bạn không gặp bất kỳ trở ngại nào.</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-sky-500" />
              <h2 className="text-2xl font-bold text-slate-800">Câu hỏi thường gặp</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-sky-50 rounded-xl overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 bg-sky-50/50 hover:bg-sky-50 font-semibold text-slate-800 text-left"
                  >
                    {faq.q}
                    <ChevronDown className={`w-5 h-5 text-sky-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="p-5 text-slate-600 bg-white border-t border-sky-50 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-slate-100 pt-8 relative">
              <h3 className="font-bold text-slate-800 mb-4 text-lg">Gửi yêu cầu hỗ trợ</h3>
              
              {toast.show && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-start gap-3 animate-in zoom-in-95 duration-300 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="font-medium text-sm leading-relaxed">{toast.message}</p>
                </div>
              )}

              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Họ và tên" 
                    className="w-full px-4 py-3 bg-[#FDFAF6] border border-sky-100 rounded-xl focus:ring-2 focus:ring-sky-500/50 outline-none transition text-sm" 
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="Email liên hệ" 
                    className="w-full px-4 py-3 bg-[#FDFAF6] border border-sky-100 rounded-xl focus:ring-2 focus:ring-sky-500/50 outline-none transition text-sm" 
                  />
                </div>
                <div>
                  <textarea 
                    rows={4} 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Nội dung cần hỗ trợ..." 
                    className="w-full px-4 py-3 bg-[#FDFAF6] border border-sky-100 rounded-xl focus:ring-2 focus:ring-sky-500/50 outline-none transition text-sm resize-none"></textarea>
                </div>
                
                {errorMsg && <p className="text-red-500 text-sm font-medium px-1">{errorMsg}</p>}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/30 transition active:scale-95 text-lg"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}