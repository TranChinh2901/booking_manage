"use client";

import { FormEvent, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api/client";
import { clearAuth, getStoredAuth, saveAuth, type StoredAuth } from "@/lib/auth-storage";

export function ProfilePage() {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const stored = getStoredAuth();
    if (!stored) {
      window.location.href = "/login";
      return;
    }
    setAuth(stored);
    setName(stored.user.name);
    setPhone(stored.user.phone || "");
  }, []);

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await apiFetch<StoredAuth["user"]>("/auth/profile", {
        method: "PATCH",
        token: auth.accessToken,
        body: JSON.stringify({ name, phone }),
      });

      const newAuth = { ...auth, user: updatedUser };
      saveAuth(newAuth);
      setAuth(newAuth);
      setMessage("Cập nhật thành công!");
    } catch (err: any) {
      setError(err.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setPwLoading(true);
    setPwMessage("");
    setPwError("");

    try {
      await apiFetch("/auth/change-password", {
        method: "PATCH",
        token: auth.accessToken,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwMessage("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwError(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setPwLoading(false);
    }
  }

  if (!auth) return null;

  return (
    <div className="mt-8 space-y-8">
      {/* Profile form */}
      <form
        className="rounded-lg border border-[#dff3fa] bg-white p-6 shadow-sm"
        onSubmit={handleUpdateProfile}
      >
        <h2 className="text-xl font-black text-[#062f42]">Thông tin cá nhân</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#496779]">Email</label>
            <input
              className="mt-1 w-full rounded-md border border-[#e3f2f7] bg-[#f8fdff] px-4 py-2.5 text-sm"
              disabled
              value={auth.user.email}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#496779]">Họ tên</label>
            <input
              className="mt-1 w-full rounded-md border border-[#e3f2f7] px-4 py-2.5 text-sm focus:border-[#0e7490] focus:outline-none"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#496779]">Số điện thoại</label>
            <input
              className="mt-1 w-full rounded-md border border-[#e3f2f7] px-4 py-2.5 text-sm focus:border-[#0e7490] focus:outline-none"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </div>
        </div>

        {message && <p className="mt-3 text-sm font-bold text-green-600">{message}</p>}
        {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}

        <button
          className="mt-5 rounded-md bg-[#0e7490] px-6 py-2.5 text-sm font-black text-white hover:bg-[#0c5f73] disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>

      {/* Change password form */}
      <form
        className="rounded-lg border border-[#dff3fa] bg-white p-6 shadow-sm"
        onSubmit={handleChangePassword}
      >
        <h2 className="text-xl font-black text-[#062f42]">Đổi mật khẩu</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#496779]">Mật khẩu hiện tại</label>
            <input
              className="mt-1 w-full rounded-md border border-[#e3f2f7] px-4 py-2.5 text-sm focus:border-[#0e7490] focus:outline-none"
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              value={currentPassword}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#496779]">Mật khẩu mới</label>
            <input
              className="mt-1 w-full rounded-md border border-[#e3f2f7] px-4 py-2.5 text-sm focus:border-[#0e7490] focus:outline-none"
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              value={newPassword}
            />
          </div>
        </div>

        {pwMessage && <p className="mt-3 text-sm font-bold text-green-600">{pwMessage}</p>}
        {pwError && <p className="mt-3 text-sm font-bold text-red-600">{pwError}</p>}

        <button
          className="mt-5 rounded-md bg-[#f97316] px-6 py-2.5 text-sm font-black text-white hover:bg-[#ea580c] disabled:opacity-50"
          disabled={pwLoading}
          type="submit"
        >
          {pwLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
