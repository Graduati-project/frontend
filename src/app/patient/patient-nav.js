"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const PATIENT_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "specialties", label: "Specialties" },
  { id: "appointments", label: "Appointments" },
  { id: "doctors", label: "My doctors" },
];

export function PatientSidebarNav() {
  const searchParams = useSearchParams();
  const current = searchParams.get("section") || "profile";

  return (
    <nav className="mt-8 space-y-1 text-sm font-medium">
      {PATIENT_SECTIONS.map((item) => {
        const active = current === item.id;
        const href =
          item.id === "profile" ? "/patient" : `/patient?section=${item.id}`;
        return (
          <Link
            key={item.id}
            href={href}
            className={`flex w-full items-center rounded-xl px-3 py-2.5 transition-colors ${
              active
                ? "bg-slate-900 text-slate-50"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PatientMobileTabs() {
  const searchParams = useSearchParams();
  const current = searchParams.get("section") || "profile";

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {PATIENT_SECTIONS.map((item) => {
        const active = current === item.id;
        const href =
          item.id === "profile" ? "/patient" : `/patient?section=${item.id}`;
        return (
          <Link
            key={item.id}
            href={href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
