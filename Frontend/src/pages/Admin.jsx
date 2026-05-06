import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCreditCard, FiPercent, FiPlus, FiList, FiUsers, FiPhone, FiMapPin, FiCheck, FiAlertCircle, FiEdit2, FiTrash2, FiX, FiSave } from "react-icons/fi";
import { MdDirectionsCar } from "react-icons/md";

const API = import.meta.env.VITE_API || "http://localhost:5000/api";

const inputStyle = {
  background: "var(--bg-primary)",
  border: "1px solid var(--border-color)",
  color: "var(--text-primary)",
  borderRadius: "10px",
  padding: "10px 14px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
};

const labelStyle = {
  color: "var(--text-muted)",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "6px",
  display: "block",
};

const statusColor = (s) =>
  s === "confirmed" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444";

const Th = ({ children }) => (
  <th style={{
    padding: "10px 14px", textAlign: "left",
    color: "var(--text-muted)", fontWeight: "600", fontSize: "11px",
    textTransform: "uppercase", letterSpacing: "0.5px",
    borderBottom: "2px solid var(--border-color)", whiteSpace: "nowrap",
  }}>
    {children}
  </th>
);

/* ─── All Bookings Tab ─── */
const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [userMap, setUserMap]   = useState({});
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/bookings/all`),
      axios.get(`${API}/users/all`),
    ]).then(([bRes, uRes]) => {
      const bList = Array.isArray(bRes.data) ? bRes.data : [];
      const uList = Array.isArray(uRes.data) ? uRes.data : [];
      setBookings(bList);
      // uid → profile map
      const map = {};
      uList.forEach((u) => { map[u.uid] = u; });
      setUserMap(map);
    }).catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? bookings
    : bookings.filter((b) => b.paymentType === filter);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.advanceAmount || 0), 0);

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Bookings",   value: bookings.length,                                              color: "#3b82f6" },
          { label: "Revenue Collected",value: `₹${totalRevenue.toLocaleString()}`,                         color: "#10b981" },
          { label: "Advance Bookings", value: bookings.filter(b => b.paymentType === "advance").length,     color: "#f59e0b" },
          { label: "Full Payments",    value: bookings.filter(b => b.paymentType === "full").length,        color: "#8b5cf6" },
          { label: "Pay Later",        value: bookings.filter(b => b.paymentType === "later").length,       color: "#06b6d4" },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-6 col-md">
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "14px", padding: "16px", boxShadow: "var(--shadow)",
            }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[
          { key: "all",     label: "All" },
          { key: "advance", label: "5% Advance" },
          { key: "full",    label: "Full Payment" },
          { key: "later",   label: "Pay Later" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            background: filter === f.key ? "#3b82f6" : "var(--bg-card)",
            color: filter === f.key ? "#fff" : "var(--text-primary)",
            border: `1px solid ${filter === f.key ? "#3b82f6" : "var(--border-color)"}`,
            padding: "6px 16px", borderRadius: "20px",
            fontWeight: "600", fontSize: "13px", cursor: "pointer",
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "48px" }}>📋</div>
          <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>No bookings found</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--bg-primary)" }}>
                <Th>User</Th>
                <Th>Contact</Th>
                <Th>Address</Th>
                <Th>Vehicle</Th>
                <Th>Route</Th>
                <Th>Dates</Th>
                <Th>Payment</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const u = userMap[b.userId] || {};
                return (
                  <tr key={b._id} style={{ borderBottom: "1px solid var(--border-color)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* User name + email */}
                    <td style={{ padding: "12px 14px", minWidth: "130px" }}>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                        {b.userName || "Guest"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {b.userEmail}
                      </div>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: "12px 14px", minWidth: "120px" }}>
                      {u.phone ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <FiPhone size={11} color="#3b82f6" />
                          <span style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "12px" }}>
                            {u.phone}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>—</span>
                      )}
                    </td>

                    {/* Address */}
                    <td style={{ padding: "12px 14px", minWidth: "160px", maxWidth: "200px" }}>
                      {u.address ? (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "5px" }}>
                          <FiMapPin size={11} color="#06b6d4" style={{ marginTop: "2px", flexShrink: 0 }} />
                          <span style={{ color: "var(--text-primary)", fontSize: "12px", lineHeight: "1.4" }}>
                            {u.address}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>—</span>
                      )}
                    </td>

                    {/* Vehicle */}
                    <td style={{ padding: "12px 14px", minWidth: "110px" }}>
                      <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{b.vehicleName}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "capitalize" }}>{b.vehicleType}</div>
                    </td>

                    {/* Route */}
                    <td style={{ padding: "12px 14px", minWidth: "130px" }}>
                      <div style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                        {b.from} → {b.to}
                      </div>
                    </td>

                    {/* Dates */}
                    <td style={{ padding: "12px 14px", color: "var(--text-muted)", minWidth: "100px" }}>
                      <div>{b.startDate}</div>
                      {b.endDate && <div>{b.endDate}</div>}
                    </td>

                    {/* Payment type */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        color: b.paymentType === "advance" ? "#f59e0b"
                          : b.paymentType === "later" ? "#06b6d4" : "#10b981",
                      }}>
                        {b.paymentType === "advance" ? <FiPercent size={12} /> : <FiCreditCard size={12} />}
                        {b.paymentType === "advance" ? "5% Advance"
                          : b.paymentType === "later" ? "Pay Later" : "Full"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: "12px 14px", minWidth: "100px" }}>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                        ₹{(b.advanceAmount || 0).toLocaleString()}
                      </div>
                      {b.paymentType === "advance" && (
                        <div style={{ fontSize: "11px", color: "#f59e0b" }}>
                          Due: ₹{((b.totalAmount || 0) - (b.advanceAmount || 0)).toLocaleString()}
                        </div>
                      )}
                      {b.paymentType === "later" && (
                        <div style={{ fontSize: "11px", color: "#06b6d4" }}>
                          Total: ₹{(b.totalAmount || 0).toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        background: statusColor(b.status) + "20",
                        color: statusColor(b.status),
                        padding: "3px 10px", borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap",
                      }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ─── All Users Tab ─── */
const AllUsers = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/users/all`)
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const complete = users.filter(u => u.phone && u.address).length;

  return (
    <div>
      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Users",        value: users.length,                      color: "#3b82f6" },
          { label: "Profile Complete",   value: complete,                           color: "#10b981" },
          { label: "Profile Incomplete", value: users.length - complete,            color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="col-6 col-md-4">
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: "14px", padding: "16px", boxShadow: "var(--shadow)",
            }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color }}>{value}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "48px" }}>👤</div>
          <p style={{ color: "var(--text-muted)", marginTop: "12px" }}>No users found</p>
        </div>
      ) : (
        <div className="row g-3">
          {users.map((u) => {
            const isComplete = !!(u.phone && u.address);
            return (
              <div key={u._id} className="col-12 col-md-6 col-lg-4">
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-color)",
                  borderRadius: "16px", padding: "18px", boxShadow: "var(--shadow)",
                }}>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <img
                      src={u.photo || "https://placehold.co/44"}
                      style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-color)" }}
                      alt="avatar"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.name || "—"}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.email}
                      </div>
                    </div>
                    <span style={{
                      flexShrink: 0,
                      background: isComplete ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                      color: isComplete ? "#10b981" : "#f59e0b",
                      fontSize: "10px", fontWeight: "700",
                      padding: "3px 8px", borderRadius: "20px",
                      display: "flex", alignItems: "center", gap: "3px",
                    }}>
                      {isComplete ? <FiCheck size={9} /> : <FiAlertCircle size={9} />}
                      {isComplete ? "Complete" : "Incomplete"}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FiPhone size={13} color="#3b82f6" />
                      <span style={{ fontSize: "13px", color: u.phone ? "var(--text-primary)" : "var(--text-muted)", fontWeight: u.phone ? "600" : "400", fontStyle: u.phone ? "normal" : "italic" }}>
                        {u.phone || "Not added"}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <FiMapPin size={13} color="#06b6d4" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: u.address ? "var(--text-primary)" : "var(--text-muted)", fontWeight: u.address ? "600" : "400", fontStyle: u.address ? "normal" : "italic", lineHeight: "1.4" }}>
                        {u.address || "Not added"}
                      </span>
                    </div>
                  </div>

                  {/* Joined date */}
                  <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border-color)", fontSize: "11px", color: "var(--text-muted)" }}>
                    Joined: {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Vehicle Form (shared by Add & Edit) ─── */
const EMPTY = { name: "", type: "car", pricePerKm: "", image: "", ac: true, seats: "", description: "" };

const VehicleForm = ({ initial = EMPTY, onSave, onCancel, saving, isEdit }) => {
  const [data, setData] = useState(initial);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const handleSubmit = (e) => { e.preventDefault(); onSave(data); };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label style={labelStyle}>Vehicle Name *</label>
          <input value={data.name} onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Swift Dzire" required style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
        </div>

        {/* Type */}
        <div className="col-md-6">
          <label style={labelStyle}>Type *</label>
          <select value={data.type} onChange={(e) => set("type", e.target.value)} required
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          >
            <option value="car">Car</option>
            <option value="minibus">Mini Bus</option>
            <option value="bus">Bus</option>
          </select>
        </div>

        {/* Price */}
        <div className="col-md-4">
          <label style={labelStyle}>Price (₹/km) *</label>
          <input type="number" value={data.pricePerKm} onChange={(e) => set("pricePerKm", e.target.value)}
            placeholder="12" required style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
        </div>

        {/* Seats */}
        <div className="col-md-4">
          <label style={labelStyle}>Seats</label>
          <input type="number" value={data.seats} onChange={(e) => set("seats", e.target.value)}
            placeholder="4" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
        </div>

        {/* AC Toggle */}
        <div className="col-md-4">
          <label style={labelStyle}>AC / Non-AC</label>
          <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
            {[true, false].map((val) => (
              <button key={String(val)} type="button"
                onClick={() => set("ac", val)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: "10px",
                  border: `2px solid ${data.ac === val ? "#3b82f6" : "var(--border-color)"}`,
                  background: data.ac === val ? "rgba(59,130,246,0.1)" : "var(--bg-primary)",
                  color: data.ac === val ? "#3b82f6" : "var(--text-muted)",
                  fontWeight: "700", fontSize: "13px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {val ? "❄️ AC" : "🌀 Non-AC"}
              </button>
            ))}
          </div>
        </div>

        {/* Image URL */}
        <div className="col-12">
          <label style={labelStyle}>Image URL</label>
          <input value={data.image} onChange={(e) => set("image", e.target.value)}
            placeholder="https://example.com/vehicle.jpg" style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
        </div>

        {/* Description */}
        <div className="col-12">
          <label style={labelStyle}>Description</label>
          <textarea rows={3} value={data.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. Comfortable AC sedan with luggage space. Ideal for 4 passengers. Professional driver included."
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{
            flex: 1, background: "var(--bg-primary)", border: "1px solid var(--border-color)",
            color: "var(--text-muted)", borderRadius: "12px", padding: "12px",
            fontWeight: "600", fontSize: "14px", cursor: "pointer",
          }}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} style={{
          flex: 2,
          background: saving ? "#94a3b8" : isEdit
            ? "linear-gradient(135deg,#10b981,#059669)"
            : "linear-gradient(135deg,#3b82f6,#06b6d4)",
          color: "#fff", border: "none", borderRadius: "12px",
          padding: "12px", fontWeight: "700", fontSize: "15px",
          cursor: saving ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          {saving ? "Saving..." : isEdit ? <><FiSave size={15} /> Update Vehicle</> : <><FiPlus size={15} /> Add Vehicle</>}
        </button>
      </div>
    </form>
  );
};

/* ─── Manage Vehicles Tab ─── */
const ManageVehicles = () => {
  const [vehicles, setVehicles]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [editingId, setEditingId] = useState(null);  // null = add form, id = edit form
  const [showAdd, setShowAdd]     = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadVehicles = () => {
    setLoading(true);
    axios.get(`${API}/vehicles`)
      .then((res) => setVehicles(res.data?.data || []))
      .catch(() => toast.error("Failed to load vehicles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadVehicles(); }, []);

  const handleAdd = async (data) => {
    setSaving(true);
    try {
      const res = await axios.post(`${API}/vehicles/add-vehicle`, data);
      if (!res.data.success) throw new Error();
      toast.success("Vehicle added!");
      setShowAdd(false);
      loadVehicles();
    } catch { toast.error("Failed to add vehicle."); }
    finally { setSaving(false); }
  };

  const handleEdit = async (data) => {
    setSaving(true);
    try {
      await axios.put(`${API}/vehicles/${editingId}`, data);
      toast.success("Vehicle updated!");
      setEditingId(null);
      loadVehicles();
    } catch { toast.error("Failed to update vehicle."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/vehicles/${id}`);
      toast.success("Vehicle deleted!");
      setDeleteConfirm(null);
      loadVehicles();
    } catch { toast.error("Failed to delete vehicle."); }
  };

  const typeIcon = (t) => t === "car" ? "🚗" : t === "minibus" ? "🚐" : "🚌";

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h5 style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)" }}>
            Fleet Management
          </h5>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} in fleet
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); }}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
            color: "#fff", border: "none", borderRadius: "10px",
            padding: "10px 20px", fontWeight: "700", fontSize: "14px", cursor: "pointer",
          }}
        >
          <FiPlus size={15} /> Add Vehicle
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{
          background: "var(--bg-card)", border: "2px solid rgba(59,130,246,0.3)",
          borderRadius: "20px", padding: "24px", marginBottom: "24px", boxShadow: "var(--shadow)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h6 style={{ margin: 0, fontWeight: "700", color: "var(--text-primary)" }}>Add New Vehicle</h6>
            <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <FiX size={18} />
            </button>
          </div>
          <VehicleForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} isEdit={false} />
        </div>
      )}

      {/* Vehicle cards grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading...</div>
      ) : (
        <div className="row g-3">
          {vehicles.map((v) => (
            <div key={v._id} className="col-12 col-lg-6">
              {editingId === v._id ? (
                /* ── Inline Edit Form ── */
                <div style={{
                  background: "var(--bg-card)", border: "2px solid rgba(16,185,129,0.35)",
                  borderRadius: "20px", padding: "22px", boxShadow: "var(--shadow)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <h6 style={{ margin: 0, fontWeight: "700", color: "#10b981" }}>Editing: {v.name}</h6>
                    <button onClick={() => setEditingId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      <FiX size={18} />
                    </button>
                  </div>
                  <VehicleForm
                    initial={{ name: v.name, type: v.type, pricePerKm: v.pricePerKm, image: v.image || "", ac: v.ac !== false, seats: v.seats || "", description: v.description || "" }}
                    onSave={handleEdit}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                    isEdit={true}
                  />
                </div>
              ) : (
                /* ── Vehicle Card ── */
                <div style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-color)",
                  borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow)",
                  display: "flex",
                }}>
                  {/* Image */}
                  <div style={{ width: "110px", flexShrink: 0 }}>
                    {v.image ? (
                      <img src={v.image} style={{ width: "110px", height: "100%", objectFit: "cover", minHeight: "120px" }} alt={v.name} />
                    ) : (
                      <div style={{ width: "110px", minHeight: "120px", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
                        {typeIcon(v.type)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, padding: "14px 16px", minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "15px" }}>{v.name}</div>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                          <span style={{ background: "#3b82f620", color: "#3b82f6", fontSize: "11px", fontWeight: "600", padding: "1px 8px", borderRadius: "20px", textTransform: "capitalize" }}>
                            {typeIcon(v.type)} {v.type}
                          </span>
                          <span style={{ background: v.ac !== false ? "rgba(6,182,212,0.1)" : "rgba(100,116,139,0.1)", color: v.ac !== false ? "#06b6d4" : "#64748b", fontSize: "11px", fontWeight: "600", padding: "1px 8px", borderRadius: "20px" }}>
                            {v.ac !== false ? "❄️ AC" : "🌀 Non-AC"}
                          </span>
                          {v.seats > 0 && (
                            <span style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6", fontSize: "11px", fontWeight: "600", padding: "1px 8px", borderRadius: "20px" }}>
                              {v.seats} Seats
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ fontWeight: "800", color: "#3b82f6", fontSize: "16px", flexShrink: 0 }}>
                        ₹{v.pricePerKm}/km
                      </div>
                    </div>

                    {v.description && (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px", marginBottom: "0", lineHeight: "1.5",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {v.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button
                        onClick={() => { setEditingId(v._id); setShowAdd(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          background: "rgba(59,130,246,0.1)", color: "#3b82f6",
                          border: "1px solid rgba(59,130,246,0.25)", borderRadius: "8px",
                          padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                        }}
                      >
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(v._id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "5px",
                          background: "rgba(239,68,68,0.08)", color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px",
                          padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
                        }}
                      >
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete confirmation */}
              {deleteConfirm === v._id && (
                <div style={{
                  marginTop: "8px", background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px",
                  padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                }}>
                  <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "600" }}>
                    Delete "{v.name}"?
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setDeleteConfirm(null)} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-muted)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button onClick={() => handleDelete(v._id)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══ Main Admin ══ */
const Admin = () => {
  const [tab, setTab] = useState("bookings");

  const tabs = [
    { key: "bookings",  label: "All Bookings",  icon: <FiList size={15} /> },
    { key: "users",     label: "All Users",      icon: <FiUsers size={15} /> },
    { key: "vehicles",  label: "Manage Vehicles",icon: <MdDirectionsCar size={16} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h3 className="fw-bold" style={{ color: "var(--text-primary)", margin: 0 }}>Admin Dashboard</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Manage vehicles, view bookings and user profiles</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: tab === t.key ? "#3b82f6" : "var(--bg-card)",
                color: tab === t.key ? "#fff" : "var(--text-primary)",
                border: `1px solid ${tab === t.key ? "#3b82f6" : "var(--border-color)"}`,
                padding: "9px 20px", borderRadius: "10px",
                fontWeight: "600", fontSize: "14px", cursor: "pointer",
                boxShadow: tab === t.key ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "bookings"  && <AllBookings />}
        {tab === "users"     && <AllUsers />}
        {tab === "vehicles"  && <ManageVehicles />}
      </div>
    </div>
  );
};

export default Admin;
