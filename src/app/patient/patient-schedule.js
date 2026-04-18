export const DAY_LABEL_EN = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

const WEEK_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_ABBR = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};

function groupScheduleByDay(schedule) {
  const map = new Map();
  for (const row of schedule ?? []) {
    const key = String(row?.day ?? "")
      .toLowerCase()
      .trim();
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}

/**
 * Clearer than a plain table: week strip + list of open slots.
 * `compact`: week strip only (fits doctor cards in a grid).
 */
export function ScheduleVisual({ schedule, compact = false }) {
  const rows = schedule ?? [];
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">No schedule available.</p>;
  }

  const byDay = groupScheduleByDay(rows);
  const weekCells = WEEK_ORDER.map((dayKey) => ({
    dayKey,
    abbr: DAY_ABBR[dayKey] ?? dayKey.slice(0, 3),
    full: DAY_LABEL_EN[dayKey] ?? dayKey,
    slots: byDay.get(dayKey) ?? [],
  }));

  const openDays = weekCells.filter((c) => c.slots.length > 0);

  const activeCell =
    "flex min-h-21 flex-col items-center justify-center rounded-xl border border-teal-200/90 bg-teal-50/90 px-0.5 py-2 text-center shadow-sm ring-1 ring-teal-100/80 sm:min-h-22 sm:px-1";
  const inactiveCell =
    "flex min-h-21 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/90 px-0.5 py-2 text-center sm:min-h-22 sm:px-1";
  const activeCellCompact =
    "flex min-h-[4.5rem] flex-col items-center justify-center rounded-lg border border-teal-200/90 bg-teal-50/90 px-0.5 py-1.5 text-center shadow-sm ring-1 ring-teal-100/80 sm:min-h-[4.75rem] sm:px-0.5";
  const inactiveCellCompact =
    "flex min-h-[4.5rem] flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-50/80 px-0.5 py-1.5 text-center sm:min-h-[4.75rem] sm:px-0.5";

  return (
    <div className={compact ? "space-y-0" : "space-y-4"}>
      <div
        className={`grid grid-cols-7 ${compact ? "gap-0.5" : "gap-1 sm:gap-2"}`}
        role="list"
        aria-label="Opening days this week"
      >
        {weekCells.map(({ dayKey, abbr, full, slots }) => {
          const active = slots.length > 0;
          return (
            <div
              key={dayKey}
              role="listitem"
              aria-label={
                active
                  ? `${full}: ${slots.map((s) => `${s.startTime}–${s.endTime}`).join(", ")}`
                  : `${full}: closed`
              }
              className={
                compact
                  ? active
                    ? activeCellCompact
                    : inactiveCellCompact
                  : active
                    ? activeCell
                    : inactiveCell
              }
            >
              <span
                className={
                  active
                    ? "text-[10px] font-bold uppercase tracking-wide text-teal-800 sm:text-xs"
                    : "text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs"
                }
              >
                {abbr}
              </span>
              {active ? (
                <div className="mt-1 flex w-full flex-col gap-0.5 px-0.5">
                  {slots.map((s, i) => (
                    <span
                      key={`${dayKey}-${i}`}
                      className="text-[10px] font-medium leading-snug text-slate-800 sm:text-xs"
                    >
                      <span className="text-teal-700/90">{s.startTime}</span>
                      <span className="mx-0.5 text-slate-400" aria-hidden>
                        –
                      </span>
                      <span className="text-teal-700/90">{s.endTime}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="mt-1 text-[10px] text-slate-300 sm:text-xs">—</span>
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <ul className="space-y-2 border-t border-slate-100 pt-3">
          {openDays.map(({ dayKey, full, slots }) => (
            <li
              key={`row-${dayKey}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50/90 px-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-800">{full}</span>
              <span className="font-medium text-teal-800 tabular-nums">
                {slots.map((s) => `${s.startTime} – ${s.endTime}`).join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ScheduleTable({ schedule }) {
  const rows = schedule ?? [];
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">No schedule available.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-2 font-medium">Day</th>
            <th className="px-3 py-2 font-medium">From</th>
            <th className="px-3 py-2 font-medium">To</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${row.day}-${i}`}
              className="border-t border-slate-100 bg-white"
            >
              <td className="px-3 py-2 font-medium capitalize text-slate-900">
                {DAY_LABEL_EN[row.day] ?? row.day}
              </td>
              <td className="px-3 py-2 text-slate-700">{row.startTime}</td>
              <td className="px-3 py-2 text-slate-700">{row.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
