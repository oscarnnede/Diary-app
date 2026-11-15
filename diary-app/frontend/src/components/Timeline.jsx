import { dayLabel } from "../lib/dates";
import EntryCard from "./EntryCard";
import { BookHeart } from "lucide-react";

export default function Timeline({ entries, onOpen, onToggleFavorite, onDelete }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <div className="w-14 h-14 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-3">
          <BookHeart size={24} className="text-plum" />
        </div>
        <p className="font-display font-semibold text-lg text-ink mb-1">
          A fresh page, waiting
        </p>
        <p className="text-sm text-ink-soft">Nothing here yet — write your first entry.</p>
      </div>
    );
  }

  const groups = [];
  for (const entry of entries) {
    const d = new Date(entry.entry_date);
    const dayKey = d.toDateString();
    const last = groups[groups.length - 1];
    if (last && last.key === dayKey) {
      last.items.push(entry);
    } else {
      groups.push({ key: dayKey, date: d, items: [entry] });
    }
  }

  return (
    <div className="space-y-7 pb-24">
      {groups.map((group) => (
        <section key={group.key}>
          <div className="flex items-center gap-3 mb-3 px-1">
            <h2 className="text-[13px] font-semibold tracking-wide text-ink-soft">
              {dayLabel(group.date)}
            </h2>
            <span className="flex-1 h-px bg-white/80" />
          </div>
          <div className="space-y-4 pt-2">
            {group.items.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onOpen={onOpen}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
