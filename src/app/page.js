"use client";

import Image from "next/image";
import InstructionsCarousel from "./_components/InstructionsCarousel";
import SpecialtiesGrid from "./_components/SpecialtiesGrid";
import DoctorsSpotlight from "./_components/DoctorsSpotlight";
import Testimonials from "./_components/Testimonials";
import Faq from "./_components/Faq";
import Reveal from "./_components/Reveal";
import { useState } from "react";

const HERO_STATS = [
  { value: "20+", label: "Specialties" },
  { value: "150+", label: "Expert doctors" },
  { value: "24/7", label: "Care access" },
  { value: "98%", label: "Satisfaction" },
];

const SERVICE_FEATURES = [
  {
    eyebrow: "Appointments",
    title: "Book in minutes",
    body: "Choose a specialty, pick a doctor, and reserve a time that works for you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M8 2v3M16 2v3M3.5 9.5h17M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    eyebrow: "Specialties",
    title: "Right care, right doctor",
    body: "Browse departments and find a specialist who matches your condition.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 21s-7-4.4-9.4-9.1C.8 8.4 3.1 5 6.6 5c2 0 3.3 1.1 4.1 2.2C11.5 6.1 12.8 5 14.8 5c3.5 0 5.8 3.4 4 6.9C19 16.6 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    eyebrow: "Visit guidance",
    title: "Arrive prepared",
    body: "Practical checklists for documents, prior tests, and medications.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M9 11l2 2 4-4M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5v-11Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    eyebrow: "Follow‑up",
    title: "Stay on track",
    body: "Track appointment status and instructions in one calm place.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 8v4l2.5 2.5M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up once, then use your account to manage every visit.",
  },
  {
    n: "02",
    title: "Choose specialty & doctor",
    body: "Find the right clinic and a doctor, then select an available time.",
  },
  {
    n: "03",
    title: "Arrive prepared",
    body: "Bring your documents and reports. Arrive 15 minutes early.",
  },
];

const COPY = {
  en: {
    navSpecialties: "Specialties",
    navDoctors: "Doctors",
    navHow: "How it works",
    navFaq: "FAQ",
    signIn: "Sign in",
    patientPortal: "Patient Portal",
    trust: "Trusted care, simply organized",
    heroTitle1: "Your care journey,",
    heroTitle2: "made simpler.",
    heroBody:
      "Book appointments, pick the right doctor, and prepare for your visit—all from one calm, modern portal.",
    openPortal: "Open Patient Portal",
    browseSpecialties: "Browse specialties",
    appointmentConfirmed: "Appointment confirmed",
    statsSpecialties: "Specialties",
    statsDoctors: "Expert doctors",
    statsCare: "Care access",
    statsSatisfaction: "Satisfaction",
    sectionWhat: "What you can do",
    sectionEverything: "Everything you need for a smoother visit",
    sectionEverythingBody:
      "A modern patient portal built around the steps that matter—book, prepare, attend, and follow up.",
    sectionHow: "How it works",
    sectionThree: "Three steps to your next visit",
    sectionThreeBody: "A clear, simple flow from booking to arrival.",
    ctaEyebrow: "Get started",
    ctaTitle: "Ready to book your next visit?",
    ctaBody:
      "Open the patient portal to choose a specialty, pick a doctor, and reserve a time that works for you.",
    createAccount: "Create account",
    emergency:
      "For emergencies, please go to the nearest emergency department immediately.",
    footerText:
      "A modern way to book appointments, find the right specialist, and stay on top of your visits and care instructions.",
    explore: "Explore",
    account: "Account",
    rights: "All rights reserved.",
    slogan: "Care, simplified.",
    viewAll: "View all",
  },
  ar: {
    navSpecialties: "التخصصات",
    navDoctors: "الأطباء",
    navHow: "طريقة الاستخدام",
    navFaq: "الأسئلة الشائعة",
    signIn: "تسجيل الدخول",
    patientPortal: "بوابة المريض",
    trust: "رعاية موثوقة بطريقة أبسط",
    heroTitle1: "رحلة علاجك",
    heroTitle2: "أصبحت أسهل.",
    heroBody:
      "احجز المواعيد، واختر الطبيب المناسب، واستعد لزيارتك من خلال بوابة واحدة منظمة وحديثة.",
    openPortal: "افتح بوابة المريض",
    browseSpecialties: "استعرض التخصصات",
    appointmentConfirmed: "تم تأكيد الموعد",
    statsSpecialties: "تخصص",
    statsDoctors: "طبيب خبير",
    statsCare: "وصول للرعاية",
    statsSatisfaction: "رضا المرضى",
    sectionWhat: "ماذا يمكنك أن تفعل",
    sectionEverything: "كل ما تحتاجه لزيارة أكثر سلاسة",
    sectionEverythingBody:
      "بوابة مرضى حديثة مبنية على الخطوات الأهم: الحجز، الاستعداد، الزيارة، والمتابعة.",
    sectionHow: "طريقة الاستخدام",
    sectionThree: "3 خطوات لزيارتك القادمة",
    sectionThreeBody: "تدفق واضح وبسيط من الحجز وحتى الحضور.",
    ctaEyebrow: "ابدأ الآن",
    ctaTitle: "جاهز لحجز زيارتك القادمة؟",
    ctaBody:
      "افتح بوابة المريض لاختيار التخصص والطبيب، ثم احجز الموعد المناسب لك.",
    createAccount: "إنشاء حساب",
    emergency: "في حالات الطوارئ، توجه لأقرب قسم طوارئ فورًا.",
    footerText:
      "طريقة حديثة لحجز المواعيد، والوصول للطبيب المناسب، ومتابعة زياراتك وتعليمات الرعاية بسهولة.",
    explore: "استكشف",
    account: "الحساب",
    rights: "جميع الحقوق محفوظة.",
    slogan: "رعاية أبسط.",
    viewAll: "عرض الكل",
  },
};

