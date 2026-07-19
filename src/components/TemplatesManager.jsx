import { useEffect, useState } from "react";
import { getTemplates, createTemplate, deleteTemplate } from "../api.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TemplatesManager() {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("15:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    getTemplates()
      .then((r) => setTemplates(r.templates))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Give this commitment a name, like 'School day'.");
    setError("");
    try {
      await createTemplate(name.trim(), [{ dayOfWeek: Number(dayOfWeek), startTime, endTime, label: name.trim() }]);
      setName("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await deleteTemplate(id);
    load();
  }

  return (
    <div className="card">
      <h2>Recurring commitments</h2>
      <p className="subtitle">
        Save things like class or practice once — future sessions can apply these automatically
        instead of you re-marking them every time.
      </p>

      <form onSubmit={handleAdd}>
        <label htmlFor="tname">What is it?</label>
        <input id="tname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. School hours" />
        <div className="row">
          <div>
            <label htmlFor="day">Day</label>
            <select id="day" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
              {DAYS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="start">Start</label>
            <input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <label htmlFor="end">End</label>
            <input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-ghost" type="submit" style={{ marginTop: 16 }}>Save commitment</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {loading ? (
          <p className="subtitle">Loading…</p>
        ) : templates.length === 0 ? (
          <p className="subtitle">Nothing saved yet.</p>
        ) : (
          templates.map((t) => (
            <div className="result-item" key={t.id}>
              <div className="result-time">
                {t.name} — {DAYS[t.blocks[0]?.dayOfWeek]} {t.blocks[0]?.startTime}–{t.blocks[0]?.endTime}
              </div>
              <button className="btn btn-ghost" onClick={() => handleDelete(t.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
