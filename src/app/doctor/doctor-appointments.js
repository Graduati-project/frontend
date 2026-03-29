"use client";

import {
  useGetDoctorAppointments,
  useUpdateAppointmentStatus,
} from "../../../hooks/use-doctor";
import {
  getPatientDisplayName,
  parseDoctorAppointmentsResponse,
} from "./doctor-parsers";

const STATUS_ACTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirm" },
  { value: "cancelled", label: "Cancel" },
  { value: "completed", label: "Complete" },
];

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return (
      <p className="text-center text-sm text-slate-500">Loading…</p>
    );
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load appointments. Please try again.
      </p>
    );
  }
  return children;
}

function statusBadgeClass(status) {
  const s = (status ?? "").toLowerCase();
  if (s === "confirmed" || s === "completed") return "bg-emerald-100 text-emerald-800";
  if (s === "pending") return "bg-amber-100 text-amber-800";
  if (s === "cancelled" || s === "canceled") return "bg-rose-100 text-rose-800";
  return "bg-slate-100 text-slate-700";
}

function DoctorAppointmentCard({ appointment }) {
  const updateStatus = useUpdateAppointmentStatus();

  const patient = appointment.patientId;
  const patientName =
    typeof patient === "object" && patient
      ? getPatientDisplayName(patient)
      : String(patient ?? "—");

  const rawDate = appointment.date ?? appointment.startTime ?? appointment.scheduledAt;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const validDate = dateObj && !Number.isNaN(dateObj.getTime());

  const current = (appointment.status ?? "").toLowerCase();

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Patient
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{patientName}</p>
        </div>
        {appointment.status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClass(appointment.status)}`}
          >
            {appointment.status}
          </span>
        )}
      </div>

      <div className="space-y-3 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Date & time
          </p>
          {validDate ? (
            <>
              <p className="mt-1 font-medium text-slate-900">
                {dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-slate-600">
                {dateObj.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-500">—</p>
          )}
        </div>

        {appointment._id && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Update status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ACTIONS.map((a) => {
                const disabled =
                  a.value === current ||
                  updateStatus.isPending;
                return (
                  <button
                    key={a.value}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      updateStatus.mutate({ id: appointment._id, status: a.value })
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
            {updateStatus.isError && (
              <p className="mt-2 text-xs text-rose-600">Could not update status.</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function DoctorAppointmentsSection() {
  const query = useGetDoctorAppointments();
  const { appointments } = parseDoctorAppointmentsResponse(query.data);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your appointments</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review visits and update each appointment&apos;s status.
          </p>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No appointments yet.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {appointments.map((a) => (
              <DoctorAppointmentCard key={a._id ?? JSON.stringify(a)} appointment={a} />
            ))}
          </div>
        )}
      </div>
    </SectionState>
  );
}
