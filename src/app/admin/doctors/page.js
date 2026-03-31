"use client";

import { Suspense } from "react";
import { AdminMobileTabs } from "../admin-nav";
import { AdminDoctorsSection } from "../admin-doctors";

export default function AdminDoctorsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <AdminMobileTabs />
      <AdminDoctorsSection />
    </Suspense>
  );
}

