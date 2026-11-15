import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toLocalInputValue } from "../lib/dates";
import { MOODS, COLORS, COLOR_CLASSES } from "../lib/theme";

const emptyForm = () => ({
  title: "",
  content: "",
  mood: "neutral",
  color: "coral",
  tags: "",
  entry_date: toLocalInputValue(new Date()),
});

export default function EntryModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        title: initial.title,
        content: initial.content || "",
        mood: initial.mood,
        color: initial.color,
        tags: initial.tags || "",
        entry_date: toLocalInputValue(new Date(initial.entry_date)),
      });
    } else {
      setForm(emptyForm());
    }
    setError("");
  }, [open, initial]);

  if (!open) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give your entry a title.");
      return;
    }
    onSave({
      ...form,
      entry_date: new Date(form.entry_date).toISOString(),
    });
  }

  const activeColorClasses = COLOR_CLASSES[form.color] || COLOR_CLASSES.coral;

  return (
    <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-gradient-to-b from-white to-canvas-to/40 rounded-t-3xl sm:rounded-3xl border border-white shadow-xl max-h-[92vh] overflow-y-auto">
        <div className={`flex items-center justify-between px-5 pt-4 pb-3 sticky top-0 bg-white/90 backdrop-blur border-b border-white`}>
          <h2 className="font-display font-semibold text-lg text-ink">
            {initial ? "Edit entry" : "New entry"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full text-ink-soft hover:text-ink hover:bg-black/5" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-[12px] font-medium text-ink-soft">Title</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="What's this entry about?"
              className={`mt-1 w-full rounded-xl border-2 border-white bg-white px-3.5 py-2.5 text-[15px] text-ink focus:outline-none focus:ring-2 ${activeColorClasses.focusRing} focus:border-white shadow-sm`}
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-ink-soft">Your thoughts</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={5}
              placeholder="Write freely…"
              className={`mt-1 w-full rounded-xl border-2 border-white bg-white px-3.5 py-2.5 text-[14px] text-ink resize-none focus:outline-none focus:ring-2 ${activeColorClasses.focusRing} shadow-sm`}
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-ink-soft">How were you feeling?</label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => set("mood", m.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[13px] font-medium border-2 transition-colors ${
                    form.mood === m.id
                      ? "bg-ink text-white border-ink"
                      : "bg-white text-ink-soft border-white hover:text-ink"
                  }`}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-ink-soft">Accent color</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {COLORS.map((c) => {
                const cls = COLOR_CLASSES[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set("color", c.id)}
                    className={`w-8 h-8 rounded-full ${cls.bg} border-2 transition-transform ${
                      form.color === c.id ? "border-ink scale-110" : "border-transparent"
                    }`}
                    aria-label={c.label}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-ink-soft">When</label>
              <input
                type="datetime-local"
                value={form.entry_date}
                onChange={(e) => set("entry_date", e.target.value)}
                className={`mt-1 w-full rounded-xl border-2 border-white bg-white px-2.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 ${activeColorClasses.focusRing} shadow-sm`}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-ink-soft">Tags</label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="comma, separated"
                className={`mt-1 w-full rounded-xl border-2 border-white bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 ${activeColorClasses.focusRing} shadow-sm`}
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose">{error}</p>}

          <div className="flex gap-2 pt-2 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-white bg-white text-ink-soft text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl ${activeColorClasses.bg} text-white text-sm font-semibold shadow-sm active:scale-[0.98] transition-transform`}
            >
              {initial ? "Save changes" : "Add to diary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
