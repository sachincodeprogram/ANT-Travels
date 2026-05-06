import { auth, provider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShield, FiStar, FiZap } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Welcome to ANT Travels!");
      navigate("/");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#060818 0%,#0d1424 50%,#060c20 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)", top: "-15%", left: "-10%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%)", bottom: "-10%", right: "-5%", pointerEvents: "none" }} />

      <div className="fade-up" style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20, margin: "0 auto 16px",
            background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
            animation: "float 3s ease-in-out infinite",
          }}>
            <MdDirectionsCar size={34} color="#fff" />
          </div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 28, letterSpacing: "-0.5px", margin: 0 }}>
            ANT Travels
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Premium vehicle rentals across India</p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(13,20,36,0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(59,130,246,0.18)",
          borderRadius: 24, padding: "36px 32px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}>
          <h2 style={{ color: "#e2e8f8", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
            Sign in to continue
          </h2>
          <p style={{ color: "#475569", fontSize: 13, marginBottom: 28 }}>
            Book vehicles, track journeys, manage your rides.
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              width: "100%", padding: "14px 20px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14, fontWeight: 700, fontSize: 15,
              cursor: "pointer", color: "#e2e8f8",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(59,130,246,0.18)";
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.45)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(59,130,246,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          {/* Trust badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28 }}>
            {[
              { icon: <FiShield size={13} />, label: "Secure Login", color: "#10b981" },
              { icon: <FiStar   size={13} />, label: "Trusted Service", color: "#f59e0b" },
              { icon: <FiZap    size={13} />, label: "Instant Access", color: "#3b82f6" },
            ].map(({ icon, label, color }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
                <span style={{ fontSize: 10, color: "#475569", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: 12, marginTop: 20 }}>
          By signing in you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
