"use client";

import { Suspense } from "react";
import { DoctorMobileTabs } from "../doctor-nav";
import { DoctorPatientsSection } from "../doctor-patients";

export default function DoctorPatientsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <DoctorMobileTabs />
      <DoctorPatientsSection />
    </Suspense>
  );
}
