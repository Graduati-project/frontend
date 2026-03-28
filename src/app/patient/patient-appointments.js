"use client";

import { useMemo, useState } from "react";
import { useCancelAppointment, useGetAppointments } from "../../../hooks/use-patient";
import { parseAppointmentsResponse } from "./patient-parsers";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

function normalizeAppointmentStatus(status) {
  const s = (status ?? "").toLowerCase();
  if (s === "canceled") return "cancelled";
  return s;
}

function filterAppointmentsByStatus(list, filter) {
  if (filter === "all") return list;
  return list.filter(
    (a) => normalizeAppointmentStatus(a.status) === filter
  );
}

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return (
      <p className="text-center text-sm text-slate-500">Loading…</p>
    );
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load data. Please try again.
      </p>
    );
  }
  return children;
}

function statusBadgeClass(status) {
  const s = (status ?? "").toLowerCase();
  if (s === "confirmed") return "bg-emerald-100 text-emerald-800";
  if (s === "pending") return "bg-amber-100 text-amber-800";
  if (s === "cancelled" || s === "canceled") return "bg-rose-100 text-rose-800";
  return "bg-slate-100 text-slate-700";
}

function canCancelAppointment(status) {
  const s = (status ?? "").toLowerCase();
  if (!s) return true;
  if (s === "cancelled" || s === "canceled") return false;
  return true;
}

export function AppointmentCard({ appointment }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const cancelMutation = useCancelAppointment();

  const doctor = appointment.doctorId;
  const user =
    doctor && typeof doctor === "object" ? doctor.userId : null;
  const specialty =
    doctor && typeof doctor === "object" ? doctor.specialtyId : null;

  const rawDate = appointment.date;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const validDate = dateObj && !Number.isNaN(dateObj.getTime());

  const showCancel = canCancelAppointment(appointment.status);

  const handleConfirmCancel = () => {
    if (!appointment._id) return;
    cancelMutation.mutate(appointment._id, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Date & time
          </p>
          {validDate ? (
            <>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {dateObj.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
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
        {appointment.status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClass(appointment.status)}`}
          >
            {appointment.status}
          </span>
        )}
      </div>

      <div className="px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Doctor
        </p>
        {user && typeof user === "object" ? (
          <>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </h3>
            {specialty?.name && (
              <p className="mt-0.5 text-sm font-medium text-emerald-700">
                {specialty.name}
              </p>
            )}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-medium text-slate-900">
                  {user.phone ?? "—"}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Doctor details are not available for this appointment.
          </p>
        )}
      </div>

      {showCancel && appointment._id && (
        <div className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              cancelMutation.reset();
              setDialogOpen(true);
            }}
            className="text-sm font-semibold text-rose-700 underline decoration-rose-300 underline-offset-2 hover:text-rose-900"
          >
            Cancel booking
          </button>
        </div>
      )}

      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close dialog"
            onClick={() => setDialogOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-appointment-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h3
              id="cancel-appointment-title"
              className="text-lg font-semibold text-slate-900"
            >
              Cancel this appointment?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to cancel this booking? You can book a new
              slot later if needed.
            </p>
            {cancelMutation.isError && (
              <p className="mt-3 text-sm text-rose-600">
                {cancelMutation.error?.response?.data?.message ??
                  "Could not cancel. Try again."}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Keep appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelMutation.isPending}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export function AppointmentsSection() {
  const [statusFilter, setStatusFilter] = useState("all");
  const appointments = useGetAppointments();
  const { appointments: apptList } = parseAppointmentsResponse(
    appointments.data
  );

  const filteredList = useMemo(
    () => filterAppointmentsByStatus(apptList, statusFilter),
    [apptList, statusFilter]
  );

  return (
    <SectionState
      isLoading={appointments.isLoading}
      error={appointments.error}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Your appointments
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </span>
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
              {STATUS_FILTERS.map(({ value, label }) => {
                const active = statusFilter === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatusFilter(value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {apptList.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No appointments yet.
          </p>
        ) : filteredList.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No appointments with this status.
          </p>
        ) : (
          <div className="grid gap-4">
            {filteredList.map((item) => (
              <AppointmentCard key={item._id} appointment={item} />
            ))}
          </div>
        )}
      </div>
    </SectionState>
  );
}
