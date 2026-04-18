import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  QrCode,
  Banknote,
  Printer,
  Tag,
  TicketPercent
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, requireAuth } = useAuth();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cccd: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("qr");

  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVouchers, setShowVouchers] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [searchParams] = useSearchParams();

  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || ""
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || ""
  );

  const adults = parseInt(searchParams.get("adults") || "2");
  const children = parseInt(searchParams.get("children") || "0");
  
  const rawSelections = searchParams.get("selections");
  const selections = rawSelections ? JSON.parse(rawSelections) : [];
  const nightsQuery = searchParams.get("nights");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/vouchers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAvailableVouchers(data);
      })
      .catch(console.error);

    if (id && id !== "undefined") {
      fetch(`/api/hotels/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.message) {
            setHotel(data);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    requireAuth(() => {
      if (user) {
         setFormData(prev => ({
           ...prev,
           name: prev.name || user.displayName || user.firstName || "",
           email: prev.email || user.email || ""
         }));
      }
    });
  }, [requireAuth, user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (hotel && availableVouchers.length > 0 && !selectedVoucher) {
      const roomTotal = hotel.price * 2;

      let best = null;
      let maxD = 0;

      availableVouchers.forEach(v => {
        let d = 0;

        if (v.type === "percent") {
          d = roomTotal * v.value;
          if (v.maxDiscount && d > v.maxDiscount)
            d = v.maxDiscount;
        } else {
          d = v.value;
        }

        if (d > maxD) {
          maxD = d;
          best = v;
        }
      });

      setSelectedVoucher(best);
    }
  }, [hotel, availableVouchers]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;

    const cin = new Date(checkIn);
    const cout = new Date(checkOut);

    const diffTime = Math.abs(
      cout.getTime() - cin.getTime()
    );

    return Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );
  };

  const nights = nightsQuery ? parseInt(nightsQuery) : calculateNights() || 1;

  let calculatedSubtotal = 0;
  if (selections.length > 0 && hotel?.rooms) {
    selections.forEach(sel => {
       const room = hotel.rooms.find(r => (r.idStr || r._id) === sel.roomId);
       if (room) {
          calculatedSubtotal += (room.price * sel.qty * nights);
       }
    });
  } else {
    // Fallback
    const adultPrice = hotel ? hotel.price : 0;
    const childPrice = hotel ? hotel.price * 0.7 : 0;
    calculatedSubtotal = hotel ? (adults * adultPrice + children * childPrice) * nights : 0;
  }

  const subTotal = calculatedSubtotal;

  let discountApplied = 0;

  if (selectedVoucher) {
    if (selectedVoucher.type === "percent") {
      discountApplied =
        subTotal * selectedVoucher.value;

      if (
        selectedVoucher.maxDiscount &&
        discountApplied >
          selectedVoucher.maxDiscount
      )
        discountApplied =
          selectedVoucher.maxDiscount;
    } else {
      discountApplied = selectedVoucher.value;
    }
    
    // Bounds discount to maximum of subTotal
    discountApplied = Math.min(discountApplied, subTotal);
  }

  const taxAmount =
    (subTotal - discountApplied) * 0.1;

  const finalTotal =
    subTotal - discountApplied + taxAmount;



  const handleConfirm = async e => {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const cin = new Date(checkIn);
      const cout = new Date(checkOut);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (!checkIn || !checkOut) {
        setErrorMessage(
          "Vui lòng chọn ngày nhận và trả phòng."
        );
        setIsSubmitting(false);
        return;
      }

      if (cin < now) {
        setErrorMessage(
          "Ngày nhận phòng không được ở quá khứ."
        );
        setIsSubmitting(false);
        return;
      }

      if (cout <= cin) {
        setErrorMessage(
          "Ngày trả phòng phải sau ngày nhận phòng."
        );
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          hotelId: id,
          firstName: formData.name,
          lastName: formData.name,
          email: formData.email,
          phone: formData.phone,
          checkIn: cin,
          checkOut: cout,
          guests: adults + children,
          subTotal,
          discountAmount: discountApplied,
          taxAmount,
          totalPrice: finalTotal,
          voucherCode: selectedVoucher?.code,
          userId: user?.id,
          paymentMethod,
          cccd: formData.cccd
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInvoiceNumber(
          data.invoiceNumber ||
            `INV-${Math.floor(
              Math.random() *
                1000000
            )}`
        );

        setIsSuccess(true);
      } else {
        setErrorMessage(
          data.message ||
            "Thanh toán thất bại"
        );
      }
    } catch (err) {
      setErrorMessage("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => {
    const invoiceElement = document.getElementById("invoice-container");
    if (!invoiceElement) return;
    
    const originalScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const printButtons = document.getElementById("print-buttons");
    if (printButtons) printButtons.style.display = 'none';

    try {
      await new Promise(resolve => setTimeout(resolve, 150));

      const canvas = await html2canvas(invoiceElement, {
         scale: 2,
         useCORS: true,
         backgroundColor: '#ffffff',
         scrollY: 0,
         windowHeight: invoiceElement.scrollHeight
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HoaDon-${invoiceNumber || 'AquaStays'}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      if (printButtons) printButtons.style.display = 'flex';
      window.scrollTo(0, originalScrollY);
    }
  };

  useEffect(() => {
    if (isSuccess && invoiceNumber) {
      setTimeout(() => {
        generatePDF();
      }, 800);
    }
  }, [isSuccess, invoiceNumber]);
  if (isLoading)
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        Đang tải...
      </div>
    );

  if (!hotel) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-xl text-slate-500">
          Dữ liệu đặt phòng không hợp lệ.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-[#FDFAF6] min-h-screen flex flex-col items-center justify-center p-4 py-12">
        <div id="invoice-container" className="bg-white p-8 md:p-12 text-black max-w-2xl w-full border border-slate-200" style={{boxShadow: '0 0 15px rgba(0,0,0,0.1)'}}>
          <div className="flex justify-between items-start mb-10 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-800">Hóa Đơn</h1>
              <p className="text-slate-500 text-sm mt-1">Mã tham chiếu: {invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-black text-sky-600">AquaStays</h2>
              <p className="text-slate-500 text-sm">
                123 Đường Ven Biển <br/>
                TP. Nha Trang, Việt Nam <br/>
                contact@aquastays.vn
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-slate-200 text-sm">
            <div>
              <h3 className="font-bold text-slate-700 mb-2 uppercase">Thông tin khách hàng:</h3>
              <p>{formData.name}</p>
              <p>{formData.email}</p>
              <p>{formData.phone}</p>
              <p>CCCD/CMND: {formData.cccd}</p>
            </div>

            <div className="text-right">
              <h3 className="font-bold text-slate-700 mb-2 uppercase">Chi tiết đặt phòng:</h3>
              <p>Khách sạn: {hotel.name}</p>
              <p>Ngày đặt: {new Date().toLocaleDateString('vi-VN')}</p>
              <p>
                Phương thức TT: 
                {paymentMethod === 'transfer'
                  ? ' Chuyển khoản'
                  : paymentMethod === 'qr'
                  ? ' Mã QR'
                  : ' Tiền mặt'}
              </p>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left font-bold py-3 text-slate-700 uppercase">
                  Mô tả
                </th>
                <th className="text-right font-bold py-3 text-slate-700 uppercase">
                  Thành tiền
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4">
                  <div className="font-medium text-slate-800">
                    Tiền phòng ({nights || 1} đêm)
                  </div>

                  <div className="text-xs text-slate-500 mt-1">
                    {selections.length > 0 && hotel?.rooms ? (
                      selections.map(sel => {
                        const room = hotel.rooms.find(r => (r.idStr || r._id) === sel.roomId);
                        if (!room) return null;
                        return <div key={sel.roomId}>- {room.name} (x{sel.qty})</div>;
                      })
                    ) : (
                      <>{adults} Người lớn {children > 0 ? ` + ${children} Trẻ em` : ''}</>
                    )}
                  </div>
                </td>

                <td className="py-4 text-right font-bold text-slate-800">
                  {subTotal.toLocaleString('vi-VN')} ₫
                </td>
              </tr>

              {selectedVoucher && (
                <tr className="border-b border-slate-100 text-green-600">
                  <td className="py-4 flex items-center gap-2">
                    <Tag className="w-4 h-4"/>
                    Voucher: {selectedVoucher.code}
                  </td>

                  <td className="py-4 text-right">
                    - {discountApplied.toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              )}

              <tr className="border-b border-slate-100">
                <td className="py-4">
                  Thuế và phí (10%)
                </td>

                <td className="py-4 text-right">
                  {taxAmount.toLocaleString('vi-VN')} ₫
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td className="py-4 font-bold text-slate-800 text-lg uppercase text-right pr-4">
                  Tổng cộng:
                </td>

                <td className="py-4 font-bold text-slate-800 text-xl text-right">
                  {finalTotal.toLocaleString('vi-VN')} ₫
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="text-center text-sm text-slate-500 mb-8">
            <p>Đây là hóa đơn điện tử hợp lệ.</p>
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của AquaStays!</p>
          </div>

          <div id="print-buttons" className="flex gap-4 justify-center print:hidden">
            <button
              onClick={() => generatePDF()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-bold transition"
            >
              <Printer className="w-5 h-5"/>
              Tải hóa đơn PDF
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-bold transition"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FDFAF6] min-h-screen py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900"
      >
        <ChevronLeft /> Quay lại
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* FORM */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Thông tin đặt phòng</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Họ tên"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="cccd"
              placeholder="Số CCCD / CMND"
              value={formData.cccd}
              onChange={handleInputChange}
              className="border p-3 rounded-lg"
            />
          </div>

          {/* Voucher */}
          <div className="mt-6">
            <label className="font-semibold flex items-center gap-2 mb-2">
              <TicketPercent /> Voucher
            </label>

            <select
              value={selectedVoucher?.code || ""}
              onChange={(e) => {
                const voucher = availableVouchers.find(v => v.code === e.target.value)
                setSelectedVoucher(voucher || null)
              }}
              className="border p-3 rounded-lg w-full"
            >
              <option value="">Không sử dụng</option>
              {availableVouchers.map(v => (
                <option key={v.code} value={v.code}>
                  {v.code} - Giảm {v.type === "percent" ? `${v.value * 100}%` : `${v.value.toLocaleString()}₫`}
                </option>
              ))}
            </select>
          </div>

          {/* Payment */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Phương thức thanh toán</h3>

            <div className="space-y-3">
              <label className="flex gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "qr"}
                  onChange={() => setPaymentMethod("qr")}
                />
                <QrCode /> Mã QR Tự Động
              </label>

              <label className="flex gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "transfer"}
                  onChange={() => setPaymentMethod("transfer")}
                />
                <CreditCard /> Chuyển Khoản Ngân Hàng
              </label>

              <label className="flex gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <Banknote /> Thanh toán tại khách sạn
              </label>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="mt-8 w-full bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-xl font-bold"
          >
            Xác nhận đặt phòng
          </button>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Tóm tắt</h2>

          <div className="space-y-2 text-sm">
            <p>Khách sạn: {hotel.name}</p>
            <p>Người lớn: {adults}</p>
            <p>Trẻ em: {children}</p>
            <p>Số đêm: {nights}</p>

            {selections.length > 0 && hotel?.rooms && (
              <div className="pt-3 pb-1 border-t border-slate-100 mt-3 mb-1">
                <p className="font-bold text-slate-700 mb-2">Các phòng đã đặt:</p>
                {selections.map((sel, idx) => {
                  const room = hotel.rooms.find(r => (r.idStr || r._id) === sel.roomId);
                  if (!room) return null;
                  return (
                    <div key={idx} className="flex justify-between items-start text-slate-800 mb-1">
                      <span className="pr-2 leading-tight">- {room.name}</span>
                      <span className="font-bold text-sky-600 whitespace-nowrap">x{sel.qty}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <hr className="mt-3" />

            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{subTotal.toLocaleString()}₫</span>
            </div>

            {selectedVoucher && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá</span>
                <span>-{discountApplied.toLocaleString()}₫</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Thuế</span>
              <span>{taxAmount.toLocaleString()}₫</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Tổng</span>
              <span>{finalTotal.toLocaleString()}₫</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}