"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProfile } from "../../../hooks/use-user";
import { PatientMobileTabs } from "./patient-nav";
import { PatientMainContent } from "./patient-content";

function PatientPageInner() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "profile";
  const { data: profileData } = useProfile();
  const user = profileData?.data;

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome, {displayName ?? "…"}
      </h1>

      <PatientMobileTabs />

      <PatientMainContent section={section} />
    </div>
  );
}

export default function PatientPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      }
    >
      <PatientPageInner />
    </Suspense>
  );
}
