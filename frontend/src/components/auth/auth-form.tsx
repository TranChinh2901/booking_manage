"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { login, register } from "@/lib/api/auth";
import { saveAuth } from "@/lib/auth-storage";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const auth = isRegister
        ? await register({
            name: String(formData.get("name") || ""),
            email: String(formData.get("email") || ""),
            phone: String(formData.get("phone") || ""),
            password: String(formData.get("password") || ""),
          })
        : await login({
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
          });

      saveAuth(auth);
      router.push(searchParams.get("next") || (auth.user.role === "ADMIN" ? "/admin" : "/tours"));
      router.refresh();
    } catch {
      setError("Unable to process your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mx-auto mt-10 max-w-md rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_24px_70px_rgba(12,74,110,0.12)]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-black text-[#062f42]">
        {isRegister ? "Create account" : "Login"}
      </h1>
      <p className="mt-3 text-base font-semibold leading-7 text-[#496779]">
        {isRegister
          ? "Create an account to book tours and track your booking history."
          : "Log in to book tours and manage your bookings."}
      </p>

      <div className="mt-6 space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
              Full name
            </span>
            <input
              className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors focus:border-[#0ea5e9]"
              name="name"
              required
              type="text"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Email
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors focus:border-[#0ea5e9]"
            name="email"
            required
            type="email"
          />
        </label>

        {isRegister ? (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
              Phone number
            </span>
            <input
              className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors focus:border-[#0ea5e9]"
              name="phone"
              type="tel"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Password
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors focus:border-[#0ea5e9]"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-[8px] bg-[#fff7ed] p-3 text-sm font-bold text-[#9a3412]">
          {error}
        </p>
      ) : null}

      <button
        className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-6 text-sm font-black text-white transition-colors hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading ? "Processing..." : isRegister ? "Register" : "Login"}
      </button>

      <p className="mt-5 text-center text-sm font-bold text-[#496779]">
        {isRegister ? "Already have an account?" : "Do not have an account?"}{" "}
        <Link
          className="text-[#0e7490]"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </form>
  );
}
