"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPersonDisplayName } from "../../../lib/utils";
import { getPublicDoctorDetails, getPublicDoctors } from "../../../services/public";

const FALLBACK_IMAGES = [
  "/pexels-andre-124356440-11722768.jpg",
  "/pexels-gorden-murah-surabaya-28799425-7250788.jpg",
  "/pexels-karola-g-4386492.jpg",
  "/pexels-jonathanborba-13697927.jpg",
];

const DOCTOR_IMAGE_BY_GENDER = {
  male: "/pexels-rdne-6129105.jpg",
  female: "/pexels-gustavo-fring-4173251.jpg",
};

function doctorImageForGender(gender, fallbackIndex = 0) {
  const g = String(gender || "").toLowerCase();
  return (
    DOCTOR_IMAGE_BY_GENDER[g] ||
    DOCTOR_IMAGE_BY_GENDER.male ||
    FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length]
  );
}

function normalizeDoctors(payload) {
  const list =
    payload?.data?.doctors ??
    payload?.data ??
    payload?.doctors ??
    payload ??
    [];

  if (!Array.isArray(list)) return [];

  return list.map((d, i) => {
    const id = d?._id ?? d?.id ?? d?.doctorId ?? String(i);
    const specialty =
      d?.specialtyId?.name ??
      d?.specialty?.name ??
      d?.specialtyName ??
      d?.specialty ??
      d?.department ??
      "Doctor";

    const user = d?.userId;
    const name =
      d?.name ??
      (user && typeof user === "object"
        ? formatPersonDisplayName(user?.firstName, user?.lastName)
        : null) ??
      formatPersonDisplayName(d?.firstName, d?.lastName) ??
      d?.email ??
      "Doctor";

    // Gender-based doctor image (as requested)
    const image = doctorImageForGender(user?.gender ?? d?.gender, i);

    return {
      id: String(id),
      name,
      specialty,
      image,
      raw: d,
    };
  });
}

function normalizeDoctorDetails(payload) {
  const d =
    payload?.data?.doctor ??
    payload?.doctor ??
    payload?.data ??
    payload ??
    null;
  if (!d || typeof d !== "object") return null;

  const user = d?.userId;
  const name =
    d?.name ??
    (user && typeof user === "object"
      ? formatPersonDisplayName(user?.firstName, user?.lastName)
      : null) ??
    formatPersonDisplayName(d?.firstName, d?.lastName) ??
    d?.email;

  const specialty =
    d?.specialtyId?.name ??
    d?.specialty?.name ??
    d?.specialtyName ??
    d?.specialty ??
    d?.department;

  return {
    name,
    specialty,
    gender: user?.gender ?? d?.gender,
    email: user?.email ?? d?.email,
    phone: user?.phone ?? d?.phone ?? d?.phoneNumber,
    bio: d?.bio ?? d?.about ?? d?.description,
    schedule: Array.isArray(d?.specialtyId?.schedule) ? d.specialtyId.schedule : [],
    maxAppointmentsPerDay: d?.specialtyId?.maxAppointmentsPerDay ?? null,
    raw: d,
  };
}

function formatDayLabel(day) {
  const d = String(day || "").toLowerCase();
  const map = {
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
  };
  return map[d] || day || "—";
}

