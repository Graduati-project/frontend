"use client";

import { useGetDoctorPatients } from "../../../hooks/use-doctor";
import {
  getPatientDisplayName,
  parseDoctorPatientsResponse,
} from "./doctor-parsers";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return (
      <p className="text-center text-sm text-slate-500">Loading…</p>
    );
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load patients. Please try again.
      </p>
    );
  }
  return children;
}

function DoctorPatientCard({ patient }) {
  const name = getPatientDisplayName(patient);
  const u = patient?.userId && typeof patient.userId === "object"
    ? patient.userId
    : patient;
  const email = u?.email ?? patient?.email;
  const phone = u?.phone ?? patient?.phone;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {email && (
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{email}</dd>
          </div>
        )}
        {phone && (
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <dt className="text-slate-500">Phone</dt>
            <dd className="font-medium text-slate-900">{phone}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

export function DoctorPatientsSection() {
  const query = useGetDoctorPatients();
  const { patients } = parseDoctorPatientsResponse(query.data);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your patients</h2>
          <p className="mt-1 text-sm text-slate-600">
            Patients assigned to your practice.
          </p>
        </div>

        {patients.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No patients yet.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {patients.map((p) => (
              <DoctorPatientCard key={p._id ?? JSON.stringify(p)} patient={p} />
            ))}
          </div>
        )}
      </div>
    </SectionState>
  );
}
