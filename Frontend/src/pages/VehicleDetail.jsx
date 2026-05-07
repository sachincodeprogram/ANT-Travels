import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useBooking } from "../context/BookingContext";
import { MdDirectionsCar, MdAirlineSeatReclineNormal, MdAcUnit, MdSpeed } from "react-icons/md";
import { FiArrowLeft, FiMapPin, FiShield, FiStar, FiClock, FiUser, FiCheckCircle } from "react-icons/fi";

const API = import.meta.env.VITE_API || "https://ant-travels-4c1n.onrender.com/api";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { journey } = useBooking();
  const [vehicle, setVehicle]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [user, setUser]           = useState(undefined);
  const [profile, setProfile]     = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/vehicles`)
      .then((res) => {
        const found = (res.data?.data || []).find((v) => v._id === id);
        setVehicle(found || null);
      })
      .catch(() => toast.error("Failed to load vehicle"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        try {
          const { data } = await axios.get(`${API}/users/${u.uid}`);
          setProfile(data);
        } catch { setProfile(null); }
      }
    });
    return () => unsub();
  }, []);

  const handleBook = () => {
    if (!user) {
      toast.error("Please login first!", { icon: "ðŸ”" });
      navigate("/login");
      return;
    }
    if (!journey) {
      toast.error("Select your journey details first!", { icon: "ðŸ—ºï¸" });
      navigate("/");
      return;
    }
    if (!profile?.phone || !profile?.address) {
      toast.error("Complete your profile to book!", { icon: "ðŸ‘¤" });
      navigate("/profile");
      return;
    }
    navigate(`/booking/${vehicle._id}`, { state: { vehicle, journey } });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 52, height: 52, border: "3px solid rgba(59,130,246,0.2)", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: "var(--text-muted)" }}>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 64 }}>ðŸš—</div>
        <h3 style={{ color: "var(--text-primary)" }}>Vehicle not found</h3>
        <button onClick={() => navigate("/vehicles")} className="btn-gradient" style={{ padding: "10px 28px", fontSize: 14 }}>
          Back to Vehicles
        </button>
      </div>
    );
  }

  const typeIcon  = vehicle.type === "car" ? "ðŸš—" : vehicle.type === "minibus" ? "ðŸš" : "ðŸšŒ";
  const typeLabel = vehicle.type === "car" ? "Car" : vehicle.type === "minibus" ? "Mini Bus" : "Bus";

  const features = [
    { icon: <MdAcUnit size={18} />, label: vehicle.ac !== false ? "Air Conditioned" : "Non-AC", color: vehicle.ac !== false ? "#06b6d4" : "#64748b" },
    { icon: <MdAirlineSeatReclineNormal size={18} />, label: vehicle.seats > 0 ? `${vehicle.seats} Seats` : "Comfortable Seating", color: "#8b5cf6" },
    { icon: <FiUser size={18} />, label: "Professional Driver", color: "#10b981" },
    { icon: <FiShield size={18} />, label: "Fully Insured", color: "#f59e0b" },
    { icon: <FiClock size={18} />, label: "24/7 Support", color: "#3b82f6" },
    { icon: <MdSpeed size={18} />, label: "GPS Tracked", color: "#ec4899" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* â”€â”€ Hero Image â”€â”€ */}
      <div style={{ position: "relative", height: "clamp(260px,40vh,420px)", overflow: "hidden" }}>
        <img
          src={vehicle.image || "https://placehold.co/1200x420/0d1424/3b82f6?text=Vehicle"}
          alt={vehicle.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transition: "opacity 0.4s",
            opacity: imgLoaded ? 1 : 0,
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(6,8,24,0.3) 0%, rgba(6,8,24,0.75) 100%)",
        }} />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute", top: 20, left: 20,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", borderRadius: 10, padding: "8px 16px",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.45)")}
        >
          <FiArrowLeft size={15} /> Back
        </button>
        {/* Hero title */}
        <div style={{ position: "absolute", bottom: 28, left: 0, right: 0, padding: "0 24px" }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(59,130,246,0.85)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>
                    {typeIcon} {typeLabel}
                  </span>
                  {vehicle.ac !== false && (
                    <span style={{ background: "rgba(6,182,212,0.85)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>
                      â„ï¸ AC
                    </span>
                  )}
                  {vehicle.seats > 0 && (
                    <span style={{ background: "rgba(139,92,246,0.85)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>
                      {vehicle.seats} Seats
                    </span>
                  )}
                </div>
                <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(24px,5vw,38px)", margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                  {vehicle.name}
                </h1>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                  ₹{vehicle.pricePerKm}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>per km</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Content â”€â”€ */}
      <div className="container fade-up" style={{ maxWidth: 960, padding: "32px 16px 60px" }}>
        <div className="row g-4">

          {/* â”€â”€ Left Column â”€â”€ */}
          <div className="col-lg-7">

            {/* Description */}
            {vehicle.description && (
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: "var(--shadow)",
              }}>
                <h5 style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <MdDirectionsCar size={20} color="#3b82f6" /> About This Vehicle
                </h5>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: 14, margin: 0 }}>
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Features grid */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: "var(--shadow)",
            }}>
              <h5 style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <FiCheckCircle size={18} color="#10b981" /> Features & Amenities
              </h5>
              <div className="row g-3">
                {features.map((f, i) => (
                  <div key={i} className="col-6">
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "var(--bg-primary)", borderRadius: 12,
                      padding: "12px 14px", border: "1px solid var(--border-color)",
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: f.color + "18",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: f.color,
                      }}>
                        {f.icon}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                        {f.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey required notice */}
            {!journey && (
              <div style={{
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <FiMapPin size={18} color="#f59e0b" />
                <div>
                  <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 13 }}>Journey not set</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    Go to Home and select pickup, drop & dates first.
                    {" "}<span style={{ color: "#3b82f6", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/")}>Set Journey →</span>
                  </div>
                </div>
              </div>
            )}
            {journey && (
              <div style={{
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <FiMapPin size={18} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: "#10b981", fontSize: 13 }}>Journey Ready</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {journey.from} → {journey.to} · {journey.startDate}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* â”€â”€ Right Column — Booking Card â”€â”€ */}
          <div className="col-lg-5">
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: 20, padding: 24, boxShadow: "var(--shadow-lg)",
              position: "sticky", top: 88,
            }}>
              <h5 style={{ fontWeight: 800, color: "var(--text-primary)", marginBottom: 18 }}>Fare Estimate</h5>

              {[
                { label: "Rate",          value: `₹${vehicle.pricePerKm}/km` },
                { label: "Est. Distance", value: "~100 km" },
                { label: "Est. Total",    value: `₹${(vehicle.pricePerKm * 100).toLocaleString()}` },
                { label: "5% Advance",    value: `₹${Math.ceil(vehicle.pricePerKm * 100 * 0.05).toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid var(--border-color)",
                }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{value}</span>
                </div>
              ))}

              <p style={{
                fontSize: 11, color: "var(--text-muted)",
                background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)",
                borderRadius: 8, padding: "8px 10px", margin: "14px 0 20px",
              }}>
                âš ï¸ Final fare calculated on actual distance travelled.
              </p>

              <button
                onClick={handleBook}
                className="btn-gradient"
                style={{ width: "100%", padding: "15px", fontSize: 16, borderRadius: 14 }}
              >
                Book This Vehicle →
              </button>

              <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 16 }}>
                {["Secure", "Instant Confirm", "Free Cancel"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <FiStar size={10} color="#10b981" />
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;

