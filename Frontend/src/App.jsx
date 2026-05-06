import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { BookingProvider } from "./context/BookingContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VehicleList from "./pages/VehicleList";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import VehicleDetail from "./pages/VehicleDetail";

function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
      <BrowserRouter>
        <Navbar />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: { style: { background: "#10b981", color: "#fff" } },
            error: { style: { background: "#ef4444", color: "#fff" } },
          }}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", marginTop: "80px" }}>
                <p style={{ fontSize: "64px" }}>404</p>
                <h2 style={{ color: "var(--text-primary)" }}>Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      </BookingProvider>
    </ThemeProvider>
  );
}

export default App;
