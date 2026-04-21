"use client";

import { useEffect, useId, useMemo, useState } from "react";

const DEFAULT_CARDS = [
  {
    title: "Bring the right medical info",
    body: "Bring previous lab results, imaging, and clinic notes (if any). Write down your main symptoms, when they started, and what makes them better or worse.",
    badge: "Medical history",
    image: "/pexels-jonathanborba-13697728.jpg",
  },
  {
    title: "Medications & allergies",
    body: "Prepare a medication list (name + dose + frequency), including supplements. Tell us about any drug allergies and past reactions.",
    badge: "Safety",
    image: "/pexels-gustavo-fring-3985168.jpg",
  },
  {
    title: "If you’re doing lab tests",
    body: "Follow preparation instructions carefully (for example: fasting, timing, hydration). If you’re unsure, ask before the test to avoid repeating it.",
    badge: "Lab prep",
    image: "/pexels-shvetsa-3845129.jpg",
  },
  {
    title: "Red flags & urgent symptoms",
    body: "Seek emergency care immediately for severe chest pain, trouble breathing, fainting, uncontrolled bleeding, or sudden weakness/numbness.",
    badge: "Urgent care",
    image: "/pexels-jonathanborba-13697927.jpg",
  },
];

export default function InstructionsCarousel({ cards = DEFAULT_CARDS }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderId = useId();

  const safeCards = useMemo(() => {
    if (!Array.isArray(cards) || cards.length === 0) return DEFAULT_CARDS;
    return cards;
  }, [cards]);

  const count = safeCards.length;
  const active = safeCards[activeIdx] ?? safeCards[0];

  const goTo = (idx) => {
    const next = ((idx % count) + count) % count;
    setActiveIdx(next);
  };

  const next = () => goTo(activeIdx + 1);
  const prev = () => goTo(activeIdx - 1);

  useEffect(() => {
    if (isPaused) return undefined;
    const interval = setInterval(() => {
      setActiveIdx((i) => ((i + 1) % count + count) % count);
    }, 5000);
    return () => clearInterval(interval);
  }, [count, isPaused]);

  return (
    <section className="mt-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Medical instructions for patients
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Quick, practical guidance to help you prepare for your visit safely
            and efficiently.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-controls={sliderId}
            className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            aria-controls={sliderId}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          id={sliderId}
          role="group"
          aria-roledescription="carousel"
          aria-label="Patient instructions carousel"
          className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
          tabIndex={0}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-white to-primary/5" />

          <div className="relative p-7 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                {active.badge}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {activeIdx + 1} / {count}
              </span>
            </div>

            <div key={activeIdx} className="hero-fade-up mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {active.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                {active.body}
              </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <div className="relative aspect-16/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {safeCards.map((c, idx) => (
                <button
                  key={`${c.title}-${idx}`}
                  type="button"
                  onClick={() => goTo(idx)}
                  onMouseDown={() => setIsPaused(true)}
                  aria-label={`Go to card ${idx + 1}: ${c.title}`}
                  aria-current={idx === activeIdx ? "true" : undefined}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    idx === activeIdx
                      ? "bg-primary"
                      : "bg-slate-300 hover:bg-slate-400",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {safeCards.slice(0, 3).map((c, idx) => {
            const realIdx = idx;
            const isActive = realIdx === activeIdx;
            return (
              <button
                key={`${c.title}-${idx}-peek`}
                type="button"
                onClick={() => goTo(realIdx)}
                className={[
                  "text-left rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition",
                  isActive
                    ? "ring-primary/30 bg-linear-to-br from-primary/10 to-white"
                    : "hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {c.badge}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {c.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {c.body}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Emergency
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              If symptoms are severe, seek emergency care immediately.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              This guidance is informational and not a substitute for medical
              advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

