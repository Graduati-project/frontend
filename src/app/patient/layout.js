import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PatientSidebarNav } from "./patient-nav";

export default function PatientLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white/95 px-5 py-6 shadow-sm md:flex">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <Image
              src="/logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Patient portal</p>
            <p className="text-xs text-slate-500">Manage your account</p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="mt-8 space-y-2">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            </div>
          }
        >
          <PatientSidebarNav />
        </Suspense>

        <div className="mt-auto pt-6">
          <Link
            href="/auth/login"
            className="block rounded-xl bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-700 hover:bg-rose-100"
          >
            Log out
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
