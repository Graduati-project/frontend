"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  FolderOpen,
  Star,
  Stethoscope,
  User,
  Users,
} from "lucide-react";

export const PATIENT_SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "specialties", label: "Specialties", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "records", label: "Health records", icon: FolderOpen },
  { id: "doctors", label: "My doctors", icon: Users },
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
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={href}
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
            className={`nav-pill ${active ? "nav-pill-active" : "nav-pill-idle"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
