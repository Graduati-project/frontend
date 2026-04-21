import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Mariam A.",
    quote:
      "Booking was quick and clear. The instructions helped me arrive prepared and avoid delays.",
    image: "/pexels-karola-g-4386492.jpg",
  },
  {
    name: "Ahmed K.",
    quote:
      "I liked how easy it was to find the right specialty and keep track of my appointment details.",
    image: "/pexels-andre-124356440-11722768.jpg",
  },
  {
    name: "Nada S.",
    quote:
      "The portal made follow‑ups simple. I knew what to bring and what to do next after my visit.",
    image: "/pexels-jonathanborba-13697927.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="mt-14">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          What patients say
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          A few words from patients about their visit experience.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs font-semibold text-slate-500">Patient</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              “{t.quote}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

