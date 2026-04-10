import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-[#FDFAF6] min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg border border-sky-100">
        <div className="bg-sky-50 text-sky-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-extrabold text-slate-800 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Trang không tồn tại
        </h2>

        <p className="text-slate-500 mb-8">
          Rất tiếc, trang{" "}
          <span className="font-semibold text-slate-700">
            {location.pathname}
          </span>{" "}
          mà bạn đang tìm kiếm không tồn tại hoặc đang trong quá trình phát triển.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-bold py-3 px-6 rounded-xl transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-sky-500/30 transition active:scale-95"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}