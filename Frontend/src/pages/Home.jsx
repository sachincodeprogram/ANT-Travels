import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { useBooking } from "../context/BookingContext";
import { CardSkeleton } from "../components/Skeleton";
import { MdLocationOn, MdCalendarToday, MdSearch } from "react-icons/md";
import { FiShield, FiStar, FiClock, FiThumbsUp, FiAlertCircle } from "react-icons/fi";

const API = import.meta.env.VITE_API || "https://ant-travels-4c1n.onrender.com/api";
const norm = (t) => t?.toLowerCase().trim().replace(/\s+/g, "");

const SERVICE_CITIES = [
  "Delhi NCR",
  "Noida",
  "Delhi Airport",
  "Noida Airport",
  "Meerut",
  "Agra",
  "Mathura",
  "Haridwar",
  "Uttarakhand",
  "Mumbai",
];

/* â”€â”€â”€ Reusable select style â”€â”€â”€ */
const selectStyle = (isDark) => ({
  width: "100%",
  padding: "10px 12px 10px 34px",
  background: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  borderRadius: "10px",
  color: "var(--text-primary)",
  fontSize: "14px",
  outline: "none",
  appearance: "none",
  cursor: "pointer",
});

/* â”€â”€â”€ Vehicle Card â”€â”€â”€ */
const VehicleCard = ({ v, navigate }) => (
  <div className="col-6 col-md-4 col-lg-3 d-flex">
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        width: "100%",
        border: "1px solid var(--border-color)",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        cursor: "pointer",
      }}
      onClick={() => navigate("/vehicles")}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={v.image?.startsWith("http") ? v.image : "https://placehold.co/300x180/1e293b/94a3b8?text=Vehicle"}
          style={{ height: "145px", width: "100%", objectFit: "cover" }}
          alt={v.name}
        />
        <span style={{
          position: "absolute", bottom: "8px", left: "8px",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          color: "#fff", fontSize: "10px", fontWeight: "600",
          padding: "3px 9px", borderRadius: "20px",
          textTransform: "capitalize",
        }}>
          {v.type}
        </span>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <h6 style={{
          fontWeight: "700", color: "var(--text-primary)",
          fontSize: "13px", marginBottom: "2px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {v.name}
        </h6>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 10px" }}>
          AC • Comfortable Ride
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "17px", fontWeight: "800", color: "#3b82f6" }}>₹{v.pricePerKm}</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/km</span>
          </div>
          <span style={{
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            color: "#fff", fontSize: "12px", fontWeight: "600",
            padding: "5px 12px", borderRadius: "8px",
          }}>
            Book
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* â”€â”€â”€ Section â”€â”€â”€ */
const Section = ({ icon, label, data, loading, navigate }) => {
  if (!loading && data.length === 0) return null;
  return (
    <div style={{ marginBottom: "48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontSize: "22px", width: "42px", height: "42px",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{icon}</span>
          <div>
            <h5 style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)", fontSize: "17px" }}>
              {label}
            </h5>
            {!loading && (
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {data.length} vehicle{data.length !== 1 ? "s" : ""} available
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate("/vehicles")}
          style={{
            background: "transparent", border: "1px solid var(--border-color)",
            color: "#3b82f6", borderRadius: "8px", padding: "6px 14px",
            fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.borderColor = "#3b82f6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border-color)"; }}
        >
          View All Vehicles
        </button>
      </div>
      {loading ? (
        <div className="row g-3">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="row g-3">
          {data.slice(0, 4).map((v) => <VehicleCard key={v._id} v={v} navigate={navigate} />)}
        </div>
      )}
    </div>
  );
};

/* â”€â”€â”€ Feature Card â”€â”€â”€ */
const Feature = ({ icon, title, desc }) => (
  <div className="col-6 col-md-3">
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border-color)",
      borderRadius: "16px", padding: "20px 16px", textAlign: "center",
      height: "100%", transition: "transform 0.2s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{
        width: "46px", height: "46px", borderRadius: "14px",
        background: "linear-gradient(135deg, #3b82f620, #06b6d420)",
        border: "1px solid rgba(59,130,246,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 12px", color: "#3b82f6",
      }}>{icon}</div>
      <h6 style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "14px", marginBottom: "6px" }}>{title}</h6>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MAIN â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { setJourney } = useBooking();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Search state */
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noService, setNoService] = useState(false);

  useEffect(() => {
    axios.get(`${API}/vehicles`)
      .then((res) => {
        const data = res.data?.data || res.data?.vehicles || (Array.isArray(res.data) ? res.data : []);
        setVehicles(data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const cars     = vehicles.filter((v) => norm(v.type) === "car");
  const minibuses = vehicles.filter((v) => norm(v.type) === "minibus");
  const buses    = vehicles.filter((v) => norm(v.type) === "bus");

  const handleSearch = () => {
    if (!from || !to) {
      toast.error("Please select pickup and drop city");
      return;
    }
    if (!startDate) {
      toast.error("Please select travel start date");
      return;
    }
    if (from === to) {
      toast.error("Pickup and drop city cannot be same");
      return;
    }
    /* "other" means city not in service list */
    if (from === "other" || to === "other") {
      setNoService(true);
      return;
    }
    setNoService(false);
    setJourney({ from, to, startDate, endDate });
    toast.success(`Journey saved! Now book your vehicle 🚗`);
    navigate("/vehicles");
  };

  /* Reset noService message when cities change */
  useEffect(() => { setNoService(false); }, [from, to]);

  const inputIcon = { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>

      {/* â•â• HERO â•â• */}
      <div style={{ position: "relative" }}>
        {/* Carousel */}
        <div id="travelCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="4000">
          <div className="carousel-inner">
            {[
              { src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=80", caption: "Taj Mahal, Agra" },
              { src: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1400&q=80", caption: "Char Dham Yatra" },
              { src: "https://vrindavanmathura.com/wp-content/uploads/prem-mandir-temple-vrindavan-mathura-india-prem-mandir-temple-is-maintained-by-jagadguru-kripalu-parishat-international-non-profit-educational-spiritual-charitable-trust.jpg", caption: "Mathura Vrindavan" },
            ].map(({ src, caption }, i) => (
              <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
                <img src={src} className="d-block w-100" style={{ height: "400px", objectFit: "cover" }} alt={caption} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#travelCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#travelCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" />
          </button>
        </div>

        {/* Overlay text â€” sits on top of carousel */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(6,8,20,0.38) 0%, rgba(6,8,20,0.65) 55%, rgba(6,8,20,0.88) 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 20px", textAlign: "center",
          pointerEvents: "none",
        }}>
          <span style={{
            background: "rgba(59,130,246,0.22)", border: "1px solid rgba(59,130,246,0.45)",
            color: "#93c5fd", fontSize: "11px", fontWeight: "600",
            padding: "4px 14px", borderRadius: "20px",
            letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px",
          }}>
            #1 Travel Partner in India
          </span>
          <h1 style={{
            color: "#fff", fontWeight: "800",
            fontSize: "clamp(24px, 4.5vw, 46px)",
            lineHeight: 1.15, marginBottom: "10px", maxWidth: "640px",
          }}>
            Travel Smarter,{" "}
            <span style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Book Faster
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "clamp(13px, 1.8vw, 16px)", maxWidth: "440px", margin: 0 }}>
            Cars, Mini Buses & Buses — safe, affordable, on-time across India.
          </p>
        </div>
      </div>

      {/* â•â• SEARCH CARD â•â• */}
      <div className="container" style={{ marginTop: "-32px", position: "relative", zIndex: 10 }}>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "20px",
          padding: "24px 24px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <MdSearch size={18} color="#3b82f6" />
            <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--text-primary)" }}>
              Book Your Journey
            </span>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)" }}>
              10 cities served
            </span>
          </div>

          <div className="row g-3 align-items-end">

            {/* Pickup City */}
            <div className="col-12 col-sm-6 col-lg-3">
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Pickup City
              </label>
              <div style={{ position: "relative" }}>
                <MdLocationOn size={15} style={{ ...inputIcon, color: "#3b82f6" }} />
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  style={selectStyle(isDark)}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                >
                  <option value="">Select city</option>
                  {SERVICE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="other">Other city...</option>
                </select>
              </div>
            </div>

            {/* Drop City */}
            <div className="col-12 col-sm-6 col-lg-3">
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Drop City
              </label>
              <div style={{ position: "relative" }}>
                <MdLocationOn size={15} style={{ ...inputIcon, color: "#06b6d4" }} />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={selectStyle(isDark)}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                >
                  <option value="">Select city</option>
                  {SERVICE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="other">Other city...</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div className="col-6 col-lg-2">
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Start Date
              </label>
              <div style={{ position: "relative" }}>
                <MdCalendarToday size={13} style={{ ...inputIcon, color: "var(--text-muted)" }} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ ...selectStyle(isDark), paddingLeft: "32px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="col-6 col-lg-2">
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                End Date
              </label>
              <div style={{ position: "relative" }}>
                <MdCalendarToday size={13} style={{ ...inputIcon, color: "var(--text-muted)" }} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  style={{ ...selectStyle(isDark), paddingLeft: "32px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="col-12 col-lg-2">
              <button
                onClick={handleSearch}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "11px", fontWeight: "700", fontSize: "14px",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "6px",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                }}
              >
                <MdSearch size={18} /> Search
              </button>
            </div>
          </div>

          {/* â”€â”€ Service Not Available Message â”€â”€ */}
          {noService && (
            <div style={{
              marginTop: "16px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "12px",
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <FiAlertCircle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: "1px" }} />
                <div>
                  <p style={{ color: "#f87171", fontWeight: "600", margin: "0 0 6px", fontSize: "14px" }}>
                    Service not available in selected city
                  </p>
                  <p style={{ color: "var(--text-muted)", margin: "0 0 8px", fontSize: "12px" }}>
                    We currently serve the following cities:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {SERVICE_CITIES.map((c) => (
                      <span key={c} style={{
                        background: "rgba(59,130,246,0.1)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        color: "#63b3ed", fontSize: "11px", fontWeight: "600",
                        padding: "3px 10px", borderRadius: "20px",
                        cursor: "pointer",
                      }}
                        onClick={() => { setFrom(c); setNoService(false); }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* â•â• STATS â•â• */}
      <div className="container" style={{ padding: "36px 0 40px" }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "36px" }}>
          {[
            { value: "500+", label: "Vehicles" },
            { value: "10K+", label: "Happy Trips" },
            { value: "4.8★", label: "Avg Rating" },
            { value: "24/7", label: "Support" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center", minWidth: "70px" }}>
              <div style={{
                fontSize: "22px", fontWeight: "800",
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{value}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* â•â• VEHICLE SECTIONS â•â• */}
      <div className="container" style={{ paddingBottom: "60px" }}>
        <Section icon="🚗" label="Cars"     data={cars}      loading={loading} navigate={navigate} />
        <Section icon="🚐" label="Mini Bus" data={minibuses} loading={loading} navigate={navigate} />
        <Section icon="🚌" label="Bus"      data={buses}     loading={loading} navigate={navigate} />
      </div>

      {/* â•â• WHY CHOOSE US â•â• */}
      <div style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-color)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontWeight: "800", color: "var(--text-primary)", fontSize: "clamp(22px, 4vw, 32px)" }}>
              Why Choose ANT Travels?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "8px" }}>
              Trusted by thousands across India
            </p>
          </div>
          <div className="row g-3">
            <Feature icon={<FiShield size={20} />}   title="Safe & Verified"  desc="All drivers verified, vehicles inspected regularly" />
            <Feature icon={<FiStar size={20} />}     title="Best Prices"      desc="Transparent pricing, no hidden charges" />
            <Feature icon={<FiClock size={20} />}    title="Always On Time"   desc="Punctual pickups, zero delays guaranteed" />
            <Feature icon={<FiThumbsUp size={20} />} title="Easy Booking"     desc="Book in seconds, pay securely via Razorpay" />
          </div>
        </div>
      </div>

      {/* â•â• FOOTER CTA â•â• */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
        padding: "60px 20px", textAlign: "center",
      }}>
        <h2 style={{ color: "#fff", fontWeight: "800", fontSize: "clamp(20px, 4vw, 30px)", marginBottom: "12px" }}>
          Ready to Hit the Road?
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "28px" }}>
          Book your ride now and travel with confidence
        </p>
        <button
          onClick={() => navigate("/vehicles")}
          style={{
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            color: "#fff", border: "none", borderRadius: "12px",
            padding: "14px 40px", fontWeight: "700", fontSize: "15px",
            cursor: "pointer", boxShadow: "0 8px 28px rgba(59,130,246,0.4)",
          }}
        >
          Browse All Vehicles
        </button>
      </div>

    </div>
  );
};

export default Home;

