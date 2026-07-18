function formatSlot(slot) {
  const d = new Date(slot);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ResultsView({ results }) {
  if (!results) return null;
  const { participantCount, participants, ranked } = results;

  if (participantCount === 0) {
    return <p className="subtitle">No one has submitted availability yet — share the link to get started.</p>;
  }

  const top = ranked.filter((r) => r.availableCount > 0).slice(0, 8);

  return (
    <div>
      <p className="subtitle">
        {participantCount} {participantCount === 1 ? "person has" : "people have"} responded: {participants.join(", ")}
      </p>
      {top.length === 0 ? (
        <p>No whenworksping availability yet — everyone marked different times.</p>
      ) : (
        top.map((r, i) => (
          <div className="result-item" key={r.slotId}>
            <div className="result-rank">{i + 1}</div>
            <div className="result-time">{formatSlot(r.slotId)}</div>
            <div className="result-meta">
              {r.availableCount}/{participantCount} available
            </div>
          </div>
        ))
      )}
    </div>
  );
}