export default function DoctorsSpotlight({ doctors = [] }) {
  const [remoteDoctors, setRemoteDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [details, setDetails] = useState(null);

  const safeDoctors = useMemo(() => {
    if (remoteDoctors.length > 0) return remoteDoctors;
    if (!Array.isArray(doctors) || doctors.length === 0) return [];
    return doctors.map((d, i) => ({
      id: d?.id ?? d?._id ?? String(i),
      name: d?.name ?? d?.fullName ?? "Doctor",
      specialty: d?.specialty ?? "Doctor",
      image: d?.image ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      raw: d,
    }));
  }, [doctors, remoteDoctors]);

  const count = safeDoctors.length;
  const active = safeDoctors[idx] ?? safeDoctors[0];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError("");

    getPublicDoctors()
      .then((data) => {
        if (!mounted) return;
        setRemoteDoctors(normalizeDoctors(data));
      })
      .catch((err) => {
        if (!mounted) return;
        setLoadError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load doctors.",
        );
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    if (count <= 1) return undefined;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % count);
    }, 4500);
    return () => clearInterval(interval);
  }, [count, paused]);

  async function openDoctor(d) {
    if (!d?.id) return;
    setPaused(true);
    setOpen(true);
    setSelected(d);
    setDetails(null);
    setDetailsError("");
    setDetailsLoading(true);
    try {
      const data = await getPublicDoctorDetails(d.id);
      setDetails(normalizeDoctorDetails(data));
    } catch (err) {
      setDetailsError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load doctor details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <section className="mt-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Doctors spotlight
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A quick look at available doctors—browse and book from the portal.
          </p>
        </div>
      
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-video bg-slate-100">
            {active?.image ? (
              <Image
                src={active.image}
                alt={active.name || "Doctor"}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 720px, 100vw"
                priority={false}
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/45 via-slate-950/0 to-transparent" />
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-6 w-64 animate-pulse rounded bg-slate-100" />
                <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : count === 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  No doctors available right now.
                </p>
                {loadError ? (
                  <p className="text-xs text-slate-600">{loadError}</p>
                ) : (
                  <p className="text-xs text-slate-600">
                    Please check again later.
                  </p>
                )}
              </div>
            ) : (
              <div key={idx} className="hero-fade-up">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {active.specialty}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {active.name}
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openDoctor(active)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    View details
                  </button>
                  <Link
                    href="/patient?section=doctors"
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Book an appointment
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIdx((i) => (i + 1) % count)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          {safeDoctors.map((d, i) => {
            const activeCard = i === idx;
            return (
              <button
                key={`${d.name}-${i}`}
                type="button"
                onClick={() => setIdx(i)}
                aria-current={activeCard ? "true" : undefined}
                className={[
                  "flex items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition",
                  activeCard
                    ? "ring-primary/30 bg-linear-to-br from-primary/10 to-white"
                    : "hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  {d.image ? (
                    <Image
                      src={d.image}
                      alt={d.name || "Doctor"}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {d.specialty}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                    {d.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center  backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Doctor details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
              setPaused(false);
            }
          }}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-xl ring-1 ring-slate-200">
            {/* Header */}
            <div className="relative overflow-hidden border-b border-slate-200">
              <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-white to-primary/10" />
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />

              <div className="relative flex items-start justify-between gap-4 px-6 py-5">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Doctor profile
                    </p>
                    <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                      {selected?.name}
                    </p>
                    {details?.specialty ? (
                      <p className="mt-1 text-sm text-slate-600">
                        {details.specialty}
                      </p>
                    ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setPaused(false);
                  }}
                  className="rounded-2xl bg-white/80 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 backdrop-blur transition hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="grid gap-6 px-6 py-6 sm:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
                  {selected?.image ? (
                    <Image
                      src={selected.image}
                      alt={selected?.name || "Doctor"}
                      fill
                      className="object-contain"
                    />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/15 via-transparent to-transparent" />
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-900">Email</span>
                      <span className="truncate">{details?.email || "—"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-900">Phone</span>
                      <span className="truncate">{details?.phone || "—"}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {detailsLoading ? (
                  <div className="space-y-3">
                    <div className="h-5 w-44 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
                    <div className="h-28 w-full animate-pulse rounded-3xl bg-slate-100" />
                  </div>
                ) : detailsError ? (
                  <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                    <p className="text-sm font-semibold text-slate-900">
                      Couldn’t load details
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{detailsError}</p>
                  </div>
                ) : details ? (
                  <>
                    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Overview
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {details.gender ? (
                          <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            Gender: {String(details.gender).toLowerCase()}
                          </span>
                        ) : null}
                        {typeof details.maxAppointmentsPerDay === "number" ? (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                            Max/day: {details.maxAppointmentsPerDay}
                          </span>
                        ) : null}
                        {details.schedule?.length ? (
                          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            Days: {details.schedule.length}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {Array.isArray(details.schedule) && details.schedule.length ? (
                      <div className="rounded-3xl bg-white ring-1 ring-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Weekly schedule
                          </p>
                          <span className="text-xs font-semibold text-slate-500">
                            Local time
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200">
                          {details.schedule.map((s, i) => (
                            <div
                              key={`${s?.day || "day"}-${i}`}
                              className="flex items-center justify-between gap-3 px-5 py-4"
                            >
                              <p className="text-sm font-semibold text-slate-900">
                                {formatDayLabel(s?.day)}
                              </p>
                              <p className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">
                                  {s?.startTime || "—"}
                                </span>{" "}
                                –{" "}
                                <span className="font-semibold text-slate-900">
                                  {s?.endTime || "—"}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                        <p className="text-sm font-semibold text-slate-900">
                          Schedule not available
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          Please book from the patient portal to see available
                          slots.
                        </p>
                      </div>
                    )}

                    {details.bio ? (
                      <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          About
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                          {details.bio}
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-600">
                      Select a doctor to view details.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Booking is available in the patient portal.
              </p>
              <Link
                href="/patient?section=doctors"
                className="inline-flex w-full justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
              >
                Book in Patient Portal
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

