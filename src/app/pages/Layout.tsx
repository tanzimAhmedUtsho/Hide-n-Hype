import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LiveChat } from "../components/LiveChat";

export function Layout() {
  return (
    <div className="bg-background min-h-screen" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <Navbar />
      <Outlet />
      <Footer />
      <LiveChat />
    </div>
  );
}
