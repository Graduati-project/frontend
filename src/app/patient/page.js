"use client";

import { useProfile } from "../../../hooks/use-user";

export default function PatientPage() {
  const { data, isLoading, error } = useProfile();

  const user = data?.data; 

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading your data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-rose-600">
          Failed to load profile. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome,{" "}
        {user
          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
          : "Patient"}
      </h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Your Information
        </h2>
        <dl className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium">
              {user
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                  user.email
                : "-"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{user?.email || "-"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Phone</dt>
            <dd className="font-medium">{user?.phone || "-"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium capitalize">
              {user?.role || "patient"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
