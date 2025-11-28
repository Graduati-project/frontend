"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { login } from "../../../../services/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";



const initialValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
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
      await login(formValues);
      setFeedback({ success: "Login successful.", error: "" });
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
            Login to your account
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

            <label className="flex flex-col text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between">
                <span>Password</span>
            
              </div>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 pr-10 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-primary/90 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isSubmitting ? "Logging in..." : "Login"}
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
