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
      setError("Không thể xử lý yêu cầu của bạn.");
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
        {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
      </h1>
      <p className="mt-3 text-base font-semibold leading-7 text-[#496779]">
        {isRegister
          ? "Tạo tài khoản để đặt tour và theo dõi lịch sử đặt chỗ."
          : "Đăng nhập để đặt tour và quản lý đơn đặt của bạn."}
      </p>

      <div className="mt-6 space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
              Họ và tên
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
              Số điện thoại
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
            Mật khẩu
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
        {loading ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập"}
      </button>

      <p className="mt-5 text-center text-sm font-bold text-[#496779]">
        {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
        <Link
          className="text-[#0e7490]"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </Link>
      </p>
    </form>
  );
}
