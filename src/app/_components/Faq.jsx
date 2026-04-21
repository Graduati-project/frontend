const FAQS = [
  {
    q: "How do I reschedule or cancel an appointment?",
    a: "Open the patient portal, go to Appointments, and use the actions on your appointment card to reschedule or cancel (when available).",
  },
  {
    q: "Do I need insurance to book a visit?",
    a: "No. You can book with or without insurance. If you have insurance, bring your card and confirm eligibility at reception.",
  },
  {
    q: "How early should I arrive?",
    a: "We recommend arriving 15 minutes early for check‑in and any required vital signs or paperwork.",
  },
  {
    q: "Do I need to fast before lab tests?",
    a: "Some tests require fasting while others do not. Follow the instructions you receive and ask the clinic if you are unsure before the test.",
  },
];

export default function Faq() {
  return (
    <section className="mt-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Quick answers to the most common patient questions.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 open:ring-primary/25"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-900">
                {item.q}
              </span>
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 transition group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

