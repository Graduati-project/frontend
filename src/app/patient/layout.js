import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PatientSidebarNav } from "./patient-nav";

export default function PatientLayout({ children }) {
  return (
    <div className="portal-shell flex min-h-screen">
      <aside className="portal-sidebar hidden w-64 shrink-0 flex-col px-5 py-6 md:flex">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-0.5 shadow-inner ring-2 ring-white">
            <div className="relative h-full w-full overflow-hidden rounded-[0.65rem] border border-teal-200/50 bg-white">
              <Image
                src="/logo.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              Patient portal
            </p>
            <p className="text-xs text-slate-500">Care, simplified</p>
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
            className="block rounded-xl border border-rose-200/80 bg-white/80 px-3 py-2.5 text-center text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
          >
            Log out
          </Link>
        </div>
      </aside>

      <main className="portal-main min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
