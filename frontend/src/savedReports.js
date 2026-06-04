const KEY = 'big_saved_reports';
const MAX = 20;

export function saveReport(report) {
  // report: { id, type, name, sector, zip, city, state, score, timestamp, data }
  const all = loadReports();
  const existing = all.findIndex(r => r.id === report.id);
  if (existing >= 0) { all[existing] = report; }
  else { all.unshift(report); }
  const trimmed = all.slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(trimmed)); } catch {}
  return trimmed;
}

export function loadReports() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function deleteReport(id) {
  const all = loadReports().filter(r => r.id !== id);
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
  return all;
}

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
