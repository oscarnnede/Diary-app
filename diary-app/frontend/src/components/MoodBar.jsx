import { MOODS } from "../lib/theme";

const MOOD_BAR_COLORS = {
  joyful: "bg-amber",
  excited: "bg-coral",
  grateful: "bg-lime",
  calm: "bg-teal",
  neutral: "bg-ink-soft/40",
  anxious: "bg-sky",
  sad: "bg-indigo",
  angry: "bg-rose",
};

export default function MoodBar({ stats }) {
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const ordered = MOODS.map((m) => ({ ...m, count: stats[m.id] || 0 })).filter((m) => m.count > 0);

  return (
    <div className="bg-white/70 rounded-2xl border border-white p-4 mb-6">
      <p className="text-[12px] font-medium text-ink-soft mb-2.5">Your mood mix</p>
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
        {ordered.map((m) => (
          <div
            key={m.id}
            className={MOOD_BAR_COLORS[m.id]}
            style={{ width: `${(m.count / total) * 100}%` }}
            title={`${m.label}: ${m.count}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
        {ordered.map((m) => (
          <span key={m.id} className="inline-flex items-center gap-1 text-[11px] text-ink-soft">
            <span className={`w-2 h-2 rounded-full ${MOOD_BAR_COLORS[m.id]}`} />
            {m.emoji} {m.count}
          </span>
        ))}
      </div>
    </div>
  );
}
