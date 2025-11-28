"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { sendResetPassword } from "../../../../services/auth";

const initialValues = {
  email: "",
};

export default function ForgotPasswordPage() {
  const [formValues, setFormValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ success: "", error: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ success: "", error: "" });

    try {
      await sendResetPassword(formValues.email);
      setFeedback({ success: "Password reset email sent successfully. Please check your inbox.", error: "" });
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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left: Logo side - Full height */}
      <div className="relative hidden md:block md:w-1/2">
        <Image
          src="/logo.jpg"
          alt="Graduation logo"
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Form side */}
      <div className="flex min-h-screen w-full items-center justify-center p-4 md:w-1/2 md:p-8">
        <div className="w-full max-w-md rounded-2xl bg-white/95 p-7 shadow-xl border border-slate-200/70">
          <p className="mt-1 text-2xl font-semibold text-center text-slate-900">
            Forgot Password
          </p>
          <p className="mt-2 text-center text-xs text-slate-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 grid grid-cols-1 gap-5"
          >
            <label className="flex flex-col text-xs font-medium text-slate-600">
              Email
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                required
                className="mt-2 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            {feedback.success && (
              <div className="space-y-3">
                <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-xs text-emerald-700 border border-emerald-100">
                  {feedback.success}
                </p>
                <Link
                  href={`/auth/resetPassword?email=${encodeURIComponent(formValues.email)}`}
                  className="block text-center text-xs font-semibold text-primary hover:text-primary/80 transition"
                >
                  Go to Reset Password →
                </Link>
              </div>
            )}
            {feedback.error && (
              <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs text-rose-700 border border-rose-100">
                {feedback.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
