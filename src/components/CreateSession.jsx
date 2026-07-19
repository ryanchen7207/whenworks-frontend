import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession } from "../api.js";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function inAWeekStr() {
  const d = new Date();
  d.setDate(d.getDate() + 6);
  return d.toISOString().slice(0, 10);
}

export default function CreateSession() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(inAWeekStr());
  const [startHour, setStartHour] = useState(15);
  const [endHour, setEndHour] = useState(20);
  const [blockMinutes, setBlockMinutes] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Give your session a title.");
    setLoading(true);
    try {
      const session = await createSession({
        title: title.trim(),
        startDate,
        endDate,
        startHour: Number(startHour),
        endHour: Number(endHour),
        blockMinutes: Number(blockMinutes),
      });
      navigate(`/s/${session.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section" style={{ paddingTop: 24 }}>
    <div className="container">
    <div className="card card-narrow">
      <h2>Create a session</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">What's this for?</label>
        <input
          id="title"
          placeholder="e.g. AP Bio lab group"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="row">
          <div>
            <label htmlFor="startDate">Start date</label>
            <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="endDate">End date</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="row">
          <div>
            <label htmlFor="startHour">Earliest time</label>
            <select id="startHour" value={startHour} onChange={(e) => setStartHour(e.target.value)}>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="endHour">Latest time</label>
            <select id="endHour" value={endHour} onChange={(e) => setEndHour(e.target.value)}>
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>{h}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="blockMinutes">Block size</label>
            <select id="blockMinutes" value={blockMinutes} onChange={(e) => setBlockMinutes(e.target.value)}>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: 18 }}>
          {loading ? "Creating…" : "Create session"}
        </button>
      </form>
    </div>
    </div>
    </div>
  );
}
