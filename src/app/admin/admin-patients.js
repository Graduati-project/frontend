"use client";

import { useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  const searchedPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((patient) => {
      const u =
        patient?.userId && typeof patient.userId === "object"
          ? patient.userId
          : patient;
      const name = getUserDisplayName(u);
      const email = u?.email ?? "";
      const phone = u?.phone ?? "";
      const hay = `${name} ${email} ${phone}`.toLowerCase();
      return hay.includes(q);
    });
  }, [patients, search]);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-600">
            All patients registered in the system.
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
            Showing <span className="font-semibold text-slate-700">{searchedPatients.length}</span>{" "}
            of <span className="font-semibold text-slate-700">{patients.length}</span>
          </p>
        </div>

        {searchedPatients.length === 0 ? (
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
                {searchedPatients.map((p) => (
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
