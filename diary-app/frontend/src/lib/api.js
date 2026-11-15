const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  listEntries: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/entries${qs ? `?${qs}` : ""}`);
  },
  getEntry: (id) => request(`/entries/${id}`),
  createEntry: (data) => request("/entries", { method: "POST", body: JSON.stringify(data) }),
  updateEntry: (id, patch) =>
    request(`/entries/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteEntry: (id) => request(`/entries/${id}`, { method: "DELETE" }),
  moodStats: () => request("/stats/moods"),
};
