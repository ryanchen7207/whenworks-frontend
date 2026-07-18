import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSession, joinSession, getResults } from "../api.js";
import AvailabilityGrid from "./AvailabilityGrid.jsx";
import ResultsView from "./ResultsView.jsx";

export default function SessionPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [availability, setAvailability] = useState({});
  const [view, setView] = useState("grid"); // "grid" | "results"
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSession(id)
      .then(setSession)
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSave() {
    if (!name.trim()) return setError("Enter your name first.");
    setSaving(true);
    setError("");
    try {
      await joinSession(id, name.trim(), availability);
      setJoined(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function showResults() {
    setView("results");
    try {
      const r = await getResults(id);
      setResults(r);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !session) return <div className="card error">{error}</div>;
  if (!session) return <div className="card">Loading session…</div>;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div>
      <div className="card">
        <h2>{session.title}</h2>
        <p className="subtitle">Share this link so others can add their availability:</p>
        <div className="share-box">{shareUrl}</div>
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 4 }}>
          <button className={view === "grid" ? "" : "secondary"} onClick={() => setView("grid")}>
            My availability
          </button>
          <button className={view === "results" ? "" : "secondary"} onClick={showResults}>
            See results
          </button>
        </div>

        {view === "grid" && (
          <>
            <label htmlFor="name">Your name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marta" />

            <div style={{ marginTop: 18 }}>
              <AvailabilityGrid slots={session.slots} availability={availability} onChange={setAvailability} />
            </div>

            {error && <div className="error">{error}</div>}
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : joined ? "Update my availability" : "Save my availability"}
            </button>
          </>
        )}

        {view === "results" && <ResultsView results={results} />}
      </div>
    </div>
  );
}
