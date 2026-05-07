import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useBooking } from "../context/BookingContext";
import { MdLocationOn, MdCalendarToday, MdAcUnit, MdAirlineSeatReclineNormal } from "react-icons/md";
import { FiInfo, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const API  = import.meta.env.VITE_API || "https://ant-travels-4c1n.onrender.com/api";
const norm = (t) => t?.toLowerCase().trim().replace(/\s+/g, "");

/* ─── Skeleton Card ─── */
const SkeletonCard = () => (
  <div className="col-12 col-sm-6 col-lg-4">
    <div style={{
      background: "var(--bg-card)", borderRadius: 20,
      overflow: "hidden", border: "1px solid var(--border-color)",
    }}>
      <div style={{ height: 200, background: "var(--border-color)", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: 18 }}>
        <div style={{ height: 16, width: "70%", borderRadius: 8, background: "var(--border-color)", marginBottom: 10 }} />
        <div style={{ height: 12, width: "50%", borderRadius: 8, background: "var(--border-color)", marginBottom: 16 }} />
        <div style={{ height: 38, borderRadius: 10, background: "var(--border-color)" }} />
      </div>
    </div>
  </div>
);

/* ─── Vehicle Card ─── */
const VehicleCard = ({ v, onDetailsClick, onBookClick }) => {
  const typeLabel = v.type === "car" ? "Car" : v.type === "minibus" ? "Mini Bus" : "Bus";
  const typeColor = v.type === "car" ? "#3b82f6" : v.type === "minibus" ? "#8b5cf6" : "#f59e0b";

  return (
    <div className="col-12 col-sm-6 col-lg-4 d-flex">
      <div
        onClick={() => onDetailsClick(v)}
        style={{
          background: "var(--bg-card)",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow)";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden" }}>
          <img
            src={v.image || "https://placehold.co/600x300/0d1424/3b82f6?text=Vehicle"}
            alt={v.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
          }} />
          {/* Badges */}
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
            <span style={{
              background: typeColor,
              color: "#fff", fontSize: 11, fontWeight: 700,
              padding: "4px 10px", borderRadius: 20,
              backdropFilter: "blur(8px)",
            }}>
              {typeLabel}
            </span>
            {v.ac !== false && (
              <span style={{
                background: "rgba(6,182,212,0.9)",
                color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "4px 10px", borderRadius: 20,
                backdropFilter: "blur(8px)",
              }}>
                AC
              </span>
            )}
          </div>
          {/* Price on image */}
          <div style={{ position: "absolute", bottom: 12, right: 12 }}>
            <div style={{
              background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
              borderRadius: 12, padding: "6px 12px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>₹{v.pricePerKm}</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>/km</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Name */}
          <div>
            <h6 style={{
              fontWeight: 800, color: "var(--text-primary)",
              fontSize: 16, margin: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {v.name}
            </h6>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
              {v.seats > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                  <MdAirlineSeatReclineNormal size={13} color="#8b5cf6" /> {v.seats} Seats
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                <MdAcUnit size={13} color={v.ac !== false ? "#06b6d4" : "#64748b"} />
                {v.ac !== false ? "AC" : "Non-AC"}
              </span>
            </div>
          </div>

          {/* Description snippet */}
          {v.description && (
            <p style={{
              fontSize: 12, color: "var(--text-muted)",
              lineHeight: 1.6, margin: 0,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {v.description}
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onDetailsClick(v); }}
              style={{
                flex: 1, padding: "9px 0",
                borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.color = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <FiInfo size={13} /> Details
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onBookClick(v); }}
              style={{
                flex: 1.4, padding: "9px 0",
                borderRadius: 10, fontSize: 13, fontWeight: 700,
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                color: "#fff", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.3)";
              }}
            >
              Book Now <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Section ─── */
const Section = ({ label, data, loading, onBookClick, onDetailsClick }) => {
  if (!loading && data.length === 0) return null;
  return (
    <div style={{ marginBottom: 52 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h5 style={{ margin: 0, fontWeight: 800, color: "var(--text-primary)", fontSize: 20 }}>
          {label}
        </h5>
        {!loading && (
          <span style={{
            fontSize: 11, color: "var(--text-muted)",
            background: "var(--bg-card)", border: "1px solid var(--border-color)",
            padding: "2px 10px", borderRadius: 20, fontWeight: 600,
          }}>
            {data.length} available
          </span>
        )}
        <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
      </div>

      {loading ? (
        <div className="row g-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="row g-4">
          {data.map((v) => (
            <VehicleCard key={v._id} v={v} onBookClick={onBookClick} onDetailsClick={onDetailsClick} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ══ Main ══ */
const VehicleList = () => {
  const navigate = useNavigate();
  const { journey } = useBooking();
  const [vehicles, setVehicles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState("all");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [profile, setProfile]       = useState(null);

  useEffect(() => {
    axios.get(`${API}/vehicles`)
      .then((res) => setVehicles(res.data?.data || []))
      .catch(() => toast.error("Failed to load vehicles"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u || null);
      if (u) {
        try {
          const { data } = await axios.get(`${API}/users/${u.uid}`);
          setProfile(data);
        } catch { setProfile(null); }
      }
    });
    return () => unsub();
  }, []);

  const handleDetailsClick = (vehicle) => navigate(`/vehicles/${vehicle._id}`);

  const handleBookClick = (vehicle) => {
    if (!currentUser) { toast.error("Please login first!"); navigate("/login"); return; }
    if (!journey)     { toast.error("Select journey details first!"); navigate("/"); return; }
    if (!profile?.phone || !profile?.address) { toast.error("Complete your profile first!"); navigate("/profile"); return; }
    navigate(`/booking/${vehicle._id}`, { state: { vehicle, journey } });
  };

  const tabs = [
    { key: "all",     label: "All Vehicles" },
    { key: "car",     label: "Cars" },
    { key: "minibus", label: "Mini Bus" },
    { key: "bus",     label: "Bus" },
  ];

  const cars      = vehicles.filter((v) => norm(v.type) === "car");
  const minibuses = vehicles.filter((v) => norm(v.type) === "minibus");
  const buses     = vehicles.filter((v) => norm(v.type) === "bus");

  const allSections = [
    { key: "car",     label: "Cars",     data: cars },
    { key: "minibus", label: "Mini Bus",  data: minibuses },
    { key: "bus",     label: "Buses",     data: buses },
  ];
  const visibleSections = activeTab === "all"
    ? allSections
    : allSections.filter((s) => s.key === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #060818 0%, #0d1a3a 60%, #060c20 100%)",
        padding: "64px 20px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow orbs */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.2), transparent 60%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -80, left: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(59,130,246,0.06)", filter: "blur(60px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -40, right: "10%",
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(6,182,212,0.07)", filter: "blur(50px)",
          pointerEvents: "none",
        }} />

        <h1 style={{
          color: "#fff", fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 42px)",
          margin: "0 0 12px", letterSpacing: "-0.5px",
        }}>
          Choose Your Perfect Ride
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
          {loading ? "Loading vehicles..." : `${vehicles.length} vehicles available across categories`}
        </p>
      </div>

      {/* ── Content ── */}
      <div className="container pb-5 fade-up" style={{ marginTop: "-40px" }}>

        {/* Journey Banner */}
        {journey ? (
          <div style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 16, padding: "14px 20px", marginBottom: 28,
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10,
          }}>
            <MdLocationOn color="#10b981" size={18} />
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>{journey.from}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 16 }}>→</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>{journey.to}</span>
            {journey.startDate && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
                <MdCalendarToday size={12} />
                {journey.startDate}{journey.endDate ? ` → ${journey.endDate}` : ""}
              </span>
            )}
            <span style={{
              marginLeft: "auto", background: "#10b981",
              color: "#fff", fontSize: 11, fontWeight: 700,
              padding: "4px 14px", borderRadius: 20,
            }}>
              ✓ Journey Set
            </span>
          </div>
        ) : (
          <div style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.22)",
            borderRadius: 14, padding: "14px 18px", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <FiAlertCircle color="#f59e0b" size={18} />
            <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
              Set your journey details on the{" "}
              <span
                style={{ color: "#3b82f6", fontWeight: 700, cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Home page
              </span>{" "}
              to enable booking.
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap",
          justifyContent: "center", marginBottom: 40,
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key
                  ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                  : "var(--bg-card)",
                color: activeTab === tab.key ? "#fff" : "var(--text-muted)",
                border: `1px solid ${activeTab === tab.key ? "transparent" : "var(--border-color)"}`,
                padding: "9px 24px", borderRadius: 25,
                fontWeight: 700, cursor: "pointer", fontSize: 13,
                boxShadow: activeTab === tab.key ? "0 6px 18px rgba(59,130,246,0.35)" : "none",
                transition: "all 0.2s",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vehicle Sections */}
        {visibleSections.map((s) => (
          <Section
            key={s.key}
            label={s.label}
            data={s.data}
            loading={loading}
            onBookClick={handleBookClick}
            onDetailsClick={handleDetailsClick}
          />
        ))}

        {/* Empty state */}
        {!loading && vehicles.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🚗</div>
            <h4 style={{ color: "var(--text-primary)", fontWeight: 700 }}>No vehicles available</h4>
            <p style={{ color: "var(--text-muted)" }}>Check back soon for available rides.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
