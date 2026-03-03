 "use client";

import { useProfile } from "../../../hooks/use-user";

export default function DoctorPage() {
  const { data, isLoading, error } = useProfile();

  const user = data?.data;

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
      : user?.email || "Doctor";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome, {displayName}
      </h1>
      <p className="text-sm text-slate-600">
        Here you can manage your patients, appointments, and records.
      </p>
    </div>
  );
}


