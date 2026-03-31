"use client";

import { useMemo, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAddPatient, useGetPatients } from "../../../hooks/use-staff";
import { getUserDisplayName, parseAdminPatientsResponse } from "./admin-parsers";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return <p className="text-center text-sm text-slate-500">Loading…</p>;
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load patients. Please try again.
      </p>
    );
  }
  return children;
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
      {label}
      {children}
    </label>
  );
}

function AddPatientModal({ open, onClose }) {
  const addPatient = useAddPatient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
  });

  const canSubmit = useMemo(() => {
    return (
      values.firstName.trim() &&
      values.lastName.trim() &&
      values.email.trim() &&
      values.password.trim() &&
      values.confirmPassword.trim() &&
      values.password === values.confirmPassword &&
      values.phone.trim()
    );
  }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
      phone: values.phone.trim(),
      gender: values.gender,
    };

    addPatient.mutate(payload, {
      onSuccess: () => {
        setValues({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          gender: "",
        });
        onClose();
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-950/30"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Add patient</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create a patient account (role: patient).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
              required
            />
          </Field>
          <Field label="Last name">
            <input
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 sm:col-span-2"
              required
            />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </Field>
          <Field label="Confirm password">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </Field>
          <Field label="Phone">
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
              required
            />
          </Field>
          <Field label="Gender">
            <select
              name="gender"
              value={values.gender}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>

          {values.password &&
            values.confirmPassword &&
            values.password !== values.confirmPassword && (
              <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-100 sm:col-span-2">
                Passwords do not match.
              </p>
            )}

          {addPatient.isError && (
            <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 ring-1 ring-rose-100 sm:col-span-2">
              Could not add patient. Please check fields and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || addPatient.isPending}
            className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:opacity-50 sm:col-span-2"
          >
            {addPatient.isPending ? "Saving…" : "Add patient"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PatientRow({ patient }) {
  const user =
    patient?.userId && typeof patient.userId === "object"
      ? patient.userId
      : patient;
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 font-medium text-slate-900">
        {getUserDisplayName(user)}
      </td>
      <td className="px-4 py-3 text-slate-700">{user?.email ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">{user?.phone ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700 capitalize">
        {user?.role ?? "patient"}
      </td>
    </tr>
  );
}

export function AdminPatientsSection() {
  const query = useGetPatients();
  const { patients } = parseAdminPatientsResponse(query.data);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");

  const searchedPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((patient) => {
      const u =
        patient?.userId && typeof patient.userId === "object"
          ? patient.userId
          : patient;
      const name = getUserDisplayName(u);
      const email = u?.email ?? "";
      const phone = u?.phone ?? "";
      const hay = `${name} ${email} ${phone}`.toLowerCase();
      return hay.includes(q);
    });
  }, [patients, search]);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
            <p className="mt-1 text-sm text-slate-600">
              All patients registered in the system.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
          >
            Add patient
          </button>
        </div>

        <AddPatientModal open={addOpen} onClose={() => setAddOpen(false)} />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex min-w-[260px] flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{searchedPatients.length}</span>{" "}
            of <span className="font-semibold text-slate-700">{patients.length}</span>
          </p>
        </div>

        {searchedPatients.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No patients found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[800px] w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {searchedPatients.map((p) => (
                  <PatientRow key={p._id ?? JSON.stringify(p)} patient={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionState>
  );
}

