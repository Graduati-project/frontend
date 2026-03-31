 "use client";

import { useProfile } from "../../../hooks/use-user";
import { useGetDoctors, useGetPatients } from "../../../hooks/use-staff";
import {
  parseAdminDoctorsResponse,
  parseAdminPatientsResponse,
} from "./admin-parsers";

function MiniBarChart({ doctorsCount, patientsCount }) {
  const max = Math.max(doctorsCount, patientsCount, 1);
  const dH = Math.round((doctorsCount / max) * 140);
  const pH = Math.round((patientsCount / max) * 140);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Overview chart
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Doctors vs patients in the system.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-800 ring-1 ring-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            Doctors: {doctorsCount}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 font-semibold text-cyan-800 ring-1 ring-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-600" />
            Patients: {patientsCount}
          </span>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200">
        <svg
          viewBox="0 0 420 220"
          className="h-[220px] w-full"
          role="img"
          aria-label="Bar chart for doctors and patients"
        >
          <rect x="0" y="0" width="420" height="220" fill="#F8FAFC" />

          {/* grid */}
          <g opacity="0.35" stroke="#CBD5E1" strokeWidth="1">
            <line x1="40" y1="30" x2="400" y2="30" />
            <line x1="40" y1="80" x2="400" y2="80" />
            <line x1="40" y1="130" x2="400" y2="130" />
            <line x1="40" y1="180" x2="400" y2="180" />
          </g>

          {/* axis */}
          <g stroke="#94A3B8" strokeWidth="2" opacity="0.8">
            <line x1="40" y1="20" x2="40" y2="190" />
            <line x1="40" y1="190" x2="400" y2="190" />
          </g>

          {/* Doctors bar */}
          <g>
            <rect
              x="110"
              y={190 - dH}
              width="80"
              height={dH}
              rx="16"
              fill="#0D9488"
              opacity="0.9"
            />
            <text
              x="150"
              y="206"
              textAnchor="middle"
              fontSize="12"
              fill="#0F172A"
              opacity="0.8"
            >
              Doctors
            </text>
          </g>

          {/* Patients bar */}
          <g>
            <rect
              x="250"
              y={190 - pH}
              width="80"
              height={pH}
              rx="16"
              fill="#0891B2"
              opacity="0.9"
            />
            <text
              x="290"
              y="206"
              textAnchor="middle"
              fontSize="12"
              fill="#0F172A"
              opacity="0.8"
            >
              Patients
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data, isLoading, error } = useProfile();
  const doctorsQuery = useGetDoctors();
  const patientsQuery = useGetPatients();

  const user = data?.data;
  const { doctors } = parseAdminDoctorsResponse(doctorsQuery.data);
  const { patients } = parseAdminPatientsResponse(patientsQuery.data);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-rose-600">
          Failed to load profile. Please try again.
        </p>
      </div>
    );
  }

  const displayName =
    user && `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : user?.email || "Staff";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome, {displayName}
      </h1>
      <p className="text-sm text-slate-600">
        View doctors, patients, and appointments from the navigation.
      </p>
      {doctorsQuery.isLoading || patientsQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading chart…</p>
      ) : doctorsQuery.error || patientsQuery.error ? (
        <p className="text-sm text-rose-600">Failed to load chart data.</p>
      ) : (
        <MiniBarChart doctorsCount={doctors.length} patientsCount={patients.length} />
      )}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Staff profile</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-semibold text-slate-900">
              {user
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                  user.email
                : "—"}
            </dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-semibold text-slate-900">{user?.email ?? "—"}</dd>
          </div>
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">Phone</dt>
            <dd className="font-semibold text-slate-900">{user?.phone ?? "—"}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-semibold capitalize text-slate-900">
              {user?.role ?? "staff"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

