import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSession, joinSession, getResults, importIcs, getGoogleBusy, getTemplates, getTemplateBusy } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import AvailabilityGrid from "./AvailabilityGrid.jsx";
import ResultsView from "./ResultsView.jsx";

export default function SessionPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [availability, setAvailability] = useState({});
  const [busyFromCalendar, setBusyFromCalendar] = useState(new Set());
  const [view, setView] = useState("grid");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getSession(id).then(setSession).catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (user) getTemplates().then((r) => setTemplates(r.templates)).catch(() => {});
  }, [user]);

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
      setResults(await getResults(id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleIcsUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError("");
    try {
      const text = await file.text();
      const { busySlotIds } = await importIcs(id, text);
      setBusyFromCalendar(new Set(busySlotIds));
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  }

  async function handleGoogleSync() {
    setImporting(true);
    setError("");
    try {
      const { busySlotIds } = await getGoogleBusy(id);
      setBusyFromCalendar(new Set(busySlotIds));
    } catch (err) {
      setError(err.message + " — try connecting Google Calendar from Sign in with Google first.");
    } finally {
      setImporting(false);
    }
  }

  async function handleApplyTemplate(e) {
    const templateId = e.target.value;
    if (!templateId) return;
    setImporting(true);
    setError("");
    try {
      const { busySlotIds } = await getTemplateBusy(id, templateId);
      setBusyFromCalendar((prev) => new Set([...prev, ...busySlotIds]));
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  }

  if (error && !session) return <div className="card error">{error}</div>;
  if (!session) return <div className="container" style={{ padding: "40px 24px" }}>Loading session…</div>;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const isOwner = user && session.ownerId === user.id;

  return (
    <div className="section" style={{ paddingTop: 24 }}>
    <div className="container">
      <div className="card">
        <h2>{session.title}</h2>
        <p className="subtitle">Share this link so others can add their availability:</p>
        <div className="share-box">
          <span>{shareUrl}</span>
          <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(shareUrl)}>Copy</button>
        </div>
      </div>

      {session.confirmedSlot && (
        <div className="confirmed-banner">
          <span>✓ Locked in: <strong>{new Date(session.confirmedSlot).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</strong></span>
        </div>
      )}

      <div className="card">
        <div className="tabs" style={{ marginBottom: 20 }}>
          <button className={view === "grid" ? "btn btn-primary" : "btn btn-ghost"} onClick={() => setView("grid")}>
            My availability
          </button>
          <button className={view === "results" ? "btn btn-primary" : "btn btn-ghost"} onClick={showResults}>
            See results
          </button>
        </div>

        {view === "grid" && (
          <>
            <label htmlFor="name">Your name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marta" />

            <div style={{ marginTop: 16, marginBottom: 4 }}>
              <label style={{ marginTop: 0 }}>Optional: auto-fill your busy times</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {user ? (
                  <button type="button" className="btn btn-ghost" onClick={handleGoogleSync} disabled={importing}>
                    Sync Google Calendar
                  </button>
                ) : (
                  <span className="subtitle" style={{ margin: 0 }}>Sign in to sync Google Calendar</span>
                )}
                <label htmlFor="ics" className="btn btn-ghost" style={{ margin: 0, cursor: "pointer" }}>
                  Upload .ics file
                </label>
                <input id="ics" type="file" accept=".ics" onChange={handleIcsUpload} disabled={importing} style={{ display: "none" }} />
                {templates.length > 0 && (
                  <select onChange={handleApplyTemplate} defaultValue="">
                    <option value="" disabled>Apply saved commitment…</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                )}
              </div>
              {importing && <p className="subtitle" style={{ marginTop: 6 }}>Reading calendar…</p>}
              {busyFromCalendar.size > 0 && (
                <p className="subtitle" style={{ marginTop: 6 }}>
                  Found {busyFromCalendar.size} busy block(s) — shown hatched below. Tap any block to set your actual availability.
                </p>
              )}
            </div>

            <div style={{ marginTop: 14 }}>
              <AvailabilityGrid slots={session.slots} availability={availability} onChange={setAvailability} busySlots={busyFromCalendar} />
            </div>

            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
              {saving ? "Saving…" : joined ? "Update my availability" : "Save my availability"}
            </button>
          </>
        )}

        {view === "results" && (
          <ResultsView results={results} sessionId={id} isOwner={isOwner} confirmedSlot={session.confirmedSlot} onConfirmed={(slotId) => setSession({ ...session, confirmedSlot: slotId })} />
        )}
      </div>
    </div>
    </div>
  );
}
