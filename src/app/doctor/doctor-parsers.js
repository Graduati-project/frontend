/** Normalize list payloads: array, { data: [] }, { items: [] }, etc. */
export function parseDoctorListPayload(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  const inner = raw.data ?? raw;
  if (Array.isArray(inner)) return inner;
  if (typeof inner === "object") {
    return (
      inner.items ??
      inner.appointments ??
      inner.patients ??
      inner.results ??
      []
    );
  }
  return [];
}

export function parseDoctorAppointmentsResponse(raw) {
  return { appointments: parseDoctorListPayload(raw) };
}

export function parseDoctorPatientsResponse(raw) {
  return { patients: parseDoctorListPayload(raw) };
}

/** Display name for populated patient user or flat patient object */
export function getPatientDisplayName(patient) {
  if (!patient) return "—";
  const u = patient.userId && typeof patient.userId === "object"
    ? patient.userId
    : patient;
  const first = u.firstName ?? patient.firstName;
  const last = u.lastName ?? patient.lastName;
  const name = `${first ?? ""} ${last ?? ""}`.trim();
  if (name) return name;
  return u.email ?? patient.email ?? "—";
}
