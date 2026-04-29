import { Outlet } from "react-router-dom";
import { AuthModal } from "../../../components/AuthModal";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] text-slate-800 font-sans flex flex-col relative">
      <AuthModal />

      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}