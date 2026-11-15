import { Feather, Plus, Search, X } from "lucide-react";
import { MOODS } from "../lib/theme";

export default function Header({ search, onSearchChange, activeMood, onMoodChange, onAdd }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-white/70">
      <div className="max-w-3xl mx-auto px-4 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-coral to-plum flex items-center justify-center shadow-sm">
              <Feather size={17} className="text-white" strokeWidth={2.25} />
            </div>
            <h1 className="font-display font-semibold text-xl text-ink">Inkling</h1>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 pl-3 pr-4 h-10 rounded-full bg-ink text-white text-sm font-medium shadow-sm active:scale-95 transition-transform"
          >
            <Plus size={17} strokeWidth={2.5} />
            New entry
          </button>
        </div>

        <div className="relative mt-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your entries…"
            className="w-full h-11 rounded-2xl bg-white/80 border border-white pl-10 pr-9 text-[15px] text-ink placeholder:text-ink-soft/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-plum/30"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
          <button
            onClick={() => onMoodChange(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
              !activeMood
                ? "bg-ink text-white border-ink"
                : "bg-white/70 text-ink-soft border-white hover:text-ink"
            }`}
          >
            All moods
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => onMoodChange(activeMood === m.id ? null : m.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                activeMood === m.id
                  ? "bg-ink text-white border-ink"
                  : "bg-white/70 text-ink-soft border-white hover:text-ink"
              }`}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
