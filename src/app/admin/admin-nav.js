"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileStack,
  LayoutDashboard,
  Stethoscope,
  Users,
} from "lucide-react";

export const ADMIN_ROUTES = [
  { href: "/admin", label: "Overview", match: "exact", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctors", match: "prefix", icon: Stethoscope },
  { href: "/admin/patients", label: "Patients", match: "prefix", icon: Users },
  { href: "/admin/appointments", label: "Appointments", match: "prefix", icon: Calendar },
  { href: "/admin/reviews-files", label: "Reviews & files", match: "prefix", icon: FileStack },
];

function isActive(pathname, href, match) {
  if (match === "exact") return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav() {
  const pathname = usePathname() || "";

  return (
    <nav className="mt-8 space-y-1 text-sm font-medium">
      {ADMIN_ROUTES.map((item) => {
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

export function AdminMobileTabs() {
  const pathname = usePathname() || "";

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {ADMIN_ROUTES.map((item) => {
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
