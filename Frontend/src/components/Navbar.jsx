import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/vehicles", label: "Vehicles" },
  { path: "/dashboard", label: "My Bookings" },
  { path: "/profile", label: "Profile" },
  { path: "/admin", label: "Admin" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "68px",
        display: "flex",
        alignItems: "center",
        background: scrolled
          ? "rgba(6, 8, 20, 0.97)"
          : "rgba(6, 8, 20, 0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(99, 179, 237, 0.2)"
          : "1px solid rgba(99, 179, 237, 0.08)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(59,130,246,0.45)",
            }}>
              <MdDirectionsCar size={22} color="#fff" />
            </div>
            <div>
              <div style={{
                fontSize: "17px",
                fontWeight: "800",
                color: "#fff",
                letterSpacing: "0.5px",
                lineHeight: 1.1,
              }}>
                ANT Travels
              </div>
              <div style={{
                fontSize: "10px",
                color: "#63b3ed",
                letterSpacing: "1.5px",
                fontWeight: "500",
                textTransform: "uppercase",
              }}>
                Premium Rides
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }} className="d-none d-lg-flex">
            {NAV_LINKS.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    display: "block",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: isActive(item.path) ? "600" : "400",
                    color: isActive(item.path) ? "#fff" : "#94a3b8",
                    background: isActive(item.path) ? "rgba(59,130,246,0.18)" : "transparent",
                    border: isActive(item.path) ? "1px solid rgba(59,130,246,0.35)" : "1px solid transparent",
                    textDecoration: "none",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Light Mode" : "Dark Mode"}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.color = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {/* Auth — Desktop */}
            <div className="d-none d-lg-flex align-items-center" style={{ gap: "10px" }}>
              {!user ? (
                <Link
                  to="/login"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    color: "#fff",
                    borderRadius: "9px",
                    padding: "8px 20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(59,130,246,0.55)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.35)")}
                >
                  Sign In
                </Link>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* User pill — click to go to profile */}
                  <Link to="/profile" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "30px",
                    padding: "4px 12px 4px 4px",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                  >
                    <img
                      src={user.photoURL || "https://placehold.co/32"}
                      style={{
                        width: "28px", height: "28px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                      alt="avatar"
                    />
                    <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "500" }}>
                      {user.displayName?.split(" ")[0]}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                      borderRadius: "9px",
                      padding: "7px 14px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.22)";
                      e.currentTarget.style.color = "#fca5a5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                      e.currentTarget.style.color = "#f87171";
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger — Mobile */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="d-lg-none"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "9px",
                background: menuOpen ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${menuOpen ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.12)"}`,
                color: menuOpen ? "#63b3ed" : "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      <div style={{
        position: "fixed",
        top: "68px",
        left: 0,
        right: 0,
        zIndex: 999,
        background: "rgba(6, 8, 20, 0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,179,237,0.12)",
        padding: menuOpen ? "16px 20px 20px" : "0 20px",
        maxHeight: menuOpen ? "400px" : "0",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: menuOpen ? "0 12px 40px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Nav links */}
        {NAV_LINKS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "4px",
              fontSize: "15px",
              fontWeight: isActive(item.path) ? "600" : "400",
              color: isActive(item.path) ? "#63b3ed" : "#94a3b8",
              background: isActive(item.path) ? "rgba(59,130,246,0.12)" : "transparent",
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            {item.label}
            {isActive(item.path) && (
              <span style={{
                marginLeft: "auto",
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: "#3b82f6",
              }} />
            )}
          </Link>
        ))}

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />

        {/* Auth — Mobile */}
        {!user ? (
          <Link
            to="/login"
            style={{
              display: "block",
              textAlign: "center",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: "700",
              fontSize: "15px",
              textDecoration: "none",
              marginTop: "8px",
            }}
          >
            Sign In
          </Link>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={user.photoURL || "https://placehold.co/36"}
                style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                alt="avatar"
              />
              <div>
                <div style={{ color: "#e2e8f0", fontWeight: "600", fontSize: "14px" }}>
                  {user.displayName}
                </div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                borderRadius: "9px",
                padding: "8px 16px",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
