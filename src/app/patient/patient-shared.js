export function apiFileUrl(filePath) {
  if (!filePath) return "#";
  const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
  const path = String(filePath).replace(/^\//, "");
  return `${base}/${path}`;
}

export function formatShortDate(raw) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function doctorNameFromRef(doctorRef) {
  const u = doctorRef?.userId;
  if (u && typeof u === "object") {
    const n = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    if (n) return n;
  }
  return "Doctor";
}
