export const DAY_LABEL_EN = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

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
