import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-teal-400/35 blur-3xl" />
        <div className="absolute -bottom-28 right-1/4 h-[560px] w-[560px] rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] bg-size-[18px_18px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-teal-500 shadow-sm ring-1 ring-teal-600/20">
              <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-slate-900">
                Hospital System
              </p>
              <p className="text-xs text-slate-600">Patient Management Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Login
            </a>
            <a
              href="/auth/signup"
              className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
            >
              Create account
            </a>
          </nav>
        </header>

        <section className="mt-14 space-y-14">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-teal-800 ring-1 ring-teal-200/60">
              Smart scheduling • Secure records • Clear workflows
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              A hospital portal that matches your daily workflow.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-700">
              Manage appointments, patient records, and treatments in one place.
              Built for clarity, speed, and day‑to‑day reliability inside a
              clinic workflow.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/auth/login"
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
              >
                Get started
              </a>
              <a
                href="/patient"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Patient portal
              </a>
            </div>

            <div className="grid gap-4 pt-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Appointments
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Book and manage visits quickly.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Treatments
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Track plans with clear date ranges.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  Staff tools
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  See doctors, patients, and schedules.
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Services built for real clinic work
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Two core flows that most hospital users touch every day—designed to be fast, readable, and safe.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative aspect-3/2 bg-linear-to-br from-teal-50 to-cyan-50">
                  <Image
                    src="/landing/service-appointments.svg"
                    alt="Appointments service illustration"
                    fill
                    className="object-cover motion-safe:landing-float"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/70 via-white/0 to-white/0 opacity-90" />
                </div>
                <div className="space-y-2 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    Appointments
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Simple booking, clear schedules
                  </h3>
                  <p className="text-sm text-slate-600">
                    Patients can find availability quickly, while staff and doctors keep a clean view of upcoming visits.
                  </p>
                </div>
              </div>

              <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative aspect-3/2 bg-linear-to-br from-cyan-50 to-teal-50">
                  <Image
                    src="/landing/service-treatments.svg"
                    alt="Treatments service illustration"
                    fill
                    className="object-cover motion-safe:landing-float-slow"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/70 via-white/0 to-white/0 opacity-90" />
                </div>
                <div className="space-y-2 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    Treatments
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Treatment plans with date ranges
                  </h3>
                  <p className="text-sm text-slate-600">
                    Doctors record treatments and updates in seconds, with a timeline that’s easy to audit and follow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Quick instructions
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Follow these steps to use the system smoothly.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  Patient
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Book and manage appointments
                </h3>
                <ol className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                      1
                    </span>
                    <span>
                      Create an account, then login to the patient portal.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                      2
                    </span>
                    <span>
                      Open <strong>Specialties</strong>, pick a specialty, then choose a doctor.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                      3
                    </span>
                    <span>
                      Book an appointment, then track status in <strong>Appointments</strong>.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                      4
                    </span>
                    <span>
                      If needed, cancel from the appointment card and re-book.
                    </span>
                  </li>
                </ol>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  Doctor
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Review visits and treatments
                </h3>
                <ol className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      1
                    </span>
                    <span>
                      Login, then open <strong>Appointments</strong> to view your schedule.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      2
                    </span>
                    <span>
                      Update appointment status (confirmed / cancelled / completed).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      3
                    </span>
                    <span>
                      Go to <strong>Treatments</strong> to add treatments with start/end dates.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                      4
                    </span>
                    <span>
                      Use the treatments table to click any row and update it.
                    </span>
                  </li>
                </ol>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Staff (Admin)
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  Monitor system data
                </h3>
                <ol className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      1
                    </span>
                    <span>
                      Login as staff and open the admin panel.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      2
                    </span>
                    <span>
                      View <strong>Doctors</strong>, <strong>Patients</strong>, and <strong>Appointments</strong>.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      3
                    </span>
                    <span>
                      Use tables to quickly audit activity across the system.
                    </span>
                  </li>
                </ol>
              </div>
            </div>

          </div>
        </section>

        <footer className="mt-14 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hospital System</p>
        
        </footer>
      </div>

    </main>
  );
}
