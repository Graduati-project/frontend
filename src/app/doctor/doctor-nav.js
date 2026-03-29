"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const DOCTOR_ROUTES = [
  { href: "/doctor", label: "Overview", match: "exact" },
  { href: "/doctor/appointments", label: "Appointments", match: "prefix" },
  { href: "/doctor/patients", label: "Patients", match: "prefix" },
  { href: "/doctor/treatments", label: "Treatments", match: "prefix" },
];

function isActive(pathname, href, match) {
  if (match === "exact") {
    return pathname === href || pathname === `${href}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DoctorSidebarNav() {
  const pathname = usePathname() || "";

  return (
    <nav className="mt-8 space-y-1 text-sm font-medium">
      {DOCTOR_ROUTES.map((item) => {
        const active = isActive(pathname, item.href, item.match);
        return (
          <Link
            key={item.href}
            href={item.href}
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

export function DoctorMobileTabs() {
  const pathname = usePathname() || "";

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {DOCTOR_ROUTES.map((item) => {
        const active = isActive(pathname, item.href, item.match);
        return (
          <Link
            key={item.href}
            href={item.href}
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
