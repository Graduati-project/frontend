/** Normalizes various API shapes into an array. */
export function asArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

/**
 * GET /patient/specialties:
 * { message, data: { specialties[], doctors[], pagination } }
 */
export function parseSpecialtiesResponse(raw) {
  if (!raw) {
    return { specialties: [], doctors: [], pagination: null };
  }
  const inner = raw.data;
  if (
    inner &&
    (Array.isArray(inner.specialties) || Array.isArray(inner.doctors))
  ) {
    return {
      specialties: Array.isArray(inner.specialties) ? inner.specialties : [],
      doctors: Array.isArray(inner.doctors) ? inner.doctors : [],
      pagination: inner.pagination ?? null,
    };
  }
  return {
    specialties: asArray(raw),
    doctors: [],
    pagination: null,
  };
}

/**
 * GET /patient/appointments:
 * { message, data: { appointments[] } }
 */
export function parseAppointmentsResponse(raw) {
  if (!raw) return { appointments: [] };
  const inner = raw.data;
  if (inner && Array.isArray(inner.appointments)) {
    return { appointments: inner.appointments };
  }
  return { appointments: asArray(raw) };
}

/**
 * GET /patient/my-doctors:
 * { message, data: { doctors[] } }
 */
export function parseMyDoctorsResponse(raw) {
  if (!raw) return { doctors: [] };
  const inner = raw.data;
  if (inner && Array.isArray(inner.doctors)) {
    return { doctors: inner.doctors };
  }
  return { doctors: asArray(raw) };
}

/**
 * GET /patient/specialties/overview/:id
 * - { data: { items: [{ specialty, doctors, doctorCount }], pagination } }
 * - or { data: { specialty, doctors } } (legacy)
 */
export function parseSpecialtyOverviewDetail(raw) {
  if (!raw) {
    return {
      specialty: null,
      doctors: [],
      doctorCount: null,
      pagination: null,
    };
  }
  const inner = raw.data ?? raw;
  const pagination = inner.pagination ?? null;

  if (Array.isArray(inner.items) && inner.items.length > 0) {
    const row = inner.items[0];
    return {
      specialty:
        row.specialty && typeof row.specialty === "object" ? row.specialty : null,
      doctors: Array.isArray(row.doctors) ? row.doctors : [],
      doctorCount: row.doctorCount ?? null,
      pagination,
    };
  }

  const doctors = Array.isArray(inner.doctors) ? inner.doctors : [];

  if (inner.specialty && typeof inner.specialty === "object") {
    return {
      specialty: inner.specialty,
      doctors,
      doctorCount: null,
      pagination,
    };
  }

  const { doctors: _omit, ...rest } = inner;
  const hasSpecialtyFields =
    rest.name != null ||
    rest.schedule != null ||
    rest.maxAppointmentsPerDay != null ||
    rest._id != null;

  if (hasSpecialtyFields && Object.keys(rest).length > 0) {
    return {
      specialty: rest,
      doctors,
      doctorCount: null,
      pagination,
    };
  }

  return { specialty: null, doctors, doctorCount: null, pagination };
}
