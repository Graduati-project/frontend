"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useGetAppointments,
  useGetPatientReviews,
  usePostPatientReview,
} from "../../../hooks/use-patient";
import { parseAppointmentsResponse } from "./patient-parsers";
import { PaginationBar } from "../../components/pagination-bar";
import {
  formatPatientDateTime,
  getDoctorDisplayName,
} from "./patient-ui-utils";

const REVIEWS_PAGE_SIZE = 10;

function StarRow({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            className={`rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400/60 disabled:opacity-50 ${
              active ? "text-amber-400" : "text-slate-300"
            }`}
            aria-pressed={active}
            aria-label={`${n} stars`}
          >
            <svg
              className="h-9 w-9 sm:h-10 sm:w-10"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 3l2.61 5.28 5.84.85-4.23 4.12 1 5.82L12 16.9l-5.22 2.74 1-5.82L3.55 9.13l5.84-.85L12 3z" />
            </svg>
          </button>
        );
      })}
      <span className="ml-2 text-sm font-semibold text-slate-600">
        {value} / 5
      </span>
    </div>
  );
}

function ReviewCard({ review }) {
  const stars = review.rating ?? 0;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-teal-50 to-cyan-50 opacity-80"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={n <= stars ? "opacity-100" : "opacity-20"}
            >
              ★
            </span>
          ))}
        </div>
        <time className="text-xs font-medium text-slate-400">
          {formatPatientDateTime(review.createdAt)}
        </time>
      </div>
      <p className="relative mt-3 text-sm font-semibold text-slate-900">
        {getDoctorDisplayName(review)}
      </p>
      {review.comment ? (
        <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
          {review.comment}
        </p>
      ) : (
        <p className="relative mt-2 text-sm italic text-slate-400">
          No written comment
        </p>
      )}
    </article>
  );
}

export function PatientReviewsSection() {
  const appointmentsQuery = useGetAppointments();
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsQuery = useGetPatientReviews(reviewsPage, REVIEWS_PAGE_SIZE);
  const postReview = usePostPatientReview();

  const { appointments: apptList } = parseAppointmentsResponse(
    appointmentsQuery.data
  );

  const completedAppointments = useMemo(
    () =>
      apptList.filter(
        (a) => (a.status ?? "").toLowerCase() === "completed"
      ),
    [apptList]
  );

  const reviewedAppointmentIds = useMemo(() => {
    const ids = reviewsQuery.data?.data?.reviewedAppointmentIds ?? [];
    return new Set(ids);
  }, [reviewsQuery.data]);

  const reviewable = useMemo(
    () =>
      completedAppointments.filter(
        (a) => a._id && !reviewedAppointmentIds.has(String(a._id))
      ),
    [completedAppointments, reviewedAppointmentIds]
  );

  const [appointmentId, setAppointmentId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviews = reviewsQuery.data?.data?.reviews ?? [];
  const stats = reviewsQuery.data?.data?.stats;
  const pagination = reviewsQuery.data?.data?.pagination;
  const totalReviews = stats?.totalReviews ?? pagination?.total ?? 0;
  const avgRating =
    stats?.averageRating != null ? String(stats.averageRating) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appointmentId) return;
    postReview.mutate(
      {
        appointmentId,
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setAppointmentId("");
          setComment("");
          setRating(5);
          setReviewsPage(1);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 px-6 py-8 text-white shadow-lg shadow-teal-900/20 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100/90">
            Feedback
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Your reviews
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-teal-50/95">
            Share how your visit went. You can leave one review per completed
            appointment — it helps us and your doctors improve care.
          </p>
          <Link
            href="/patient?section=appointments"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
          >
            ← Back to appointments
          </Link>
        </div>
      </header>

      {totalReviews > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-500">
              ★
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Average
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {avgRating ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-xl font-bold text-teal-700">
              {totalReviews}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total reviews
              </p>
              <p className="text-lg font-semibold text-slate-900">Submitted</p>
            </div>
          </div>
        </div>
      )}

      {reviewable.length > 0 && (
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Write a review</h2>
          <p className="mt-1 text-sm text-slate-600">
            Pick a completed visit, rate your experience, and add an optional
            note.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Visit
              </label>
              <select
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                className="mt-2 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                required
              >
                <option value="">Choose an appointment…</option>
                {reviewable.map((a) => (
                  <option key={a._id} value={a._id}>
                    {formatPatientDateTime(a.date)} —{" "}
                    {getDoctorDisplayName(a)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Rating
              </span>
              <div className="mt-3">
                <StarRow
                  value={rating}
                  onChange={setRating}
                  disabled={postReview.isPending}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Comment <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="How was the staff, wait time, or explanation of your care?"
                className="mt-2 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {postReview.isError && (
              <p className="text-sm font-medium text-rose-600">
                {postReview.error?.response?.data?.message ??
                  "Could not submit review."}
              </p>
            )}

            <button
              type="submit"
              disabled={postReview.isPending}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-teal-900/20 transition hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50"
            >
              {postReview.isPending ? "Submitting…" : "Submit review"}
            </button>
          </form>
        </section>
      )}

      {reviewable.length === 0 &&
        totalReviews === 0 &&
        completedAppointments.length === 0 &&
        !reviewsQuery.isLoading && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-slate-800">
            No visits to review yet
          </p>
          <p className="mt-2 text-sm text-slate-600">
            After a doctor marks your appointment as completed, you can rate the
            visit here.
          </p>
          <Link
            href="/patient?section=appointments"
            className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View appointments
          </Link>
        </div>
      )}

      <section>
        <h2 className="text-lg font-bold text-slate-900">Past reviews</h2>
        <p className="mt-1 text-sm text-slate-600">
          Everything you have shared with us.
        </p>

        {reviewsQuery.isLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
            You have not submitted any reviews yet.
          </p>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </div>
            <PaginationBar
              pagination={pagination}
              isLoading={reviewsQuery.isFetching}
              onPageChange={setReviewsPage}
              className="mt-6"
            />
          </>
        )}
      </section>
    </div>
  );
}
