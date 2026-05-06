import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { FiUser, FiPhone, FiMapPin, FiCheck, FiEdit2 } from "react-icons/fi";

const API = import.meta.env.VITE_API || "http://localhost:5000/api";

const inputStyle = {
  background: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  color: "var(--text-primary)",
  borderRadius: "10px",
  padding: "11px 14px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
  fontFamily: "Poppins, sans-serif",
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser]     = useState(null);
  const [form, setForm]     = useState({ phone: "", address: "" });
  const [saved, setSaved]   = useState({ phone: "", address: "" });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editing, setEditing]   = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { navigate("/login"); return; }
      setUser(u);
      try {
        const { data } = await axios.get(`${API}/users/${u.uid}`);
        const p = { phone: data.phone || "", address: data.address || "" };
        setForm(p);
        setSaved(p);
        setEditing(!(data.phone && data.address));
      } catch {
        setEditing(true);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const isComplete = saved.phone && saved.address;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.phone.trim() || !form.address.trim()) {
      toast.error("Phone and address are required");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API}/users/save`, {
        uid:     user.uid,
        name:    user.displayName || "",
        email:   user.email       || "",
        photo:   user.photoURL    || "",
        phone:   form.phone.trim(),
        address: form.address.trim(),
      });
      setSaved({ phone: form.phone.trim(), address: form.address.trim() });
      setEditing(false);
      toast.success("Profile saved! You can now book vehicles.");
    } catch {
      toast.error("Failed to save profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 0" }}>
      <div className="container" style={{ maxWidth: "700px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>My Profile</h2>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0" }}>
            Complete your profile to unlock vehicle bookings
          </p>
        </div>

        {/* Profile Status Banner */}
        <div style={{
          background: isComplete ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
          border: `1px solid ${isComplete ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
            background: isComplete ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {isComplete
              ? <FiCheck size={18} color="#10b981" />
              : <FiUser size={18} color="#f59e0b" />}
          </div>
          <div>
            <div style={{ fontWeight: "700", color: isComplete ? "#10b981" : "#f59e0b", fontSize: "14px" }}>
              {isComplete ? "Profile Complete — Ready to Book!" : "Profile Incomplete"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {isComplete
                ? "You can now browse and book vehicles."
                : "Add your phone number and address to start booking."}
            </div>
          </div>
          {isComplete && !editing && (
            <button
              onClick={() => setEditing(true)}
              style={{
                marginLeft: "auto", background: "transparent",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)", borderRadius: "8px",
                padding: "6px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: "600", flexShrink: 0,
              }}
            >
              <FiEdit2 size={12} /> Edit
            </button>
          )}
        </div>

        <div className="row g-4">

          {/* ── Left: Firebase Info (read-only) ── */}
          <div className="col-md-5">
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "20px", padding: "24px", boxShadow: "var(--shadow)",
              textAlign: "center",
            }}>
              <img
                src={user?.photoURL || "https://placehold.co/96"}
                style={{ width: "96px", height: "96px", borderRadius: "50%", border: "3px solid #3b82f6", objectFit: "cover" }}
                alt="avatar"
              />
              <h5 style={{ fontWeight: "800", color: "var(--text-primary)", margin: "14px 0 4px" }}>
                {user?.displayName || "User"}
              </h5>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>{user?.email}</p>

              <div style={{ height: "1px", background: "var(--border-color)", margin: "16px 0" }} />

              {/* Saved info display */}
              {saved.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", textAlign: "left" }}>
                  <FiPhone size={14} color="#3b82f6" />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600" }}>{saved.phone}</span>
                </div>
              )}
              {saved.address && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", textAlign: "left" }}>
                  <FiMapPin size={14} color="#3b82f6" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600", lineHeight: "1.4" }}>{saved.address}</span>
                </div>
              )}

              {!saved.phone && !saved.address && (
                <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  Fill the form to add your details
                </p>
              )}
            </div>
          </div>

          {/* ── Right: Edit Form ── */}
          <div className="col-md-7">
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "20px", padding: "24px", boxShadow: "var(--shadow)",
            }}>
              <h6 style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "20px" }}>
                {editing ? "Edit Details" : "Contact Details"}
              </h6>

              {!editing ? (
                /* Read-only view */
                <div>
                  {[
                    { icon: <FiPhone size={15} color="#3b82f6" />, label: "Phone Number", value: saved.phone },
                    { icon: <FiMapPin size={15} color="#3b82f6" />, label: "Address", value: saved.address },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{
                      display: "flex", gap: "12px", alignItems: "flex-start",
                      padding: "14px 0", borderBottom: "1px solid var(--border-color)",
                    }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                        background: "rgba(59,130,246,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{icon}</div>
                      <div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                        <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "600", marginTop: "2px" }}>{value}</div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => navigate("/vehicles")}
                    style={{
                      width: "100%", marginTop: "20px",
                      background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                      color: "#fff", border: "none", borderRadius: "12px",
                      padding: "13px", fontWeight: "700", fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    Browse Vehicles →
                  </button>
                </div>
              ) : (
                /* Edit form */
                <form onSubmit={handleSave}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Phone Number *
                    </label>
                    <div style={{ position: "relative" }}>
                      <FiPhone size={14} color="#3b82f6" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        style={{ ...inputStyle, paddingLeft: "36px" }}
                        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Full Address *
                    </label>
                    <div style={{ position: "relative" }}>
                      <FiMapPin size={14} color="#3b82f6" style={{ position: "absolute", left: "12px", top: "14px" }} />
                      <textarea
                        rows={3}
                        placeholder="House No, Street, City, State, PIN"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        required
                        style={{ ...inputStyle, paddingLeft: "36px", resize: "vertical" }}
                        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {isComplete && (
                      <button
                        type="button"
                        onClick={() => { setForm(saved); setEditing(false); }}
                        style={{
                          flex: 1, background: "var(--bg-primary)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-muted)", borderRadius: "12px",
                          padding: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        flex: 2,
                        background: saving ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
                        color: "#fff", border: "none", borderRadius: "12px",
                        padding: "12px", fontWeight: "700", fontSize: "14px",
                        cursor: saving ? "not-allowed" : "pointer",
                      }}
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
