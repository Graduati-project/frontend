"use client";

import { useState } from "react";
import {
  useGetStaffMedicalFiles,
  useGetStaffReviews,
} from "../../../hooks/use-staff";
import { PaginationBar } from "../../components/pagination-bar";
import { getUserDisplayName } from "./admin-parsers";

const ADMIN_TABLE_PAGE_SIZE = 8;

function formatDateTime(raw) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString("en-US")} ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function apiFileUrl(filePath) {
  if (!filePath) return "#";
  const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");
  const path = String(filePath).replace(/^\//, "");
  return `${base}/${path}`;
}

export function AdminReviewsAndFilesSection() {
  const [staffReviewsPage, setStaffReviewsPage] = useState(1);
  const [staffFilesPage, setStaffFilesPage] = useState(1);
  const reviewsQuery = useGetStaffReviews(
    staffReviewsPage,
    ADMIN_TABLE_PAGE_SIZE
  );
  const medicalFilesQuery = useGetStaffMedicalFiles(
    staffFilesPage,
    ADMIN_TABLE_PAGE_SIZE
  );

  const staffReviews = reviewsQuery.data?.data?.reviews ?? [];
  const staffMedicalFiles = medicalFilesQuery.data?.data?.medicalFiles ?? [];
  const reviewsPagination = reviewsQuery.data?.data?.pagination;
  const medicalFilesPagination = medicalFilesQuery.data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Reviews & medical files
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Patient feedback and uploaded documents across the system.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Patient reviews</h2>
          {reviewsQuery.isLoading ? (
            <p className="mt-2 text-xs text-slate-500">Loading…</p>
          ) : staffReviews.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No reviews yet.</p>
          ) : (
            <div className="mt-3 max-h-[min(28rem,60vh)] overflow-auto">
              <table className="w-full table-auto text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-2 font-medium">Patient</th>
                    <th className="py-2 pr-2 font-medium">Doctor</th>
                    <th className="py-2 pr-2 font-medium">★</th>
                    <th className="py-2 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {staffReviews.map((r) => (
                    <tr key={r._id} className="border-t border-slate-100">
                      <td className="py-2 pr-2 text-slate-800">
                        {getUserDisplayName(r.patientId)}
                      </td>
                      <td className="py-2 pr-2 text-slate-700">
                        {r.doctorId?.userId
                          ? getUserDisplayName(r.doctorId.userId)
                          : "—"}
                      </td>
                      <td className="py-2 pr-2 font-semibold text-slate-900">
                        {r.rating}
                      </td>
                      <td className="py-2 text-slate-600">
                        {formatDateTime(r.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <PaginationBar
            pagination={reviewsPagination}
            isLoading={reviewsQuery.isFetching}
            onPageChange={setStaffReviewsPage}
            className="mt-3 px-1"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Medical files</h2>
          {medicalFilesQuery.isLoading ? (
            <p className="mt-2 text-xs text-slate-500">Loading…</p>
          ) : staffMedicalFiles.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">No files yet.</p>
          ) : (
            <div className="mt-3 max-h-[min(28rem,60vh)] overflow-auto">
              <table className="w-full table-auto text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2 pr-2 font-medium">Patient</th>
                    <th className="py-2 pr-2 font-medium">File</th>
                    <th className="py-2 font-medium">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMedicalFiles.map((f) => (
                    <tr key={f._id} className="border-t border-slate-100">
                      <td className="py-2 pr-2 text-slate-800">
                        {getUserDisplayName(f.patientId)}
                      </td>
                      <td className="py-2 pr-2 text-slate-700">
                        {f.originalName}
                      </td>
                      <td className="py-2">
                        <a
                          href={apiFileUrl(f.filePath)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-emerald-700 underline"
                        >
                          Open
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <PaginationBar
            pagination={medicalFilesPagination}
            isLoading={medicalFilesQuery.isFetching}
            onPageChange={setStaffFilesPage}
            className="mt-3 px-1"
          />
        </div>
      </div>
    </div>
  );
}
