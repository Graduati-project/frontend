"use client";

import { useMemo, useState } from "react";
import { formatPersonDisplayName } from "../../../lib/utils";
import { useCancelAppointment, useGetAppointments } from "../../../hooks/use-patient";
import { parseAppointmentsResponse } from "./patient-parsers";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
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
  if (s === "confirmed")
    return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80";
  if (s === "pending")
    return "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80";
  if (s === "cancelled" || s === "canceled")
    return "bg-rose-50 text-rose-800 ring-1 ring-rose-200/80";
  if (s === "completed")
    return "bg-teal-50 text-teal-800 ring-1 ring-teal-200/80";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80";
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

  const dayNum = validDate
    ? dateObj.toLocaleDateString("en-US", { day: "numeric" })
    : "—";
  const monthShort = validDate
    ? dateObj.toLocaleDateString("en-US", { month: "short" })
    : "";
  const yearNum = validDate
    ? dateObj.toLocaleDateString("en-US", { year: "numeric" })
    : "";
  const weekdayShort = validDate
    ? dateObj.toLocaleDateString("en-US", { weekday: "short" })
    : "";
  const timeStr = validDate
    ? dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const doctorName =
    user && typeof user === "object"
      ? formatPersonDisplayName(user.firstName, user.lastName) || "—"
      : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/70 transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-0 sm:p-0">
        <div className="flex shrink-0 flex-row gap-3 sm:flex-col sm:items-center sm:justify-center sm:gap-1 sm:px-4 sm:py-4 sm:text-center">
          <div className="flex h-18 w-18 shrink-0 flex-col items-center justify-center rounded-2xl bg-teal-50 ring-1 ring-teal-100/90 sm:h-auto sm:min-h-22 sm:w-24 sm:rounded-xl">
            {validDate ? (
              <>
                <span className="text-2xl font-bold tabular-nums text-teal-900 sm:text-3xl">
                  {dayNum}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-700/90">
                  {monthShort} {yearNum}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-slate-400">No date</span>
            )}
          </div>
          <div className="min-w-0 flex-1 sm:hidden">
            {appointment.status && (
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(appointment.status)}`}
              >
                {appointment.status}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 border-slate-100 sm:border-l sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              {validDate && (
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {weekdayShort} · {timeStr}
                </p>
              )}
              {user && typeof user === "object" ? (
                <>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                    {doctorName}
                  </h3>
                  {specialty?.name && (
                    <p className="mt-0.5 text-sm font-medium text-teal-700">
                      {specialty.name}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                    <span className="inline-flex max-w-full items-center gap-1.5">
                      <span
                        className="shrink-0 text-slate-400"
                        aria-hidden
                      >
                        ✉
                      </span>
                      <span className="truncate font-medium text-slate-700">
                        {user.email}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="shrink-0 text-slate-400"
                        aria-hidden
                      >
                        ☎
                      </span>
                      <span className="font-medium text-slate-700">
                        {user.phone ?? "—"}
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Doctor details are not available for this appointment.
                </p>
              )}
            </div>
            <div className="hidden shrink-0 sm:block">
              {appointment.status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClass(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              )}
            </div>
          </div>

          {showCancel && appointment._id && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 sm:mt-4 sm:border-0 sm:pt-0">
              <button
                type="button"
                onClick={() => {
                  cancelMutation.reset();
                  setDialogOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
              >
                Cancel appointment
              </button>
            </div>
          )}
        </div>
      </div>

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
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl ring-1 ring-slate-100/80"
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

  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      return tb - ta;
    });
  }, [filteredList]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Your appointments
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Upcoming and past visits in one place. Newest first.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Filter by status
          </span>
          <div className="flex max-w-full flex-wrap gap-1.5 rounded-2xl border border-teal-100/80 bg-teal-50/30 p-1 ring-1 ring-slate-100/60">
            {STATUS_FILTERS.map(({ value, label }) => {
              const active = statusFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                      : "text-slate-600 hover:bg-white/90"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <SectionState
        isLoading={appointments.isLoading}
        error={appointments.error}
      >
        {apptList.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No appointments yet.
          </p>
        ) : filteredList.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No appointments with this status.
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedList.map((item) => (
              <li key={item._id}>
                <AppointmentCard appointment={item} />
              </li>
            ))}
          </ul>
        )}
      </SectionState>
    </div>
  );
}
