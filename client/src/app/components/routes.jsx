import { createBrowserRouter } from "react-router";
import { Layout } from "./ui/Layout";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { HotelDetail } from "./pages/HotelDetail";
import { Checkout } from "./pages/Checkout";
import { Profile } from "./pages/Profile";
import { Offers } from "./pages/Offers";
import { Support } from "./pages/Support";
import { Discover } from "./pages/Discover";
import { NotFound } from "./pages/NotFound";
import { About } from "./pages/About";
import { Careers } from "./pages/Careers";
import { Press } from "./pages/Press";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { ManagerLayout } from "./ui/ManagerLayout";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManageHotels from "./pages/ManageHotels";
import ManageVouchers from "./pages/ManageVouchers";
import ManageUsers from "./pages/ManageUsers";
import ManageInvoices from "./pages/ManageInvoices";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "search", Component: Search },
      { path: "hotel/:id", Component: HotelDetail },
      { path: "checkout/:id", Component: Checkout },
      { path: "profile", Component: Profile },
      { path: "offers", Component: Offers },
      { path: "support", Component: Support },
      { path: "discover", Component: Discover },
      { path: "about", Component: About },
      { path: "careers", Component: Careers },
      { path: "press", Component: Press },
      { path: "privacy", Component: Privacy },
      { path: "terms", Component: Terms },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/manager",
    Component: ManagerLayout,
    children: [
      { path: "dashboard", Component: ManagerDashboard },
      { path: "hotels", Component: ManageHotels },
      { path: "vouchers", Component: ManageVouchers },
      { path: "users", Component: ManageUsers },
      { path: "invoices", Component: ManageInvoices },
    ],
  },
]);
