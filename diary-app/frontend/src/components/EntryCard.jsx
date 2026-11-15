import { Star, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { moodMeta, COLOR_CLASSES } from "../lib/theme";

export default function EntryCard({ entry, onOpen, onToggleFavorite, onDelete }) {
  const mood = moodMeta(entry.mood);
  const c = COLOR_CLASSES[entry.color] || COLOR_CLASSES.coral;
  const tags = (entry.tags || "").split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div
      onClick={() => onOpen(entry)}
      className="group relative bg-white/80 hover:bg-white rounded-2xl border border-white shadow-sm hover:shadow-md transition-all cursor-pointer p-4"
    >
      <div className={`absolute top-0 left-5 -translate-y-1/2 w-8 h-8 rounded-full ${c.bg} flex items-center justify-center text-base shadow-sm`}>
        {mood.emoji}
      </div>

      <div className="flex items-start justify-between gap-2 mt-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-ink-soft">
            {format(new Date(entry.entry_date), "MMM d, yyyy · h:mm a")}
          </p>
          <h3 className="font-display font-semibold text-[17px] text-ink truncate mt-0.5">
            {entry.title}
          </h3>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(entry);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              entry.is_favorite ? "text-amber" : "text-ink-soft/40 hover:text-amber"
            }`}
            aria-label="Toggle favorite"
          >
            <Star size={16} fill={entry.is_favorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(entry);
            }}
            className="p-1.5 rounded-full text-ink-soft/40 hover:text-ink transition-colors"
            aria-label="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry);
            }}
            className="p-1.5 rounded-full text-ink-soft/40 hover:text-rose transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {entry.content && (
        <p className="text-[13.5px] text-ink-soft leading-relaxed mt-2 line-clamp-2">
          {entry.content}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${c.soft} ${c.text}`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
