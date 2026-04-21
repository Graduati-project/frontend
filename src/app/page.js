import Image from "next/image";
import InstructionsCarousel from "./_components/InstructionsCarousel";
import SpecialtiesGrid from "./_components/SpecialtiesGrid";
import DoctorsSpotlight from "./_components/DoctorsSpotlight";
import Testimonials from "./_components/Testimonials";
import Faq from "./_components/Faq";
import Reveal from "./_components/Reveal";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-44 right-0 h-[820px] w-[820px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] bg-size-[18px_18px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <Image
                src="/logo.jpg"
                alt="Hospital logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide text-slate-900">
                Hospital Patient Portal
              </p>
              <p className="text-xs text-slate-600">
                Appointments, services, and visit guidance
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-200 transition hover:bg-primary/90"
            >
              Sign in
            </a>
            <a
              href="/auth/signup"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Create account
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="mt-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm ring-1 ring-slate-200">
            <div className="relative aspect-16/7 sm:aspect-16/6">
              <Image
                src="/interior-view-operating-room.jpg"
                alt="Hospital facility"
                fill
                className="object-cover motion-safe:hero-kenburns"
                priority
              />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-6 text-center">
            <p className="hero-fade-up mx-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
              Book faster • Arrive prepared • Get clearer care
            </p>
        
            <p className="hero-fade-up hero-fade-up-delay-2 mx-auto max-w-2xl text-pretty text-base leading-relaxed text-slate-700">
              Use the patient portal to book an appointment, choose a specialty
              and doctor, and keep track of your upcoming visits. You’ll also
              find simple guidance to help you prepare and save time at check‑in.
            </p>

            <div className="hero-fade-up hero-fade-up-delay-3 flex flex-wrap justify-center gap-3 pt-1">
              <a
                href="/patient"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Open Patient Portal
              </a>
              <a
                href="/auth/login"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Sign in
              </a>
            </div>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              <div className="hero-fade-up hero-fade-up-delay-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold text-slate-700">
                  Check‑in tip
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Arrive 15 minutes early.
                </p>
              </div>
              <div className="hero-fade-up hero-fade-up-delay-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold text-slate-700">
                  Bring with you
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  ID, insurance, prior reports.
                </p>
              </div>
              <div className="hero-fade-up hero-fade-up-delay-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold text-slate-700">
                  Medication list
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Names + doses (if any).
                </p>
              </div>
            </div>
          </div>
        </section>

        <Reveal as="div">
          <InstructionsCarousel />
        </Reveal>

        <Reveal as="div">
          <SpecialtiesGrid />
        </Reveal>

        <Reveal as="div">
          <DoctorsSpotlight />
        </Reveal>

        <Reveal as="div">
          <Testimonials />
        </Reveal>

        <Reveal as="div">
          <Faq />
        </Reveal>

        {/* Services */}
        <Reveal as="section" className="mt-14 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Hospital services made easier to access
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Everything here is designed for patients—clear steps, quick access,
              and helpful guidance.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="relative aspect-3/2 bg-linear-to-br from-primary/10 to-primary/5">
                <Image
                  src="/pexels-rdne-6129045.jpg"
                  alt="Appointments"
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/75 via-white/0 to-white/0 opacity-90" />
              </div>
              <div className="space-y-2 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Appointments
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Book in minutes, track with confidence
                </h3>
                <p className="text-sm text-slate-600">
                  Choose a specialty, pick a doctor, and reserve a time—then
                  review your appointment status anytime.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="relative aspect-3/2 bg-linear-to-br from-primary/10 to-primary/5">
                <Image
                  src="/pexels-shvetsa-3845129.jpg"
                  alt="Care guidance"
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/75 via-white/0 to-white/0 opacity-90" />
              </div>
              <div className="space-y-2 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Visit guidance
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Prepare well and save time
                </h3>
                <p className="text-sm text-slate-600">
                  Simple checklists for documents, prior tests, and medication
                  details—so your visit is smoother and more productive.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* How it works */}
        <Reveal as="section" className="mt-14 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A simple flow from booking to arrival.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step 1
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Create your account
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Sign up once, then use your account to manage visits anytime.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Step 2
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Choose specialty & doctor
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Pick the right clinic and a doctor, then select an available
                appointment time.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Step 3
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Arrive prepared
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Bring your documents and previous reports. Arrive 15 minutes
                early for check‑in.
              </p>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal as="section" className="mt-14">
          <div className="overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/25 via-white to-primary/15 p-1 ring-1 ring-primary/20">
            <div className="rounded-[2.35rem] bg-white p-8 shadow-sm sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Ready to book your next visit?
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Open the patient portal to choose a specialty, pick a doctor,
                    and reserve a time that works for you.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/patient"
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Open Patient Portal
                  </a>
                  <a
                    href="/auth/signup"
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Create account
                  </a>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500">
                For emergencies, please go to the nearest emergency department
                immediately.
              </p>
            </div>
          </div>
        </Reveal>

        <footer className="mt-14 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hospital</p>
          <p>Patient Portal</p>
        </footer>
      </div>
    </main>
  );
}
