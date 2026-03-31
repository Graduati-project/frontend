 "use client";

import { useProfile } from "../../../hooks/use-user";

export default function AdminPage() {
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
      : user?.email || "Admin";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome, {displayName}
      </h1>
      <p className="text-sm text-slate-600">
        View doctors, patients, and appointments from the navigation.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Admin profile</h2>
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
              {user?.role ?? "admin"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

