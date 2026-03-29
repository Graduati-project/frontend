"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAddTreatment,
  useGetDoctorPatients,
  useUpdateTreatment,
} from "../../../hooks/use-doctor";
import {
  getPatientDisplayName,
  parseDoctorPatientsResponse,
} from "./doctor-parsers";

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

/** API expects calendar dates at UTC midnight, e.g. 2026-03-10T00:00:00.000Z */
function dateInputToUtcIso(dateStr) {
  if (!dateStr?.trim()) return null;
  return `${dateStr.trim()}T00:00:00.000Z`;
}

function utcIsoToDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function formatIsoDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/** POST /doctor/treatments — { patientId, treatmentName, startDate, endDate } */
function AddTreatmentForm({ patients, patientsLoading, patientsError }) {
  const addMutation = useAddTreatment();
  const [patientId, setPatientId] = useState("");
  const [treatmentName, setTreatmentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const noPatients = !patientsLoading && !patientsError && patients.length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId.trim() || !treatmentName.trim()) return;
    const startIso = dateInputToUtcIso(startDate);
    const endIso = dateInputToUtcIso(endDate);
    if (!startIso || !endIso) return;
    addMutation.mutate(
      {
        patientId: patientId.trim(),
        treatmentName: treatmentName.trim(),
        startDate: startIso,
        endDate: endIso,
      },
      {
        onSuccess: () => {
          setPatientId("");
          setTreatmentName("");
          setStartDate("");
          setEndDate("");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-base font-semibold text-slate-900">Add treatment</h3>
      <Field label="Patient">
        {patientsError ? (
          <p className="text-sm text-rose-600">Could not load patients.</p>
        ) : (
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            disabled={patientsLoading || noPatients}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="">
              {patientsLoading
                ? "Loading patients…"
                : noPatients
                  ? "No patients available"
                  : "Select a patient"}
            </option>
            {patients.map((p) => (
              <option key={String(p._id)} value={String(p._id)}>
                {getPatientDisplayName(p)}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field label="Treatment name">
        <input
          value={treatmentName}
          onChange={(e) => setTreatmentName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
          placeholder="e.g. Antibiotic 7 days"
        />
      </Field>

      <Field label="Start date">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
        />
      </Field>

      <Field label="End date">
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          min={startDate || undefined}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
        />
      </Field>

      {addMutation.isError && (
        <p className="text-sm text-rose-600">Could not save treatment.</p>
      )}
      {addMutation.isSuccess && (
        <p className="text-sm text-emerald-700">Treatment saved.</p>
      )}

      <button
        type="submit"
        disabled={
          addMutation.isPending ||
          patientsLoading ||
          noPatients ||
          Boolean(patientsError)
        }
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {addMutation.isPending ? "Saving…" : "Save treatment"}
      </button>
    </form>
  );
}

/** PUT /doctor/treatments/:id */
function UpdateTreatmentForm({ selectedTreatment }) {
  const updateMutation = useUpdateTreatment();

  const [treatmentRecordId, setTreatmentRecordId] = useState("");
  const [treatmentName, setTreatmentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const selectedKey = selectedTreatment?._id ? String(selectedTreatment._id) : "";

  useEffect(() => {
    if (!selectedKey) {
      setTreatmentRecordId("");
      setTreatmentName("");
      setStartDate("");
      setEndDate("");
      return;
    }

    setTreatmentRecordId(selectedTreatment._id ? String(selectedTreatment._id) : "");
    setTreatmentName(selectedTreatment.treatmentName ?? "");
    setStartDate(utcIsoToDateInput(selectedTreatment.startDate));
    setEndDate(utcIsoToDateInput(selectedTreatment.endDate));
  }, [selectedKey]); // refill when selecting different row

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!treatmentRecordId.trim()) return;

    const data = {};
    if (isNonEmptyString(treatmentName)) data.treatmentName = treatmentName.trim();

    const startIso = dateInputToUtcIso(startDate);
    const endIso = dateInputToUtcIso(endDate);
    if (startIso) data.startDate = startIso;
    if (endIso) data.endDate = endIso;

    if (Object.keys(data).length === 0) return;

    updateMutation.mutate(
      { id: treatmentRecordId.trim(), data },
      {
        onSuccess: () => {
          // keep id selected, but clear optional fields for next edit
          setTreatmentName("");
          setStartDate("");
          setEndDate("");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-base font-semibold text-slate-900">
        Update treatment
      </h3>

      {!selectedKey ? (
        <p className="text-sm text-slate-600">
          Click a treatment row below to load it here.
        </p>
      ) : (
        <>
          <Field label="Treatment record">
            <input
              value={treatmentRecordId}
              readOnly
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
            />
          </Field>

          <Field label="Treatment name (optional)">
            <input
              value={treatmentName}
              onChange={(e) => setTreatmentName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </Field>

          <Field label="Start date (optional)">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </Field>

          <Field label="End date (optional)">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </Field>
        </>
      )}

      {updateMutation.isError && (
        <p className="text-sm text-rose-600">Could not update treatment.</p>
      )}
      {updateMutation.isSuccess && (
        <p className="text-sm text-emerald-700">Treatment updated.</p>
      )}

      <button
        type="submit"
        disabled={updateMutation.isPending || !selectedKey}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-50"
      >
        {updateMutation.isPending ? "Updating…" : "Update treatment"}
      </button>
    </form>
  );
}

export function DoctorTreatmentsSection() {
  const patientsQuery = useGetDoctorPatients();

  const { patients } = useMemo(
    () => parseDoctorPatientsResponse(patientsQuery.data),
    [patientsQuery.data]
  );

  const flatTreatments = useMemo(() => {
    return (patients ?? []).flatMap((p) => {
      const treatments = Array.isArray(p.treatments) ? p.treatments : [];
      return treatments.map((t) => ({
        ...t,
        patient: p,
      }));
    });
  }, [patients]);

  const [selectedTreatment, setSelectedTreatment] = useState(null);

  useEffect(() => {
    if (!selectedTreatment?._id) return;
    const found = flatTreatments.find(
      (t) => String(t._id) === String(selectedTreatment._id)
    );
    if (!found) setSelectedTreatment(null);
    else setSelectedTreatment(found);
  }, [flatTreatments, selectedTreatment?._id]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Treatments</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add a treatment, then click any row below to update it.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AddTreatmentForm
          patients={patients}
          patientsLoading={patientsQuery.isLoading}
          patientsError={patientsQuery.error}
        />

        <UpdateTreatmentForm selectedTreatment={selectedTreatment} />
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Treatments table
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Click a treatment row to load it in the update form.
            </p>
          </div>
        </div>

        {patientsQuery.isLoading ? (
          <p className="text-sm text-slate-500">Loading treatments…</p>
        ) : patientsQuery.error ? (
          <p className="text-sm text-rose-600">
            Could not load patients with treatments.
          </p>
        ) : flatTreatments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No treatments found for your patients.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[900px] w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Treatment</th>
                  <th className="px-4 py-3 font-medium">Start</th>
                  <th className="px-4 py-3 font-medium">End</th>
                </tr>
              </thead>
              <tbody>
                {flatTreatments.map((t) => {
                  const rowId = t._id ? String(t._id) : "";
                  const active = selectedTreatment?._id
                    ? String(selectedTreatment._id) === rowId
                    : false;

                  const patient = t.patient ?? {};
                  const patientName =
                    getPatientDisplayName(patient) || "—";
                  const patientEmail =
                    patient.email ? String(patient.email) : "";

                  return (
                    <tr
                      key={rowId || JSON.stringify(t)}
                      onClick={() => setSelectedTreatment(t)}
                      className={`cursor-pointer border-t border-slate-100 ${
                        active ? "bg-slate-900/5" : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {patientName}
                          </span>
                          {patientEmail ? (
                            <span className="text-xs text-slate-500">
                              {patientEmail}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {t.treatmentName ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {formatIsoDate(t.startDate)}
                      </td>
                      <td className="px-4 py-3">
                        {formatIsoDate(t.endDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
