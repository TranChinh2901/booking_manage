"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";

import {
  AUTH_STORAGE_KEY,
  clearAuth,
  type StoredAuth,
} from "@/lib/auth-storage";
import { CompassIcon } from "../icons";

function subscribeToAuthStore(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getAuthSnapshot(): string | null {
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

function getServerAuthSnapshot(): string | null {
  return null;
}

function parseAuthSnapshot(rawAuth: string | null): StoredAuth | null {
  if (!rawAuth) {
    return null;
  }

  try {
    return JSON.parse(rawAuth) as StoredAuth;
  } catch {
    return null;
  }
}

export function Navbar() {
  const router = useRouter();
  const rawAuth = useSyncExternalStore(
    subscribeToAuthStore,
    getAuthSnapshot,
    getServerAuthSnapshot
  );
  const auth = useMemo(() => parseAuthSnapshot(rawAuth), [rawAuth]);

  function handleLogout() {
    clearAuth();
    window.dispatchEvent(new StorageEvent("storage", { key: AUTH_STORAGE_KEY }));
    router.push("/login");
    router.refresh();
  }

  const user = auth?.user;
  const displayName = user?.name || user?.email || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <nav
      aria-label="Main navigation"
      className="relative z-50 mx-auto flex max-w-[1200px] items-center justify-between rounded-[8px] border border-white/70 bg-white/78 px-4 py-3 shadow-[0_18px_55px_rgba(12,74,110,0.12)] backdrop-blur-xl"
    >
      <Link className="flex items-center gap-3 font-black text-[#073449]" href="/">
        <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#0ea5e9] text-white shadow-[0_12px_28px_rgba(14,165,233,0.28)]">
          <CompassIcon />
        </span>
        Northline
      </Link>
      <div className="hidden items-center gap-8 text-sm font-bold text-[#496779] md:flex">
        <Link className="transition-colors hover:text-[#0c4a6e]" href="/#destinations">
          Destinations
        </Link>
        <Link className="transition-colors hover:text-[#0c4a6e]" href="/tours">
          Tours
        </Link>
        <Link className="transition-colors hover:text-[#0c4a6e]" href="/posts">
          Guides
        </Link>
        <Link className="transition-colors hover:text-[#0c4a6e]" href="/account/bookings">
          My Bookings
        </Link>
        <Link className="transition-colors hover:text-[#0c4a6e]" href="/#contact">
          Contact
        </Link>
      </div>
      {user ? (
        <div className="group relative">
          <button
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[8px] border border-[#d7edf4] bg-white px-3 text-sm font-black text-[#073449] shadow-[0_14px_32px_rgba(12,74,110,0.1)] transition-colors hover:border-[#0ea5e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
            type="button"
          >
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={displayName}
                className="h-8 w-8 rounded-[8px] object-cover"
                src={user.avatar}
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#0ea5e9] text-white">
                {initial}
              </span>
            )}
            <span className="hidden max-w-32 truncate sm:inline">{displayName}</span>
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-[#496779] transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="invisible absolute right-0 top-full z-[60] w-56 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="rounded-[8px] border border-[#dff3fa] bg-white p-2 shadow-[0_22px_60px_rgba(12,74,110,0.18)]">
              <div className="border-b border-[#e3f2f7] px-3 py-2">
                <p className="truncate text-sm font-black text-[#073449]">{displayName}</p>
                <p className="truncate text-xs font-bold text-[#64748b]">{user.email}</p>
              </div>
              <Link
                className="mt-2 block rounded-[8px] px-3 py-2 text-sm font-bold text-[#496779] transition-colors hover:bg-[#f0f9ff] hover:text-[#0c4a6e]"
                href="/account/profile"
              >
                Profile
              </Link>
              <Link
                className="block rounded-[8px] px-3 py-2 text-sm font-bold text-[#496779] transition-colors hover:bg-[#f0f9ff] hover:text-[#0c4a6e]"
                href="/account/bookings"
              >
                My Bookings
              </Link>
              <Link
                className="block rounded-[8px] px-3 py-2 text-sm font-bold text-[#496779] transition-colors hover:bg-[#f0f9ff] hover:text-[#0c4a6e]"
                href="/tours"
              >
                Tours
              </Link>
              <Link
                className="block rounded-[8px] px-3 py-2 text-sm font-bold text-[#496779] transition-colors hover:bg-[#f0f9ff] hover:text-[#0c4a6e]"
                href="/posts"
              >
                Guides
              </Link>
              {user.role === "ADMIN" ? (
                <Link
                  className="block rounded-[8px] px-3 py-2 text-sm font-bold text-[#496779] transition-colors hover:bg-[#f0f9ff] hover:text-[#0c4a6e]"
                  href="/admin"
                >
                  Admin dashboard
                </Link>
              ) : null}
              <button
                className="mt-1 block w-full cursor-pointer rounded-[8px] px-3 py-2 text-left text-sm font-bold text-[#b91c1c] transition-colors hover:bg-[#fef2f2]"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(249,115,22,0.3)] transition-colors hover:bg-[#ea580c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
          href="/login"
        >
          Login
        </Link>
      )}
    </nav>
  );
}
