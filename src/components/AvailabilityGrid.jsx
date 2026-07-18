const STATUS_CYCLE = [undefined, "preferred", "okay", "avoid"];

function nextStatus(current) {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

function groupByDay(slots) {
  const days = {};
  for (const slot of slots) {
    const [date, time] = slot.split("T");
    if (!days[date]) days[date] = [];
    days[date].push({ slot, time });
  }
  return days;
}

function formatDay(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function AvailabilityGrid({ slots, availability, onChange }) {
  const days = groupByDay(slots);

  function handleClick(slot) {
    onChange({ ...availability, [slot]: nextStatus(availability[slot]) });
  }

  return (
    <div className="grid-wrap">
      <div className="legend">
        <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--unavailable)" }} /> Unavailable (default)</div>
        <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--avoid)" }} /> Avoid</div>
        <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--okay)" }} /> Okay</div>
        <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--preferred)" }} /> Preferred</div>
      </div>

      {Object.entries(days).map(([date, blocks]) => (
        <div className="grid-day" key={date}>
          <div className="grid-day-label">{formatDay(date)}</div>
          <div className="grid-blocks">
            {blocks.map(({ slot, time }) => {
              const status = availability[slot];
              return (
                <div
                  key={slot}
                  className={`block ${status || ""}`}
                  onClick={() => handleClick(slot)}
                  title="Click to cycle: unavailable → preferred → okay → avoid"
                >
                  {time}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
