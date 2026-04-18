"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatPersonDisplayName } from "../../../lib/utils";
import { useProfile } from "../../../hooks/use-user";
import { PatientMobileTabs } from "./patient-nav";
import { PatientMainContent } from "./patient-content";

function PatientPageInner() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "profile";
  const { data: profileData } = useProfile();
  const user = profileData?.data;

  const nameFromProfile = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";
  const displayName = user
    ? nameFromProfile
      ? formatPersonDisplayName(user.firstName, user.lastName)
      : user.email
    : null;

  return (
    <div className="space-y-8">
      <div className="portal-card relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-teal-200/50 to-cyan-300/40 blur-2xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700/80">
          Patient portal
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
          Book visits, follow your care, and keep documents in one calm place.
        </p>
      </div>

      <PatientMobileTabs />

      <PatientMainContent section={section} />
    </div>
  );
}

export default function PatientPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
          <p className="text-sm font-medium text-slate-500">Loading your portal…</p>
        </div>
      }
    >
      <PatientPageInner />
    </Suspense>
  );
}
