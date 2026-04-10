import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

export function AuthModal() {
  const navigate = useNavigate();
  const { authModalMode, setAuthModalOpen, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (authModalMode) {
      setIsLogin(authModalMode === 'login');
      setError("");
      setSuccessMsg("");
    }
  }, [authModalMode]);

  if (!authModalMode) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
        setAuthModalOpen(null);
      } else {
        await registerWithEmail({ email, password, username, dob, citizenId, phone, address });
        setSuccessMsg("Đăng ký thành công! Vui lòng đăng nhập lại.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi xác thực.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setAuthModalOpen(null);
    } catch (err) {
      setError(err.message || "Không thể đăng nhập bằng Google.");
    }
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/50 outline-none transition text-sm text-slate-700";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 my-8">
        
        <button 
          onClick={() => {
            setAuthModalOpen(null);
            navigate('/');
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition"
        >
          <X className="w-5 h-5"/>
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h2>
            <p className="text-sm text-slate-500">
              {isLogin 
                ? "Đăng nhập để khám phá hàng ngàn ưu đãi." 
                : "Tham gia đại gia đình AquaStays ngay hôm nay."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Tên đăng nhập / Họ tên" 
                  className={inputClass} 
                />

                <div className="flex gap-2">
                  <input 
                    type="date" 
                    required 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    className={inputClass} 
                  />
                  <input 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Số điện thoại" 
                    className={inputClass} 
                  />
                </div>

                <input 
                  type="text" 
                  required 
                  value={citizenId} 
                  onChange={(e) => setCitizenId(e.target.value)} 
                  placeholder="Số căn cước công dân (CCCD)" 
                  className={inputClass} 
                />

                <input 
                  type="text" 
                  required 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Địa chỉ thường trú" 
                  className={inputClass} 
                />
              </>
            )}
            
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn" 
              className={inputClass} 
            />

            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu" 
              className={inputClass} 
            />
            
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg border border-green-100">
                {successMsg}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-sky-500/30 transition active:scale-95 mt-2"
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>

          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Hoặc</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            type="button" 
            className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl transition flex items-center justify-center gap-3"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-5 h-5" 
            />
            Tiếp tục với Google
          </button>
          
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              type="button"
              onClick={() => { 
                setIsLogin(!isLogin); 
                setError(""); 
                setSuccessMsg(""); 
              }}
              className="text-sky-600 font-bold hover:underline"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}