/** Normalize list payloads: array, { data: [] }, { items: [] }, etc. */
export function parseAdminListPayload(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  const inner = raw.data ?? raw;
  if (Array.isArray(inner)) return inner;
  if (typeof inner === "object") {
    return inner.items ?? inner.results ?? inner.doctors ?? inner.patients ?? inner.appointments ?? [];
  }
  return [];
}

export function parseAdminDoctorsResponse(raw) {
  return { doctors: parseAdminListPayload(raw) };
}

export function parseAdminPatientsResponse(raw) {
  return { patients: parseAdminListPayload(raw) };
}

export function parseAdminAppointmentsResponse(raw) {
  return { appointments: parseAdminListPayload(raw) };
}

export function getUserDisplayName(u) {
  if (!u) return "—";
  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  if (name) return name;
  return u.email ?? "—";
}

