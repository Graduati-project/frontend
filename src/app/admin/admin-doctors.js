"use client";

import { useGetDoctors } from "../../../hooks/use-staff";
import { getUserDisplayName, parseAdminDoctorsResponse } from "./admin-parsers";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return <p className="text-center text-sm text-slate-500">Loading…</p>;
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load doctors. Please try again.
      </p>
    );
  }
  return children;
}

function DoctorRow({ doctor }) {
  const user =
    doctor?.userId && typeof doctor.userId === "object" ? doctor.userId : doctor;
  const specialty =
    doctor?.specialtyId && typeof doctor.specialtyId === "object"
      ? doctor.specialtyId
      : null;

  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 font-medium text-slate-900">
        {getUserDisplayName(user)}
      </td>
      <td className="px-4 py-3 text-slate-700">{user?.email ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">{user?.phone ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">
        {specialty?.name ?? doctor?.specialtyName ?? "—"}
      </td>
    </tr>
  );
}

export function AdminDoctorsSection() {
  const query = useGetDoctors();
  const { doctors } = parseAdminDoctorsResponse(query.data);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Doctors</h1>
          <p className="mt-1 text-sm text-slate-600">
            All doctors registered in the system.
          </p>
        </div>

        {doctors.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No doctors found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[900px] w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Specialty</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <DoctorRow key={d._id ?? JSON.stringify(d)} doctor={d} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionState>
  );
}

