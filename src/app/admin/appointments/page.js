"use client";

import { Suspense } from "react";
import { AdminMobileTabs } from "../admin-nav";
import { AdminAppointmentsSection } from "../admin-appointments";

export default function AdminAppointmentsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <AdminMobileTabs />
      <AdminAppointmentsSection />
    </Suspense>
  );
}

