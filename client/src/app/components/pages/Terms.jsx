import { FileText } from "lucide-react";

export function Terms() {
  return (
    <div className="bg-[#FDFAF6] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="bg-sky-100 text-sky-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Điều khoản sử dụng</h1>
          <p className="text-slate-500">Cập nhật lần cuối: 01/01/2026</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-sky-100 space-y-8 prose prose-slate prose-sky max-w-none">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Chấp nhận điều khoản</h2>
            <p className="text-slate-600 leading-relaxed">
              Bằng việc truy cập và sử dụng website, ứng dụng của AquaStays, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Đặt phòng và Hủy phòng</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Mọi yêu cầu đặt phòng phải được xác nhận qua email hoặc mã xác nhận trên ứng dụng mới có hiệu lực.</li>
              <li>Chính sách hủy phòng và hoàn tiền phụ thuộc vào từng khách sạn và thời điểm bạn đặt phòng. Thông tin này được hiển thị rõ ràng tại bước thanh toán.</li>
              <li>AquaStays có quyền hủy đặt phòng nếu phát hiện dấu hiệu gian lận.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Trách nhiệm người dùng</h2>
            <p className="text-slate-600 leading-relaxed">
              Bạn chịu trách nhiệm về tính chính xác của các thông tin cung cấp khi đặt phòng. Mọi thiệt hại do cung cấp thông tin sai lệch sẽ do bạn tự chịu trách nhiệm. Không sử dụng nền tảng cho các mục đích phi pháp hoặc gây tổn hại đến hệ thống.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Quyền sở hữu trí tuệ</h2>
            <p className="text-slate-600 leading-relaxed">
              Tất cả nội dung, bao gồm logo, hình ảnh, bài viết, và mã nguồn trên nền tảng thuộc bản quyền của AquaStays. Việc sao chép, phân phối dưới bất kỳ hình thức nào khi chưa có sự đồng ý bằng văn bản là vi phạm pháp luật.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
