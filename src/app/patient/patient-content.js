"use client";

import { useProfile } from "../../../hooks/use-user";
import { AppointmentsSection } from "./patient-appointments";
import { DoctorsSection } from "./patient-doctors";
import { SpecialtiesSection } from "./patient-specialties";

function ProfileView({ user }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Your information</h2>
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
            {user?.role ?? "patient"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function PatientMainContent({ section }) {
  const profile = useProfile();
  const user = profile.data?.data;

  if (section === "profile") {
    if (profile.isLoading) {
      return <p className="text-sm text-slate-500">Loading…</p>;
    }
    if (profile.error) {
      return (
        <p className="text-sm text-rose-600">Failed to load profile.</p>
      );
    }
    return <ProfileView user={user} />;
  }

  if (section === "specialties") {
    return <SpecialtiesSection />;
  }

  if (section === "appointments") {
    return <AppointmentsSection />;
  }

  if (section === "doctors") {
    return <DoctorsSection />;
  }

  return null;
}
