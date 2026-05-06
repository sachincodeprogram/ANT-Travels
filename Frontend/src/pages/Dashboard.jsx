import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { BookingSkeleton } from "../components/Skeleton";
import { MdLocationOn, MdCalendarToday, MdDirectionsCar } from "react-icons/md";
import { FiCreditCard, FiPercent } from "react-icons/fi";

const API = import.meta.env.VITE_API || "http://localhost:5000/api";

const statusColor = (s) =>
  s === "confirmed" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444";

const BookingCard = ({ b }) => {
  const remaining = b.paymentType === "advance"
    ? b.totalAmount - b.advanceAmount
    : 0;

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "18px",
      overflow: "hidden",
      boxShadow: "var(--shadow)",
      marginBottom: "16px",
    }}>
      <div className="row g-0">
        {/* Vehicle image */}
        {b.vehicleImage && (
          <div className="col-4 col-md-3 d-none d-sm-block">
            <img
              src={b.vehicleImage}
              style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "140px" }}
              alt={b.vehicleName}
            />
          </div>
        )}
        <div className={b.vehicleImage ? "col-12 col-sm-8 col-md-9" : "col-12"}>
          <div style={{ padding: "18px 20px" }}>

            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <MdDirectionsCar size={18} color="#3b82f6" />
                <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "15px" }}>
                  {b.vehicleName}
                </span>
                <span style={{
                  background: "#3b82f620", color: "#3b82f6",
                  fontSize: "11px", fontWeight: "600",
                  padding: "2px 8px", borderRadius: "20px", textTransform: "capitalize",
                }}>
                  {b.vehicleType}
                </span>
              </div>
              <span style={{
                background: statusColor(b.status) + "20",
                color: statusColor(b.status),
                fontSize: "12px", fontWeight: "600",
                padding: "4px 12px", borderRadius: "20px", textTransform: "capitalize",
              }}>
                ✓ {b.status}
              </span>
            </div>

            {/* Route */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
              <MdLocationOn size={14} color="#3b82f6" />
              <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px" }}>{b.from}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>→</span>
              <span style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px" }}>{b.to}</span>
            </div>

            {/* Dates */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
              {b.startDate && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MdCalendarToday size={12} color="var(--text-muted)" />
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {b.startDate}{b.endDate ? ` → ${b.endDate}` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Payment info */}
            <div style={{
              display: "flex", gap: "12px", flexWrap: "wrap",
              padding: "10px 12px",
              background: "var(--bg-primary)",
              borderRadius: "10px", border: "1px solid var(--border-color)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {b.paymentType === "advance" ? <FiPercent size={13} color="#3b82f6" /> : <FiCreditCard size={13} color="#10b981" />}
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {b.paymentType === "advance" ? "5% Advance Paid" : "Full Payment"}
                </span>
                <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "13px" }}>
                  ₹{b.advanceAmount?.toLocaleString()}
                </span>
              </div>
              {remaining > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "12px", color: "#f59e0b" }}>
                    Due on arrival: ₹{remaining.toLocaleString()}
                  </span>
                </div>
              )}
              <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)" }}>
                Total est. ₹{b.totalAmount?.toLocaleString()}
              </div>
            </div>

            {b.paymentId && (
              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "8px 0 0" }}>
                Payment ID: {b.paymentId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        axios.get(`${API}/bookings/${u.uid}`)
          .then((res) => setBookings(Array.isArray(res.data) ? res.data : []))
          .catch(() => toast.error("Failed to load bookings"))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <img
                src={user.photoURL || "https://placehold.co/44"}
                style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #3b82f6" }}
                alt="avatar"
              />
              <div>
                <h4 style={{ margin: 0, fontWeight: "800", color: "var(--text-primary)" }}>
                  {user.displayName}
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>{user.email}</p>
              </div>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
            <h5 style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)" }}>My Bookings</h5>
            {!loading && (
              <span style={{
                background: "#3b82f620", color: "#3b82f6",
                fontSize: "13px", fontWeight: "600",
                padding: "4px 14px", borderRadius: "20px",
              }}>
                {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {!user ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "56px" }}>🔐</div>
            <p style={{ color: "var(--text-muted)", fontSize: "16px", marginTop: "12px" }}>
              Please login to view your bookings
            </p>
          </div>
        ) : loading ? (
          [...Array(3)].map((_, i) => <BookingSkeleton key={i} />)
        ) : bookings.length > 0 ? (
          bookings.map((b) => <BookingCard key={b._id} b={b} />)
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "56px" }}>📋</div>
            <p style={{ color: "var(--text-muted)", fontSize: "16px", marginTop: "12px" }}>
              No bookings yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
