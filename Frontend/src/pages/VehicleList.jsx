import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CardSkeleton } from "../components/Skeleton";
import { useBooking } from "../context/BookingContext";
import { MdLocationOn, MdCalendarToday, MdAcUnit, MdAirlineSeatReclineNormal } from "react-icons/md";
import { FiInfo, FiArrowRight } from "react-icons/fi";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const API  = import.meta.env.VITE_API || "http://localhost:5000/api";
const norm = (t) => t?.toLowerCase().trim().replace(/\s+/g, "");

/* ─── Vehicle Card ─── */
const VehicleCard = ({ v, onDetailsClick, onBookClick, journey }) => {
  const typeIcon = v.type === "car" ? "🚗" : v.type === "minibus" ? "🚐" : "🚌";

  return (
    <div className="col-6 col-md-4 col-lg-3 d-flex">
      <div style={{
        background: "var(--bg-card)", borderRadius: 20,
        overflow: "hidden", boxShadow: "var(--shadow)",
        width: "100%", border: "1px solid var(--border-color)",
        transition: "transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease",
        display: "flex", flexDirection: "column", cursor: "pointer",
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow)";
        }}
        onClick={() => onDetailsClick(v)}
      >
        {/* Image */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src={v.image || "https://placehold.co/400x200/0d1424/3b82f6?text=Vehicle"}
            alt={v.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
          <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 4 }}>
            <span style={{ background: "rgba(59,130,246,0.9)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
              {typeIcon} {v.type}
            </span>
            {v.ac !== false && (
              <span style={{ background: "rgba(6,182,212,0.85)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                ❄️
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h6 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 14, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {v.name}
          </h6>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            {v.seats > 0 && <><MdAirlineSeatReclineNormal size={12} /> {v.seats} Seats •</>}
            {v.ac !== false ? <><MdAcUnit size={12} /> AC</> : "Non-AC"}
          </p>

          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#3b82f6" }}>₹{v.pricePerKm}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>/km</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onDetailsClick(v); }}
                style={{
                  flex: 1, padding: "7px 0", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#3b82f6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <FiInfo size={12} /> Details
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onBookClick(v); }}
                style={{
                  flex: 1, padding: "7px 0", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "#fff", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                Book <FiArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Section ─── */
const Section = ({ icon, label, data, loading, journey, onBookClick, onDetailsClick }) => {
  if (!loading && data.length === 0) return null;
  return (
    <div className="mb-5">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, fontSize: 22,
          background: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(6,182,212,0.1))",
          border: "1px solid rgba(59,130,246,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
        <div>
          <h5 style={{ margin: 0, fontWeight: 800, color: "var(--text-primary)", fontSize: 18 }}>{label}</h5>
          {!loading && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{data.length} vehicle{data.length !== 1 ? "s" : ""} available</span>}
        </div>
      </div>
      {loading ? (
        <div className="row g-3">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="row g-3">
          {data.map((v) => <VehicleCard key={v._id} v={v} journey={journey} onBookClick={onBookClick} onDetailsClick={onDetailsClick} />)}
        </div>
      )}
    </div>
  );
};

/* ══ Main ══ */
const VehicleList = () => {
  const navigate = useNavigate();
  const { journey } = useBooking();
  const [vehicles, setVehicles]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState("all");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [profile, setProfile]         = useState(null);

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
    if (!currentUser) { toast.error("Please login first!", { icon: "🔐" }); navigate("/login"); return; }
    if (!journey)     { toast.error("Select journey details first!", { icon: "🗺️" }); navigate("/"); return; }
    if (!profile?.phone || !profile?.address) { toast.error("Complete your profile first!", { icon: "👤" }); navigate("/profile"); return; }
    navigate(`/booking/${vehicle._id}`, { state: { vehicle, journey } });
  };

  const tabs = [
    { key: "all",     label: "All Vehicles", icon: "🚘" },
    { key: "car",     label: "Cars",         icon: "🚗" },
    { key: "minibus", label: "Mini Bus",      icon: "🚐" },
    { key: "bus",     label: "Bus",           icon: "🚌" },
  ];

  const cars      = vehicles.filter((v) => norm(v.type) === "car");
  const minibuses = vehicles.filter((v) => norm(v.type) === "minibus");
  const buses     = vehicles.filter((v) => norm(v.type) === "bus");

  const allSections = [
    { key: "car",     icon: "🚗", label: "Cars",     data: cars },
    { key: "minibus", icon: "🚐", label: "Mini Bus",  data: minibuses },
    { key: "bus",     icon: "🚌", label: "Bus",       data: buses },
  ];
  const visibleSections = activeTab === "all" ? allSections : allSections.filter((s) => s.key === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg,#060818 0%,#0d1a3a 60%,#060c20 100%)",
        padding: "56px 20px 72px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(59,130,246,0.15),transparent 65%)", pointerEvents: "none" }} />
        <p style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
          Our Fleet
        </p>
        <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(26px,5vw,38px)", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
          Choose Your Perfect Ride
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>
          {loading ? "Loading..." : `${vehicles.length} vehicles available across categories`}
        </p>
      </div>

      <div className="container pb-5 fade-up" style={{ marginTop: "-38px" }}>

        {/* Journey Banner */}
        {journey ? (
          <div style={{
            background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.06))",
            border: "1px solid rgba(16,185,129,0.22)", borderRadius: 16,
            padding: "14px 20px", marginBottom: 24,
            display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <MdLocationOn color="#10b981" size={18} />
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>{journey.from}</span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>{journey.to}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <MdCalendarToday size={12} /> {journey.startDate}{journey.endDate ? ` → ${journey.endDate}` : ""}
            </span>
            <span style={{ marginLeft: "auto", background: "#10b981", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>
              ✓ Journey Set
            </span>
          </div>
        ) : (
          <div style={{
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)",
            borderRadius: 14, padding: "12px 18px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <FiInfo color="#f59e0b" size={16} />
            <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
              You can view details freely.{" "}
              <span style={{ color: "#3b82f6", fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>
                Set your journey
              </span>{" "}
              on home page to enable booking.
            </span>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              background: activeTab === tab.key ? "linear-gradient(135deg,#3b82f6,#06b6d4)" : "var(--bg-card)",
              color: activeTab === tab.key ? "#fff" : "var(--text-muted)",
              border: `1px solid ${activeTab === tab.key ? "transparent" : "var(--border-color)"}`,
              padding: "8px 22px", borderRadius: 25, fontWeight: 700, cursor: "pointer", fontSize: 13,
              boxShadow: activeTab === tab.key ? "0 6px 18px rgba(59,130,246,0.35)" : "none",
              transition: "all 0.2s",
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        {visibleSections.map((s) => (
          <Section key={s.key} icon={s.icon} label={s.label} data={s.data}
            loading={loading} journey={journey}
            onBookClick={handleBookClick} onDetailsClick={handleDetailsClick}
          />
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
