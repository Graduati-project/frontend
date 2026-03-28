"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  useGetSpecialties,
  useGetSpecialtyOverviewById,
} from "../../../hooks/use-patient";
import { MyDoctorCard } from "./patient-doctors";
import {
  parseSpecialtiesResponse,
  parseSpecialtyOverviewDetail,
} from "./patient-parsers";
import { ScheduleTable } from "./patient-schedule";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return (
      <p className="text-center text-sm text-slate-500">Loading…</p>
    );
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load data. Please try again.
      </p>
    );
  }
  return children;
}

export function SpecialtyCard({ specialty }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{specialty.name}</h3>
        {specialty.maxAppointmentsPerDay != null && (
          <p className="mt-1 text-sm text-slate-600">
            Max appointments per day:{" "}
            <span className="font-medium text-slate-900">
              {specialty.maxAppointmentsPerDay}
            </span>
          </p>
        )}
      </div>
      <div className="px-5 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
          Working hours
        </p>
        <ScheduleTable schedule={specialty.schedule} />
      </div>
    </article>
  );
}

/** Days / hours the specialty operates (from API `schedule`). */
function SpecialtyAvailabilityPanel({ specialty }) {
  if (!specialty) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{specialty.name}</h3>
        {specialty.maxAppointmentsPerDay != null && (
          <p className="mt-1 text-sm text-slate-600">
            Max appointments per day:{" "}
            <span className="font-medium text-slate-900">
              {specialty.maxAppointmentsPerDay}
            </span>
          </p>
        )}
      </div>
      <div className="px-5 py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
          Days & hours
        </p>
        <ScheduleTable schedule={specialty.schedule} />
      </div>
    </div>
  );
}

function SpecialtiesPaginationFooter({ pagination }) {
  if (!pagination?.specialties) return null;
  const p = pagination.specialties;
  return (
    <p className="text-center text-xs text-slate-500">
      {p.total} specialties — page {p.page} of {p.pages}
      {p.hasNext ? " (more available)" : ""}
    </p>
  );
}

function SpecialtyOverviewBody({ specialty, doctors, doctorCount, pagination }) {
  return (
    <div className="space-y-6">
      <Link
        href="/patient?section=specialties"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <span aria-hidden>←</span> Back to specialties
      </Link>

      {specialty ? (
        <SpecialtyCard specialty={specialty} />
      ) : (
        <p className="text-sm text-slate-500">
          No specialty details in this response.
        </p>
      )}

      {doctorCount != null && (
        <p className="text-sm text-slate-600">
          Doctors in this specialty:{" "}
          <span className="font-semibold text-slate-900">{doctorCount}</span>
        </p>
      )}

      {pagination && (
        <p className="text-center text-xs text-slate-500">
          Page {pagination.page} of {pagination.pages} — {pagination.total}{" "}
          total
        </p>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Doctors</h2>
        {doctors.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No doctors listed for this specialty.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {doctors.map((doc) => (
              <MyDoctorCard key={doc._id} doctor={doc} showBooking />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SpecialtiesSection() {
  const searchParams = useSearchParams();
  const specialtyId = searchParams.get("specialtyId");

  const specialtiesQuery = useGetSpecialties();
  const overviewQuery = useGetSpecialtyOverviewById(specialtyId);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");

  const { specialties: specList, pagination } = parseSpecialtiesResponse(
    specialtiesQuery.data
  );
  const {
    specialty,
    doctors,
    doctorCount,
    pagination: overviewPagination,
  } = parseSpecialtyOverviewDetail(overviewQuery.data);

  const selectedSpecialty = useMemo(
    () =>
      specList.find((s) => String(s._id) === String(selectedSpecialtyId)),
    [specList, selectedSpecialtyId]
  );

  if (specialtyId) {
    return (
      <SectionState
        isLoading={overviewQuery.isLoading}
        error={overviewQuery.error}
      >
        <SpecialtyOverviewBody
          specialty={specialty}
          doctors={doctors}
          doctorCount={doctorCount}
          pagination={overviewPagination}
        />
      </SectionState>
    );
  }

  return (
    <SectionState
      isLoading={specialtiesQuery.isLoading}
      error={specialtiesQuery.error}
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Specialty availability
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Choose a specialty to see the <strong>days and hours</strong> it
                runs (from the clinic schedule), not your personal bookings.
              </p>
            </div>
            <div className="flex min-w-[200px] flex-col gap-1">
              <label
                htmlFor="specialty-schedule-filter"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Specialty
              </label>
              <select
                id="specialty-schedule-filter"
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="">Select specialty</option>
                {specList.map((s) => (
                  <option key={s._id} value={String(s._id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            {!selectedSpecialtyId ? (
              <p className="text-sm text-slate-500">
                Select a specialty to see which days and times it operates.
              </p>
            ) : (
              <Link
                href={`/patient?section=specialties&specialtyId=${encodeURIComponent(String(selectedSpecialtyId))}`}
                className="group block rounded-xl outline-none ring-slate-900 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label={`Open full details for ${selectedSpecialty?.name ?? "this specialty"}`}
              >
                <SpecialtyAvailabilityPanel specialty={selectedSpecialty} />
                <p className="mt-3 text-center text-sm font-medium text-slate-600 underline-offset-2 group-hover:text-slate-900 group-hover:underline">
                  View full details and doctors
                </p>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Medical specialties
          </h2>
          <p className="text-sm text-slate-600">
            Select a specialty to see details and available doctors.
          </p>
          {specList.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              No specialties available.
            </p>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                {specList.map((item) => (
                  <Link
                    key={item._id}
                    href={`/patient?section=specialties&specialtyId=${encodeURIComponent(String(item._id))}`}
                    className="block rounded-2xl transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    aria-label={`Open details for ${item.name}`}
                  >
                    <SpecialtyCard specialty={item} />
                  </Link>
                ))}
              </div>
              <SpecialtiesPaginationFooter pagination={pagination} />
            </>
          )}
        </div>
      </div>
    </SectionState>
  );
}
