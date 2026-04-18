"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useGetAppointments,
  useGetPatientMedicalFiles,
  useUploadPatientMedicalFile,
} from "../../../hooks/use-patient";
import { parseAppointmentsResponse } from "./patient-parsers";
import { PaginationBar } from "../../components/pagination-bar";
import { apiFileUrl, formatPatientDateTime } from "./patient-ui-utils";

const FILES_PAGE_SIZE = 10;

function fileKindIcon(mime) {
  const m = (mime || "").toLowerCase();
  if (m.includes("pdf")) return "📄";
  if (m.startsWith("image/")) return "🖼";
  if (m.includes("word") || m.includes("document")) return "📝";
  return "📎";
}

export function PatientMedicalRecordsSection() {
  const appointmentsQuery = useGetAppointments();
  const [filesPage, setFilesPage] = useState(1);
  const filesQuery = useGetPatientMedicalFiles(filesPage, FILES_PAGE_SIZE);
  const uploadFile = useUploadPatientMedicalFile();

  const { appointments: apptList } = parseAppointmentsResponse(
    appointmentsQuery.data
  );

  const [fileAppointmentId, setFileAppointmentId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const medicalFiles = filesQuery.data?.data?.medicalFiles ?? [];
  const filesPagination = filesQuery.data?.data?.pagination;

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadFile.mutate(
      {
        file: selectedFile,
        appointmentId: fileAppointmentId || undefined,
      },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setFileAppointmentId("");
          setFilesPage(1);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-teal-900 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200/90">
            Documents
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Health records & files
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-200/95">
            Upload lab results, prescriptions, or images. You can link each file
            to an appointment for easier tracking.
          </p>
          <Link
            href="/patient?section=appointments"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
          >
            ← Appointments
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">Upload a file</h2>
        <p className="mt-1 text-sm text-slate-600">
          PNG, JPG, GIF, PDF, or Word documents.
        </p>

        <form onSubmit={handleUpload} className="mt-6 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
              Link to appointment <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <select
              value={fileAppointmentId}
              onChange={(e) => setFileAppointmentId(e.target.value)}
              className="mt-2 w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">No link</option>
              {apptList.map((a) => (
                <option key={a._id} value={a._id}>
                  {formatPatientDateTime(a.date)} — {a.status ?? "—"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
              File
            </span>
            <label
              htmlFor="medical-file-input"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) setSelectedFile(f);
              }}
              className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 transition-colors ${
                dragOver
                  ? "border-teal-500 bg-teal-50/80"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              <span className="text-4xl" aria-hidden>
                📁
              </span>
              <span className="mt-3 text-center text-sm font-semibold text-slate-800">
                {selectedFile
                  ? selectedFile.name
                  : "Drop a file here or click to browse"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Max size depends on your server settings
              </span>
              <input
                id="medical-file-input"
                type="file"
                accept="image/png,image/jpeg,image/gif,application/pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) =>
                  setSelectedFile(e.target.files?.[0] ?? null)
                }
              />
            </label>
          </div>

          {uploadFile.isError && (
            <p className="text-sm font-medium text-rose-600">
              {uploadFile.error?.response?.data?.message ?? "Upload failed."}
            </p>
          )}

          <button
            type="submit"
            disabled={uploadFile.isPending || !selectedFile}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-50"
          >
            {uploadFile.isPending ? "Uploading…" : "Upload securely"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Your files</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tap to open in a new tab.
        </p>

        {filesQuery.isLoading ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : medicalFiles.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-10 text-center text-sm text-slate-500">
            No files uploaded yet.
          </p>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {medicalFiles.map((f) => (
                <li key={f._id}>
                  <a
                    href={apiFileUrl(f.filePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      {fileKindIcon(f.mimeType)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {f.originalName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatPatientDateTime(f.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
                      Open
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <PaginationBar
              pagination={filesPagination}
              isLoading={filesQuery.isFetching}
              onPageChange={setFilesPage}
              className="mt-6"
            />
          </>
        )}
      </section>
    </div>
  );
}
