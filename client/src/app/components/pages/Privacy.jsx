import { ShieldCheck } from "lucide-react";

export function Privacy() {
  return (
    <div className="bg-[#FDFAF6] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="bg-sky-100 text-sky-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
            Chính sách bảo mật
          </h1>

          <p className="text-slate-500">
            Cập nhật lần cuối: 01/01/2026
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-sky-100 space-y-8 prose prose-slate prose-sky max-w-none">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. Thu thập thông tin cá nhân
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, đặt phòng, hoặc liên hệ với bộ phận hỗ trợ. Các thông tin này bao gồm tên, email, số điện thoại, và thông tin thanh toán. Chúng tôi cam kết chỉ thu thập những thông tin cần thiết phục vụ cho việc cung cấp dịch vụ tốt nhất.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. Sử dụng thông tin
            </h2>

            <p className="text-slate-600 leading-relaxed mb-4">
              Thông tin của bạn được sử dụng để:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Xử lý các đặt phòng và thanh toán của bạn.</li>
              <li>Gửi xác nhận, thông báo và hỗ trợ khách hàng.</li>
              <li>Cá nhân hóa trải nghiệm và gửi các ưu đãi phù hợp (nếu bạn đồng ý).</li>
              <li>Cải thiện chất lượng dịch vụ và bảo mật hệ thống.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              3. Chia sẻ thông tin
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Chúng tôi chỉ chia sẻ thông tin cần thiết (như tên và số điện thoại) cho các đối tác khách sạn/resort để đảm bảo việc nhận phòng của bạn diễn ra suôn sẻ. Chúng tôi KHÔNG bán hoặc cho thuê dữ liệu cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Bảo mật dữ liệu
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Toàn bộ dữ liệu thanh toán được mã hóa qua chuẩn SSL/TLS. Chúng tôi không lưu trữ trực tiếp số thẻ tín dụng của bạn trên máy chủ mà thông qua đối tác cổng thanh toán đạt chuẩn PCI-DSS.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}