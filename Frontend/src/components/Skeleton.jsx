export const CardSkeleton = () => (
  <div className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex">
    <div style={{
      borderRadius: "20px",
      overflow: "hidden",
      width: "100%",
      margin: "6px",
      background: "var(--bg-card)",
      boxShadow: "var(--shadow)",
      border: "1px solid var(--border-color)",
    }}>
      <span className="skeleton" style={{ height: "180px", borderRadius: 0 }} />
      <div className="p-3">
        <span className="skeleton mb-2" style={{ height: "16px", width: "65%" }} />
        <span className="skeleton mb-3" style={{ height: "12px", width: "45%" }} />
        <span className="skeleton" style={{ height: "36px", width: "100%" }} />
      </div>
    </div>
  </div>
);

export const BookingSkeleton = () => (
  <div style={{
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "12px",
    boxShadow: "var(--shadow)",
  }}>
    <span className="skeleton mb-2" style={{ height: "16px", width: "55%" }} />
    <span className="skeleton mb-2" style={{ height: "13px", width: "38%" }} />
    <span className="skeleton mb-2" style={{ height: "13px", width: "45%" }} />
    <span className="skeleton" style={{ height: "13px", width: "28%" }} />
  </div>
);
