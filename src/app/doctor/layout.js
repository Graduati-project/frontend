import Image from "next/image";
import Link from "next/link";

export default function DoctorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white/95 px-5 py-6 shadow-sm md:flex">
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
            <p className="text-sm font-semibold text-slate-900">Doctor Portal</p>
            <p className="text-xs text-slate-500">Manage your patients</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1 text-sm font-medium text-slate-600">
          <Link
            href="/doctor"
            className="flex items-center justify-between rounded-xl px-3 py-2 bg-slate-900 text-slate-50"
          >
            <span>Overview</span>
          </Link>
          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-slate-500 hover:bg-slate-100"
          >
            Patients
          </button>
          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-slate-500 hover:bg-slate-100"
          >
            Schedule
          </button>
        </nav>

        <div className="mt-auto pt-6">
          <Link
            href="/auth/login"
            className="block rounded-xl bg-rose-50 px-3 py-2 text-center text-xs font-semibold text-rose-700 hover:bg-rose-100"
          >
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}

