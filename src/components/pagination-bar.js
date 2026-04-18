"use client";

export function PaginationBar({
  pagination,
  onPageChange,
  isLoading,
  className = "",
}) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit, hasPrev, hasNext } = pagination;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-teal-100/60 pt-4 ${className}`}
    >
      <p className="text-xs text-slate-500">
        Page{" "}
        <span className="font-semibold text-teal-800">{page}</span> of{" "}
        <span className="font-semibold text-slate-700">{pages}</span>
        <span className="text-slate-400"> · </span>
        <span className="font-semibold text-slate-700">{total}</span> total
        {limit ? (
          <>
            <span className="text-slate-400"> · </span>
            {limit} per page
          </>
        ) : null}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isLoading || !hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-slate-200/90 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={isLoading || !hasNext}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-teal-600/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