function SectionHeader({ eyebrow, title, subtitle, align = "left" }) {
  const wrap = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${wrap}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const t = COPY.en;
  const isDark = theme === "dark";

  const heroStats = [
    { value: "20+", label: t.statsSpecialties },
    { value: "150+", label: t.statsDoctors },
    { value: "24/7", label: t.statsCare },
    { value: "98%", label: t.statsSatisfaction },
  ];

  return (
    <main
      dir="ltr"
      className={`relative min-h-screen overflow-hidden ${isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px]">
        <div className="absolute -top-32 left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-10%] top-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] bg-size-[22px_22px]" />
      </div>

      {/* Sticky glass header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <Image
                src="/logo.jpg"
                alt="Hospital logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Hospital
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.patientPortal}</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
            <a href="#specialties" className="hover:text-slate-900 dark:hover:text-white">
              {t.navSpecialties}
            </a>
            <a href="#doctors" className="hover:text-slate-900 dark:hover:text-white">
              {t.navDoctors}
            </a>
            <a href="#how" className="hover:text-slate-900 dark:hover:text-white">
              {t.navHow}
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white">
              {t.navFaq}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme((m) => (m === "light" ? "dark" : "light"))}
              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M12 3v2.2M12 18.8V21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M3 12h2.2M18.8 12H21M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M21 14.7A8.7 8.7 0 1 1 9.3 3a7 7 0 1 0 11.7 11.7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <a
              href="/auth/login"
              className="hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700 sm:inline-flex"
            >
              {t.signIn}
            </a>
            <a
              href="/patient"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:opacity-90"
            >
              {t.patientPortal}
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid gap-10 pt-14 pb-20 sm:pt-20 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="space-y-7 scroll-fade">
            <p className="hero-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20 dark:bg-slate-900 dark:ring-primary/30">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              {t.trust}
            </p>

            <h1 className="hero-fade-up hero-fade-up-delay-1 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
              {t.heroTitle1}
              <br className="hidden sm:block" />
              <span className="text-primary">{t.heroTitle2}</span>
            </h1>

            <p className="hero-fade-up hero-fade-up-delay-2 max-w-xl text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {t.heroBody}
            </p>

            <div className="hero-fade-up hero-fade-up-delay-3 flex flex-wrap items-center gap-3 pt-1">
              <a
                href="/patient"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:opacity-90"
              >
                {t.openPortal}
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M4 10h12m0 0-4-4m4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#specialties"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                {t.browseSpecialties}
              </a>
            </div>

            {/* Inline trust strip */}
            <dl className="hero-fade-up hero-fade-up-delay-3 grid max-w-lg grid-cols-4 gap-4 pt-6">
              {heroStats.map((s) => (
                <div key={s.label} className="space-y-1">
                  <dt className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                    {s.value}
                  </dt>
                  <dd className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero visual */}
          <div className="relative scroll-fade">
            <div className="absolute -inset-6 -z-10 rounded-[2.75rem] bg-primary/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="relative aspect-4/5 sm:aspect-4/3 lg:aspect-4/5">
                <Image
                  src="/interior-view-operating-room.jpg"
                  alt="Hospital facility"
                  fill
                  className="object-cover motion-safe:hero-kenburns"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/45 via-slate-950/0 to-transparent" />
              </div>

              {/* Floating mini-card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/90 dark:ring-slate-700 sm:bottom-6 sm:left-6 sm:right-auto sm:w-72">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="M9 12.5l2 2 4-4M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5v-11Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {t.appointmentConfirmed}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Dr. Sara Mohamed · 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services / features */}
        <Reveal as="section" className="pb-16 sm:pb-20">
          <SectionHeader
            eyebrow={t.sectionWhat}
            title={t.sectionEverything}
            subtitle={t.sectionEverythingBody}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md scroll-fade dark:bg-slate-900 dark:ring-slate-800"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  {f.icon}
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-200">
                  {f.eyebrow}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-100">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Specialties */}
        <div id="specialties">
          <Reveal as="div">
            <SpecialtiesGrid />
          </Reveal>
        </div>

        {/* Doctors */}
        <div id="doctors">
          <Reveal as="div">
            <DoctorsSpotlight />
          </Reveal>
        </div>

        {/* How it works */}
        <Reveal as="section" id="how" className="mt-20">
          <SectionHeader
            eyebrow={t.sectionHow}
            title={t.sectionThree}
            subtitle={t.sectionThreeBody}
          />

          <div className="relative mt-8">
            <div
              className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-linear-to-r from-transparent via-primary/30 to-transparent lg:block"
              aria-hidden
            />
            <div className="relative grid gap-6 lg:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 scroll-fade dark:bg-slate-900 dark:ring-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white shadow-sm shadow-primary/20">
                    {s.n}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-100">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Patient instructions */}
        <Reveal as="div">
          <InstructionsCarousel />
        </Reveal>

        {/* Testimonials */}
        <Reveal as="div">
          <Testimonials />
        </Reveal>

        {/* FAQ */}
        <div id="faq">
          <Reveal as="div">
            <Faq />
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal as="section" className="mt-20 mb-16">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary to-primary/80 p-10 shadow-xl shadow-primary/20 sm:p-14 scroll-fade">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div className="text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  {t.ctaEyebrow}
                </p>
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {t.ctaTitle}
                </h2>
                <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
                  {t.ctaBody}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <a
                  href="/patient"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-slate-50"
                >
                  {t.openPortal}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path
                      d="M4 10h12m0 0-4-4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="/auth/signup"
                  className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/15"
                >
                  {t.createAccount}
                </a>
              </div>
            </div>

            <p className="relative mt-8 text-xs text-white/75">
              {t.emergency}
            </p>
          </div>
        </Reveal>

        {/* Footer */}
        <footer className="border-t border-slate-200 pb-10 pt-10 dark:border-slate-800">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <Image
                    src="/logo.jpg"
                    alt="Hospital logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Hospital · Patient Portal
                </p>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-white">
                A modern way to book appointments, find the right specialist,
                and stay on top of your visits and care instructions.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white">
                {t.explore}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-white">
                <li>
                  <a href="#specialties" className="hover:text-slate-900 dark:hover:text-white">
                    Specialties
                  </a>
                </li>
                <li>
                  <a href="#doctors" className="hover:text-slate-900 dark:hover:text-white">
                    Doctors
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-slate-900 dark:hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-slate-900 dark:hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white">
                {t.account}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-white">
                <li>
                  <a href="/patient" className="hover:text-slate-900 dark:hover:text-white">
                    Patient portal
                  </a>
                </li>
                <li>
                  <a href="/auth/login" className="hover:text-slate-900 dark:hover:text-white">
                    Sign in
                  </a>
                </li>
                <li>
                  <a href="/auth/signup" className="hover:text-slate-900 dark:hover:text-white">
                    Create account
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-white sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Hospital · {t.rights}</p>
            <p>{t.slogan}</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
