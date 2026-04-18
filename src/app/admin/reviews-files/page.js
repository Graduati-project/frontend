"use client";

import { Suspense } from "react";
import { AdminMobileTabs } from "../admin-nav";
import { AdminReviewsAndFilesSection } from "../admin-reviews-files";

export default function AdminReviewsFilesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <AdminMobileTabs />
      <AdminReviewsAndFilesSection />
    </Suspense>
  );
}
