import { useState } from "react";
import { confirmSlot } from "../api.js";

function formatSlot(slot) {
  const d = new Date(slot);
  return d.toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export default function ResultsView({ results, sessionId, isOwner, confirmedSlot, onConfirmed }) {
  const [confirming, setConfirming] = useState(null);

  if (!results) return null;
  const { participantCount, participants, ranked } = results;

  if (participantCount === 0) {
    return <p className="subtitle">No one has submitted availability yet — share the link to get started.</p>;
  }

  const top = ranked.filter((r) => r.availableCount > 0).slice(0, 8);

  async function handleLockIn(slotId) {
    setConfirming(slotId);
    try {
      await confirmSlot(sessionId, slotId);
      onConfirmed(slotId);
    } finally {
      setConfirming(null);
    }
  }

  return (
    <div>
      <p className="subtitle">
        {participantCount} {participantCount === 1 ? "person has" : "people have"} responded: {participants.join(", ")}
      </p>
      {top.length === 0 ? (
        <p>No overlapping availability yet — everyone marked different times.</p>
      ) : (
        top.map((r, i) => {
          const isConfirmed = confirmedSlot === r.slotId;
          return (
            <div className="result-item" key={r.slotId}>
              <div className="result-rank">{i + 1}</div>
              <div className="result-time">
                {formatSlot(r.slotId)}
                {isConfirmed && <span style={{ color: "#067a5f", marginLeft: 8, fontSize: 12.5 }}>✓ Locked in</span>}
              </div>
              <div className="result-meta" style={{ marginRight: isOwner ? 12 : 0 }}>
                {r.availableCount}/{participantCount} available
              </div>
              {isOwner && !isConfirmed && (
                <button className="btn btn-ghost" onClick={() => handleLockIn(r.slotId)} disabled={confirming === r.slotId}>
                  {confirming === r.slotId ? "Locking in…" : "Lock in"}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
