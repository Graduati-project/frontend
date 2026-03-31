"use client";

import { useMemo, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAddDoctor, useGetDoctors, useGetStaffSpecialties } from "../../../hooks/use-staff";
import { getUserDisplayName, parseAdminDoctorsResponse } from "./admin-parsers";

function SectionState({ isLoading, error, children }) {
  if (isLoading) {
    return <p className="text-center text-sm text-slate-500">Loading…</p>;
  }
  if (error) {
    return (
      <p className="text-center text-sm text-rose-600">
        Could not load doctors. Please try again.
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

function AddDoctorModal({ open, onClose }) {
  const addDoctor = useAddDoctor();
  const specialtiesQuery = useGetStaffSpecialties();
  const specialties = useMemo(() => {
    const raw = specialtiesQuery.data;
    // Reuse the list normalizer already used in other admin tables.
    // specialty may be returned as: array or { data: [] } / { items: [] }.
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw;
    const inner = raw.data ?? raw;
    if (Array.isArray(inner)) return inner;
    if (typeof inner === "object") {
      return inner.items ?? inner.results ?? inner.specialties ?? [];
    }
    return [];
  }, [specialtiesQuery.data]);

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
    specialtyId: "",
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
      ...(values.specialtyId.trim() ? { specialtyId: values.specialtyId.trim() } : {}),
    };
    addDoctor.mutate(payload, {
      onSuccess: () => {
        setValues({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          gender: "",
          specialtyId: "",
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
            <h2 className="text-lg font-semibold text-slate-900">Add doctor</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create a doctor account and attach a specialty (optional).
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
          <Field label="Specialty">
            <select
              name="specialtyId"
              value={values.specialtyId}
              onChange={handleChange}
              disabled={specialtiesQuery.isLoading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 sm:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                {specialtiesQuery.isLoading
                  ? "Loading specialties…"
                  : specialties.length === 0
                    ? "No specialties available"
                    : "None (optional)"}
              </option>
              {specialties.map((s) => (
                <option key={String(s._id)} value={String(s._id)}>
                  {s.name ?? s.title ?? `Specialty ${String(s._id)}`}
                </option>
              ))}
            </select>
          </Field>

          {values.password &&
            values.confirmPassword &&
            values.password !== values.confirmPassword && (
              <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 ring-1 ring-amber-100 sm:col-span-2">
                Passwords do not match.
              </p>
            )}

          {addDoctor.isError && (
            <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-700 ring-1 ring-rose-100 sm:col-span-2">
              Could not add doctor. Please check fields and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || addDoctor.isPending}
            className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:opacity-50 sm:col-span-2"
          >
            {addDoctor.isPending ? "Saving…" : "Add doctor"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DoctorRow({ doctor }) {
  const user =
    doctor?.userId && typeof doctor.userId === "object" ? doctor.userId : doctor;
  const specialty =
    doctor?.specialtyId && typeof doctor.specialtyId === "object"
      ? doctor.specialtyId
      : null;

  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 font-medium text-slate-900">
        {getUserDisplayName(user)}
      </td>
      <td className="px-4 py-3 text-slate-700">{user?.email ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">{user?.phone ?? "—"}</td>
      <td className="px-4 py-3 text-slate-700">
        {specialty?.name ?? doctor?.specialtyName ?? "—"}
      </td>
    </tr>
  );
}

export function AdminDoctorsSection() {
  const query = useGetDoctors();
  const { doctors } = parseAdminDoctorsResponse(query.data);
  const [addOpen, setAddOpen] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [search, setSearch] = useState("");

  const specialtyOptions = useMemo(() => {
    const map = new Map();
    for (const d of doctors) {
      const spec =
        d?.specialtyId && typeof d.specialtyId === "object" ? d.specialtyId : null;
      const id = spec?._id ? String(spec._id) : null;
      const name = spec?.name ?? d?.specialtyName ?? null;
      if (id && name) map.set(id, name);
      else if (!id && name) map.set(`name:${name}`, name);
    }
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [doctors]);

  const specialtyFilteredDoctors = useMemo(() => {
    if (specialtyFilter === "all") return doctors;
    return doctors.filter((d) => {
      const spec =
        d?.specialtyId && typeof d.specialtyId === "object" ? d.specialtyId : null;
      const id = spec?._id ? String(spec._id) : null;
      const name = spec?.name ?? d?.specialtyName ?? "";
      if (specialtyFilter.startsWith("name:")) {
        return `name:${name}` === specialtyFilter;
      }
      return id === specialtyFilter;
    });
  }, [doctors, specialtyFilter]);

  const searchedDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return specialtyFilteredDoctors;
    return specialtyFilteredDoctors.filter((doctor) => {
      const u =
        doctor?.userId && typeof doctor.userId === "object" ? doctor.userId : doctor;
      const name = getUserDisplayName(u);
      const email = u?.email ?? "";
      const phone = u?.phone ?? "";
      const hay = `${name} ${email} ${phone}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search, specialtyFilteredDoctors]);

  return (
    <SectionState isLoading={query.isLoading} error={query.error}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Doctors</h1>
            <p className="mt-1 text-sm text-slate-600">
              All doctors registered in the system.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500"
          >
            Add doctor
          </button>
        </div>

        <AddDoctorModal open={addOpen} onClose={() => setAddOpen(false)} />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex min-w-[220px] flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Filter by specialty</label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="all">All specialties</option>
              {specialtyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
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
            Showing <span className="font-semibold text-slate-700">{searchedDoctors.length}</span>{" "}
            of <span className="font-semibold text-slate-700">{doctors.length}</span>
          </p>
        </div>

        {searchedDoctors.length === 0 ? (
          <p className="text-center text-sm text-slate-500">No doctors found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-[900px] w-full table-auto text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Specialty</th>
                </tr>
              </thead>
              <tbody>
                {searchedDoctors.map((d) => (
                  <DoctorRow key={d._id ?? JSON.stringify(d)} doctor={d} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionState>
  );
}

