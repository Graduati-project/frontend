"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ClipboardList, LayoutDashboard, Users } from "lucide-react";

export const DOCTOR_ROUTES = [
  { href: "/doctor", label: "Overview", match: "exact", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", match: "prefix", icon: Calendar },
  { href: "/doctor/patients", label: "Patients", match: "prefix", icon: Users },
  { href: "/doctor/treatments", label: "Treatments", match: "prefix", icon: ClipboardList },
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
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${active ? "nav-link-active" : ""}`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 ${active ? "opacity-100" : "opacity-70"}`}
              strokeWidth={2}
              aria-hidden
            />
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
            className={`nav-pill ${active ? "nav-pill-active" : "nav-pill-idle"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
