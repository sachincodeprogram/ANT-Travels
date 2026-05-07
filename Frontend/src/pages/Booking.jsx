import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../firebase/config";
import { MdLocationOn, MdCalendarToday, MdDirectionsCar } from "react-icons/md";
import { FiCreditCard, FiPercent, FiCheck, FiCalendar } from "react-icons/fi";

const API      = import.meta.env.VITE_API         || "https://ant-travels-4c1n.onrender.com/api";
const RZP_KEY  = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SlAYzNNJzlvLCY";
const EST_KM   = 100; // estimated km for price calculation

const Booking = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const vehicle    = state?.vehicle;
  const journey    = state?.journey;
  const [paying, setPaying] = useState(false);

  if (!vehicle || !journey) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-primary)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
      }}>
        <div style={{ fontSize: "56px" }}>âš ï¸</div>
        <h3 style={{ color: "var(--text-primary)" }}>No booking data found</h3>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#3b82f6", color: "#fff", border: "none",
            borderRadius: "10px", padding: "10px 24px",
            fontWeight: "600", cursor: "pointer",
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  const totalAmount   = vehicle.pricePerKm * EST_KM;
  const advanceAmount = Math.ceil(totalAmount * 0.05);

  const user = auth.currentUser;

  const confirmWithoutPayment = async () => {
    setPaying(true);
    try {
      await axios.post(`${API}/bookings/save`, {
        userId:       user?.uid        || "guest",
        userName:     user?.displayName || "Guest",
        userEmail:    user?.email       || "",
        vehicleId:    vehicle._id,
        vehicleName:  vehicle.name,
        vehicleType:  vehicle.type,
        vehicleImage: vehicle.image,
        pricePerKm:   vehicle.pricePerKm,
        from:         journey.from,
        to:           journey.to,
        startDate:    journey.startDate,
        endDate:      journey.endDate || "",
        totalAmount,
        advanceAmount: 0,
        paymentType:  "later",
        paymentId:    "",
        status:       "pending",
      });
      toast.success("Booking confirmed! Pay on arrival ðŸš—");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to confirm booking. Try again.");
    } finally {
      setPaying(false);
    }
  };

  const pay = async (type) => {
    const amountToPay = type === "advance" ? advanceAmount : totalAmount;
    setPaying(true);
    try {
      const { data: order } = await axios.post(`${API}/payment/create-order`, {
        amount: amountToPay,
      });

      const options = {
        key:         RZP_KEY,
        amount:      order.amount,
        currency:    "INR",
        name:        "ANT Travels",
        description: `${vehicle.name} â€” ${type === "advance" ? "5% Advance" : "Full Payment"}`,
        order_id:    order.id,
        prefill: {
          name:  user?.displayName || "",
          email: user?.email       || "",
        },
        theme: { color: "#3b82f6" },

        handler: async (response) => {
          try {
            await axios.post(`${API}/bookings/save`, {
              userId:        user?.uid        || "guest",
              userName:      user?.displayName || "Guest",
              userEmail:     user?.email       || "",
              vehicleId:     vehicle._id,
              vehicleName:   vehicle.name,
              vehicleType:   vehicle.type,
              vehicleImage:  vehicle.image,
              pricePerKm:    vehicle.pricePerKm,
              from:          journey.from,
              to:            journey.to,
              startDate:     journey.startDate,
              endDate:       journey.endDate  || "",
              totalAmount,
              advanceAmount: type === "advance" ? advanceAmount : totalAmount,
              paymentType:   type,
              paymentId:     response.razorpay_payment_id,
              status:        "confirmed",
            });
            toast.success("Booking confirmed! ðŸŽ‰");
            navigate("/dashboard");
          } catch {
            toast.error("Payment done but booking save failed. Contact support.");
          }
        },

        modal: { ondismiss: () => setPaying(false) },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Could not initiate payment. Try again.");
      setPaying(false);
    }
  };

  const row = (label, value) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid var(--border-color)",
    }}>
      <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>{label}</span>
      <span style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "14px" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 0" }}>
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent", border: "1px solid var(--border-color)",
              color: "var(--text-muted)", borderRadius: "8px",
              padding: "6px 14px", cursor: "pointer", fontSize: "13px", marginBottom: "16px",
            }}
          >
            â† Back
          </button>
          <h2 style={{ fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>Confirm Booking</h2>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0" }}>Review details and choose payment</p>
        </div>

        <div className="row g-4">

          {/* â”€â”€ Left: Details â”€â”€ */}
          <div className="col-lg-7">

            {/* Vehicle Card */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "18px", overflow: "hidden", boxShadow: "var(--shadow)",
              marginBottom: "20px",
            }}>
              <img
                src={vehicle.image || "https://placehold.co/800x300/1e293b/94a3b8?text=Vehicle"}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                alt={vehicle.name}
              />
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <MdDirectionsCar size={20} color="#3b82f6" />
                  <h4 style={{ margin: 0, fontWeight: "800", color: "var(--text-primary)" }}>
                    {vehicle.name}
                  </h4>
                  <span style={{
                    background: "#3b82f620", color: "#3b82f6",
                    fontSize: "11px", fontWeight: "600",
                    padding: "2px 10px", borderRadius: "20px",
                    textTransform: "capitalize",
                  }}>
                    {vehicle.type}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "13px" }}>
                  AC â€¢ Comfortable â€¢ Professional Driver
                </p>
              </div>
            </div>

            {/* Journey Details */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "18px", padding: "20px", boxShadow: "var(--shadow)",
            }}>
              <h6 style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
                Journey Details
              </h6>

              <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                <div style={{
                  flex: 1, minWidth: "140px",
                  background: "rgba(59,130,246,0.07)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <MdLocationOn size={14} color="#3b82f6" />
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Pickup</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)", fontSize: "15px" }}>{journey.from}</p>
                </div>
                <div style={{
                  flex: 1, minWidth: "140px",
                  background: "rgba(6,182,212,0.07)",
                  border: "1px solid rgba(6,182,212,0.18)",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <MdLocationOn size={14} color="#06b6d4" />
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Drop</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)", fontSize: "15px" }}>{journey.to}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <MdCalendarToday size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Start:</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>{journey.startDate}</span>
                </div>
                {journey.endDate && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <MdCalendarToday size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>End:</span>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>{journey.endDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* â”€â”€ Right: Price + Payment â”€â”€ */}
          <div className="col-lg-5">
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "18px", padding: "22px", boxShadow: "var(--shadow)",
              position: "sticky", top: "88px",
            }}>
              <h6 style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "16px" }}>
                Price Breakdown
              </h6>

              {row("Rate", `â‚¹${vehicle.pricePerKm}/km`)}
              {row("Est. Distance", `~${EST_KM} km`)}
              {row("Est. Total", `â‚¹${totalAmount.toLocaleString()}`)}
              {row("5% Advance", `â‚¹${advanceAmount.toLocaleString()}`)}

              <p style={{
                fontSize: "11px", color: "var(--text-muted)", margin: "12px 0 20px",
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "8px", padding: "8px 10px",
              }}>
                âš ï¸ Final price will be calculated based on actual distance travelled.
              </p>

              {/* Payment Options */}
              <h6 style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "12px" }}>
                Choose Payment
              </h6>

              {/* 5% Advance */}
              <button
                onClick={() => pay("advance")}
                disabled={paying}
                style={{
                  width: "100%", marginBottom: "10px",
                  background: paying ? "var(--border-color)" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  color: "#fff", border: "none", borderRadius: "12px",
                  padding: "14px 16px", cursor: paying ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  transition: "opacity 0.2s",
                }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FiPercent size={18} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>
                    Pay 5% Advance â€” â‚¹{advanceAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.85 }}>
                    Rest â‚¹{(totalAmount - advanceAmount).toLocaleString()} on arrival
                  </div>
                </div>
              </button>

              {/* Full Payment */}
              <button
                onClick={() => pay("full")}
                disabled={paying}
                style={{
                  width: "100%",
                  background: paying ? "var(--border-color)" : "var(--bg-primary)",
                  color: "var(--text-primary)",
                  border: "2px solid var(--border-color)",
                  borderRadius: "12px", padding: "14px 16px",
                  cursor: paying ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => { if (!paying) e.currentTarget.style.borderColor = "#3b82f6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(59,130,246,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  color: "#3b82f6",
                }}>
                  <FiCreditCard size={18} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>
                    Full Payment â€” â‚¹{totalAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Pay complete amount now
                  </div>
                </div>
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "14px 0" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
              </div>

              {/* Confirm Without Payment */}
              <button
                onClick={confirmWithoutPayment}
                disabled={paying}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: paying ? "var(--text-muted)" : "#10b981",
                  border: `2px dashed ${paying ? "var(--border-color)" : "#10b981"}`,
                  borderRadius: "12px", padding: "14px 16px",
                  cursor: paying ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (!paying) e.currentTarget.style.background = "rgba(16,185,129,0.07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(16,185,129,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  color: "#10b981",
                }}>
                  <FiCalendar size={18} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>
                    Confirm Now, Pay Later
                  </div>
                  <div style={{ fontSize: "11px", opacity: 0.8 }}>
                    No payment needed â€” pay full amount on arrival
                  </div>
                </div>
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
                {["Secure Pay", "Razorpay", "Free Cancel"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <FiCheck size={11} color="#10b981" />
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t}</span>
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

export default Booking;

