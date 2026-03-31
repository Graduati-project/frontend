"use client";

import { useMemo, useState } from "react";
import { useGetStaffAppointments } from "../../../hooks/use-staff";
import {
  getUserDisplayName,
  parseAdminAppointmentsResponse,
} from "./admin-parsers";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return <p className="text-center text-sm text-slate-500">Loading…</p>;
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

function formatDateTime(raw) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString("en-US")} ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function AppointmentRow({ appointment }) {
  const doctor = appointment?.doctorId;
  const patient = appointment?.patientId;

  const doctorUser =
    doctor && typeof doctor === "object"
      ? doctor.userId && typeof doctor.userId === "object"
        ? doctor.userId
        : doctor
      : null;

  const patientUser =
    patient && typeof patient === "object"
      ? patient.userId && typeof patient.userId === "object"
        ? patient.userId
        : patient
      : null;

  const specialty =
    doctor && typeof doctor === "object" && doctor.specialtyId && typeof doctor.specialtyId === "object"
      ? doctor.specialtyId
      : null;

  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 font-medium text-slate-900">
        {formatDateTime(appointment?.date ?? appointment?.scheduledAt)}
      </td>
      <td className="px-4 py-3 text-slate-700">
        {appointment?.status ?? "—"}
      </td>
      <td className="px-4 py-3 text-slate-700">
        {patientUser ? getUserDisplayName(patientUser) : "—"}
      </td>
      <td className="px-4 py-3 text-slate-700">
        {doctorUser ? getUserDisplayName(doctorUser) : "—"}
      </td>
      <td className="px-4 py-3 text-slate-700">
        {specialty?.name ?? "—"}
      </td>
    </tr>
  );
}

export function AdminAppointmentsSection() {
  const query = useGetStaffAppointments();
  const { appointments } = parseAdminAppointmentsResponse(query.data);
  const [search, setSearch] = useState("");

  const searchedAppointments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((appointment) => {
      const doctor = appointment?.doctorId;
      const patient = appointment?.patientId;

      const doctorUser =
        doctor && typeof doctor === "object"
          ? doctor.userId && typeof doctor.userId === "object"
            ? doctor.userId
            : doctor
          : null;

      const patientUser =
        patient && typeof patient === "object"
          ? patient.userId && typeof patient.userId === "object"
            ? patient.userId
            : patient
          : null;

      const dn = doctorUser ? getUserDisplayName(doctorUser) : "";
      const de = doctorUser?.email ?? "";
      const dp = doctorUser?.phone ?? "";

      const pn = patientUser ? getUserDisplayName(patientUser) : "";
      const pe = patientUser?.email ?? "";
      const pp = patientUser?.phone ?? "";

      const hay = `${dn} ${de} ${dp} ${pn} ${pe} ${pp}`.toLowerCase();
      return hay.includes(q);
    });
  }, [appointments, search]);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Appointments</h1>
          <p className="mt-1 text-sm text-slate-600">
            All appointments across the system.
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex min-w-[260px] flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{searchedAppointments.length}</span>{" "}
            of <span className="font-semibold text-slate-700">{appointments.length}</span>
          </p>
        </div>

        {searchedAppointments.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No appointments found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[1000px] w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Doctor</th>
                  <th className="px-4 py-3 font-medium">Specialty</th>
                </tr>
              </thead>
              <tbody>
                {searchedAppointments.map((a) => (
                  <AppointmentRow
                    key={a._id ?? JSON.stringify(a)}
                    appointment={a}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionState>
  );
}

