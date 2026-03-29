"use client";

import { Suspense } from "react";
import { DoctorAppointmentsSection } from "../doctor-appointments";
import { DoctorMobileTabs } from "../doctor-nav";

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <DoctorMobileTabs />
      <DoctorAppointmentsSection />
    </Suspense>
  );
}
