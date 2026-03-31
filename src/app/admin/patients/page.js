"use client";

import { Suspense } from "react";
import { AdminMobileTabs } from "../admin-nav";
import { AdminPatientsSection } from "../admin-patients";

export default function AdminPatientsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <AdminMobileTabs />
      <AdminPatientsSection />
    </Suspense>
  );
}

