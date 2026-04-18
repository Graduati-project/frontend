"use client";

import { useEffect, useMemo, useState } from "react";
import { useAddAppointment, useGetMyDoctors } from "../../../hooks/use-patient";
import { parseMyDoctorsResponse } from "./patient-parsers";
import { DAY_LABEL_EN, ScheduleVisual } from "./patient-schedule";

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

function normalizeHour(value) {
  if (!value || typeof value !== "string") return "09:00";
  const parts = value.trim().split(":");
  if (parts.length >= 2) {
    const h = String(parseInt(parts[0], 10)).padStart(2, "0");
    const m = String(parseInt(parts[1], 10)).padStart(2, "0");
    return `${h}:${m}`;
  }
  return value;
}

export function DoctorBookForm({ doctorId, schedule }) {
  const mutation = useAddAppointment();
  const slots = schedule ?? [];
  const first = slots[0];
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(first?.day ?? "");
  const [hour, setHour] = useState(first?.startTime ?? "09:00");

  const dayOptions = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const row of slots) {
      if (row?.day && !seen.has(row.day)) {
        seen.add(row.day);
        out.push(row);
      }
    }
    return out;
  }, [slots]);

  const currentSlot = slots.find((s) => s.day === day);

  useEffect(() => {
    const row = slots.find((s) => s.day === day);
    if (row?.startTime) setHour(row.startTime);
  }, [day, slots]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctorId || !day || !hour) return;
    mutation.mutate({
      doctorId,
      day: String(day).toLowerCase(),
      hour: normalizeHour(hour),
    });
  };

  if (!doctorId) return null;

  return (
    <div className="border-t border-teal-100/60 bg-teal-50/20 px-5 py-4">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            mutation.reset();
            setOpen(true);
          }}
          className="w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-500"
        >
          Book appointment
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Book appointment
          </p>
          <div>
            <label
              htmlFor={`day-${doctorId}`}
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Day
            </label>
            {dayOptions.length > 0 ? (
              <select
                id={`day-${doctorId}`}
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                required
              >
                {dayOptions.map((row) => (
                  <option key={row.day} value={row.day}>
                    {DAY_LABEL_EN[row.day] ?? row.day}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`day-${doctorId}`}
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="e.g. tuesday"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                required
              />
            )}
          </div>
          <div>
            <label
              htmlFor={`hour-${doctorId}`}
              className="mb-1 block text-xs font-medium text-slate-500"
            >
              Time
            </label>
            <input
              id={`hour-${doctorId}`}
              type="time"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              min={currentSlot?.startTime}
              max={currentSlot?.endTime}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              required
            />
            {currentSlot && (
              <p className="mt-1 text-xs text-slate-500">
                Clinic hours: {currentSlot.startTime} – {currentSlot.endTime}
              </p>
            )}
          </div>
          {mutation.isError && (
            <p className="text-sm text-rose-600">
              {mutation.error?.response?.data?.message ?? "Booking failed."}
            </p>
          )}
          {mutation.isSuccess && (
            <p className="text-sm text-emerald-700">
              {mutation.data?.message ??
                mutation.data?.data?.message ??
                "Appointment booked successfully."}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="min-w-[100px] flex-1 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/15 transition hover:bg-teal-500 disabled:opacity-50"
            >
              {mutation.isPending ? "Booking…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                mutation.reset();
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function MyDoctorCard({ doctor, showBooking = false }) {
  const user = doctor.userId;
  const spec = doctor.specialtyId;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/70 transition-shadow hover:shadow-md">
      <div className="relative border-b border-teal-100/70 bg-teal-50/35 px-5 py-4">
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-teal-500/90"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
          Doctor
        </p>
        {!user || typeof user !== "object" ? (
          <p className="mt-2 text-sm text-slate-500">
            User profile not available.
          </p>
        ) : (
          <>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              {user.firstName} {user.lastName}
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-teal-100/60">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-teal-700/90">
                    Email
                  </dt>
                  <dd className="max-w-full break-all text-right font-medium text-slate-900">
                    {user.email}
                  </dd>
                </div>
              </div>
              <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-teal-100/60">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-teal-700/90">
                    Phone
                  </dt>
                  <dd className="text-right font-medium text-slate-900">
                    {user.phone ?? "—"}
                  </dd>
                </div>
              </div>
            </dl>
          </>
        )}
      </div>

      {spec && typeof spec === "object" && (
        <div className="px-5 py-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 ring-1 ring-slate-100/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800/80">
              Specialty
            </p>
            <h4 className="mt-1 text-lg font-semibold text-slate-900">
              {spec.name}
            </h4>
            {spec.maxAppointmentsPerDay != null && (
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80">
                  Max / day:{" "}
                  <span className="ml-1 font-semibold text-teal-800">
                    {spec.maxAppointmentsPerDay}
                  </span>
                </span>
              </p>
            )}
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Weekly hours
            </p>
            <ScheduleVisual schedule={spec.schedule} compact />
          </div>
        </div>
      )}

      {showBooking && doctor._id && (
        <DoctorBookForm doctorId={doctor._id} schedule={spec?.schedule} />
      )}
    </article>
  );
}

export function DoctorsSection() {
  const myDoctors = useGetMyDoctors();
  const { doctors: doctorList } = parseMyDoctorsResponse(myDoctors.data);

  return (
    <SectionState
      isLoading={myDoctors.isLoading}
      error={myDoctors.error}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Doctors linked to your account
        </h2>
        {doctorList.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No doctors on file yet.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {doctorList.map((doc) => (
              <MyDoctorCard key={doc._id} doctor={doc} showBooking />
            ))}
          </div>
        )}
      </div>
    </SectionState>
  );
}
