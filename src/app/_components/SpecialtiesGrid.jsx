import Link from "next/link";

const SPECIALTIES = [
  {
    title: "Cardiology",
    desc: "Heart checkups, blood pressure, and follow‑ups.",
  },
  {
    title: "Dermatology",
    desc: "Skin concerns, allergies, and treatment plans.",
  },
  {
    title: "Pediatrics",
    desc: "Child care, growth checks, and vaccinations.",
  },
  {
    title: "Orthopedics",
    desc: "Bones, joints, back pain, and injuries.",
  },
  {
    title: "ENT",
    desc: "Ear, nose, throat, and sinus care.",
  },
  {
    title: "Neurology",
    desc: "Headaches, nerves, and neurological follow‑ups.",
  },
];

function SpecialtyIcon() {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20"
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-primary"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21s-7-4.4-9.4-9.1C.8 8.4 3.1 5 6.6 5c2 0 3.3 1.1 4.1 2.2C11.5 6.1 12.8 5 14.8 5c3.5 0 5.8 3.4 4 6.9C19 16.6 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12h2.4l1.1-2.2L13.2 15l1-3h2.3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function SpecialtiesGrid() {
  return (
    <section className="mt-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Departments & specialties
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Pick a specialty and book directly from the patient portal.
          </p>
        </div>
        <Link
          href="/patient?section=specialties"
          className="w-fit rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          Browse specialties
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPECIALTIES.map((s) => (
          <div
            key={s.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-4">
              <SpecialtyIcon />
              <Link
                href="/patient?section=specialties"
                className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Book
              </Link>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {s.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

