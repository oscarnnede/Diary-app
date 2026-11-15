import { useCallback, useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import Header from "./components/Header";
import Timeline from "./components/Timeline";
import EntryModal from "./components/EntryModal";
import MoodBar from "./components/MoodBar";
import { api } from "./lib/api";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [moodStats, setMoodStats] = useState({});
  const [search, setSearch] = useState("");
  const [activeMood, setActiveMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (activeMood) params.mood = activeMood;
      const [entriesData, statsData] = await Promise.all([
        api.listEntries(params),
        api.moodStats(),
      ]);
      setEntries(entriesData);
      setMoodStats(statsData);
      setConnectionError(false);
    } catch (err) {
      console.error(err);
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, [search, activeMood]);

  useEffect(() => {
    const timeout = setTimeout(refresh, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [refresh, search]);

  async function handleSave(payload) {
    try {
      if (editingEntry) {
        await api.updateEntry(editingEntry.id, payload);
      } else {
        await api.createEntry(payload);
      }
      setModalOpen(false);
      setEditingEntry(null);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Could not save. Check that the backend is running.");
    }
  }

  async function handleToggleFavorite(entry) {
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, is_favorite: e.is_favorite ? 0 : 1 } : e))
    );
    try {
      await api.updateEntry(entry.id, { is_favorite: entry.is_favorite ? 0 : 1 });
    } catch (err) {
      console.error(err);
      refresh();
    }
  }

  async function handleDelete(entry) {
    if (!confirm(`Delete "${entry.title}"? This can't be undone.`)) return;
    try {
      await api.deleteEntry(entry.id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  }

  function openAdd() {
    setEditingEntry(null);
    setModalOpen(true);
  }

  function openEdit(entry) {
    setEditingEntry(entry);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen">
      <Header
        search={search}
        onSearchChange={setSearch}
        activeMood={activeMood}
        onMoodChange={setActiveMood}
        onAdd={openAdd}
      />

      <main className="max-w-3xl mx-auto px-4 pt-5">
        {connectionError && (
          <div className="flex items-center gap-2 bg-rose-soft border border-rose/30 text-rose text-sm rounded-xl px-3.5 py-2.5 mb-4">
            <WifiOff size={15} />
            Can't reach the backend at the configured API URL. Is it running?
          </div>
        )}

        {!loading && !connectionError && <MoodBar stats={moodStats} />}

        {loading ? (
          <p className="text-center text-sm text-ink-soft py-16">Opening your diary…</p>
        ) : (
          <Timeline
            entries={entries}
            onOpen={openEdit}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
          />
        )}
      </main>

      <EntryModal
        open={modalOpen}
        initial={editingEntry}
        onClose={() => {
          setModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
