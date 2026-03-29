"use client";

import { Suspense } from "react";
import { DoctorMobileTabs } from "../doctor-nav";
import { DoctorTreatmentsSection } from "../doctor-treatments";

export default function DoctorTreatmentsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <DoctorMobileTabs />
      <DoctorTreatmentsSection />
    </Suspense>
  );
}
