"use client";

import { useGetPatients } from "../../../hooks/use-staff";
import { getUserDisplayName, parseAdminPatientsResponse } from "./admin-parsers";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return <p className="text-center text-sm text-slate-500">Loading…</p>;
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

function PatientRow({ patient }) {
  const user =
    patient?.userId && typeof patient.userId === "object"
      ? patient.userId
      : patient;
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 font-medium text-slate-900">
        {getUserDisplayName(user)}
      </td>
      <td className="px-4 py-3 text-slate-700">{user?.email ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">{user?.phone ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700 capitalize">
        {user?.role ?? "patient"}
      </td>
    </tr>
  );
}

export function AdminPatientsSection() {
  const query = useGetPatients();
  const { patients } = parseAdminPatientsResponse(query.data);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-600">
            All patients registered in the system.
          </p>
        </div>

        {patients.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No patients found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[800px] w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <PatientRow key={p._id ?? JSON.stringify(p)} patient={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionState>
  );
}

