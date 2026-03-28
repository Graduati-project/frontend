"use client";

import { useEffect, useMemo, useState } from "react";
import { useAddAppointment, useGetMyDoctors } from "../../../hooks/use-patient";
import { parseMyDoctorsResponse } from "./patient-parsers";
import { DAY_LABEL_EN, ScheduleTable } from "./patient-schedule";

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
    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            mutation.reset();
            setOpen(true);
          }}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Book
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
              className="min-w-[100px] flex-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {mutation.isPending ? "Booking…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                mutation.reset();
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
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
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Doctor
        </p>
        {!user || typeof user !== "object" ? (
          <p className="mt-2 text-sm text-slate-500">
            User profile not available.
          </p>
        ) : (
          <>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </h3>
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
        )}
      </div>

      {spec && typeof spec === "object" && (
        <div className="px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Specialty
          </p>
          <h4 className="mt-1 text-lg font-semibold text-slate-900">
            {spec.name}
          </h4>
          {spec.maxAppointmentsPerDay != null && (
            <p className="mt-1 text-sm text-slate-600">
              Max appointments per day:{" "}
              <span className="font-medium text-slate-900">
                {spec.maxAppointmentsPerDay}
              </span>
            </p>
          )}
          <p className="mb-3 mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
            Working hours
          </p>
          <ScheduleTable schedule={spec.schedule} />
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
