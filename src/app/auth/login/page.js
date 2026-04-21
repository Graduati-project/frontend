"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { login } from "../../../../services/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initialValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ success: "", error: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ success: "", error: "" });

    try {
      const data = await login(formValues);

      if (data?.access_token) {
        Cookies.set("access_token", data.access_token);
      }
      if (data?.refresh_token) {
        Cookies.set("refresh_token", data.refresh_token);
      }

      if (data?.role === "staff") {
        router.push("/admin");
      } else if (data?.role === "doctor") {
        router.push("/doctor");
      } else if (data?.role === "patient") {
        router.push("/patient");
      } else {
        router.push("/patient");
      }

      setFeedback({ success: data?.message || "Login successful.", error: "" });
    } catch (error) {
      setFeedback({
        success: "",
        error: error?.response?.data?.message || "Something went wrong, please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="portal-shell flex min-h-screen flex-col md:flex-row">
      <div className="relative h-44 w-full md:hidden">
        <Image
          src="/logo.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-900/40 to-transparent" />
        <p className="absolute bottom-4 left-5 text-lg font-bold text-white drop-shadow">
          Hospital System
        </p>
      </div>

      <div className="relative hidden min-h-[220px] md:block md:min-h-screen md:w-1/2">
        <Image
          src="/logo.jpg"
          alt="Hospital branding"
          fill
          className="object-cover"
          priority
        />
      
      </div>

      <div className="flex min-h-screen w-full items-center justify-center p-4 md:w-1/2 md:p-10">
        <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-[0_24px_64px_-16px_rgba(15,118,110,0.18)] backdrop-blur-md md:p-9">
          <p className="text-center text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </p>
          <p className="mt-2 text-center text-sm text-slate-500">
            Welcome back — use your hospital account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-5"
          >
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-900 shadow-sm transition focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
            </label>

            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div className="flex items-center justify-between normal-case">
                <span>Password</span>
              </div>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-normal text-slate-900 shadow-sm transition focus:border-teal-400 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
                
              </div>
                  <Link
                  href="/auth/forgotPassword"
                  className="text-xs mt-2 font-normal text-primary hover:text-primary/80 transition text-right"
                >
                  Forgot password?
                </Link>
            </label>

            {feedback.success && (
              <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700 border border-emerald-100">
                {feedback.success}
              </p>
            )}
            {feedback.error && (
              <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700 border border-rose-100">
                {feedback.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-primary hover:text-primary/80 transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
