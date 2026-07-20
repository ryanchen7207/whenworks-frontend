import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getMySessions } from "../api.js";
import TemplatesManager from "../components/TemplatesManager.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySessions()
      .then((r) => setSessions(r.sessions))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section" style={{ paddingTop: 24 }}>
      <div className="container">
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Hey, {user.name.split(" ")[0]}</h1>
        <p className="subtitle">Your sessions and saved commitments.</p>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ marginBottom: 0 }}>Your sessions</h2>
            <Link to="/create" className="btn btn-primary">New session</Link>
          </div>

          <div style={{ marginTop: 16 }}>
            {loading ? (
              <p className="subtitle">Loading…</p>
            ) : sessions.length === 0 ? (
              <div className="empty-state">
                <h3>No sessions yet</h3>
                <p>Create one and share the link to get availability from your group.</p>
              </div>
            ) : (
              sessions.map((s) => (
                <div className="result-item" key={s.id}>
                  <div className="result-time">
                    {s.title}
                    {s.confirmedSlot && <span style={{ color: "#067a5f", marginLeft: 8, fontSize: 12 }}>✓ locked in</span>}
                  </div>
                  <div className="result-meta" style={{ marginRight: 14 }}>
                    {s.participantCount} responded
                  </div>
                  <Link to={`/s/${s.id}`} className="btn btn-ghost">Open</Link>
                </div>
              ))
            )}
          </div>
        </div>

        <TemplatesManager />
      </div>
    </div>
  );
}
