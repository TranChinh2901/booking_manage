"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cancelMyBooking, deleteMyBooking, getMyBookings } from "@/lib/api/bookings";
import type { Booking } from "@/lib/api/types";
import { clearAuth, getStoredAuth } from "@/lib/auth-storage";
import { formatCurrency, formatDate } from "@/lib/format";

export function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  async function loadBookings(accessToken: string) {
    setLoading(true);
    setError("");

    try {
      setBookings(await getMyBookings(accessToken));
    } catch {
      setError("Không thể tải danh sách đặt tour.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const auth = getStoredAuth();

    if (!auth) {
      setLoading(false);
      return;
    }

    setToken(auth.accessToken);
    void loadBookings(auth.accessToken);
  }, []);

  async function handleCancel(id: number) {
    if (!token) {
      return;
    }

    try {
      const updated = await cancelMyBooking(id, token);
      setBookings((current) =>
        current.map((booking) => (booking.id === id ? updated : booking))
      );
    } catch {
      setError("Không thể hủy đơn đặt này.");
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Bạn có chắc muốn xóa booking này?")) {
      return;
    }

    try {
      await deleteMyBooking(id, token);
      setBookings((current) => current.filter((booking) => booking.id !== id));
    } catch {
      setError("Không thể xóa đơn đặt này.");
    }
  }

  if (loading) {
    return (
      <div className="mt-10 rounded-[8px] border border-[#dff3fa] bg-white p-6 text-base font-semibold text-[#496779]">
        Đang tải đơn đặt tour...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mt-10 rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-6">
        <h2 className="text-2xl font-black text-[#9a3412]">Yêu cầu đăng nhập</h2>
        <p className="mt-3 text-base font-semibold leading-7 text-[#9a3412]">
          Đăng nhập để xem đơn đặt tour của bạn.
        </p>
        <Link
          className="mt-5 inline-flex h-11 items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white"
          href="/login?next=/account/bookings"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-[#062f42]">Danh sách đặt tour</h2>
        <button
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[8px] border border-[#d7edf4] bg-white px-5 text-sm font-black text-[#0e7490]"
          onClick={() => {
            clearAuth();
            setToken(null);
            setBookings([]);
          }}
          type="button"
        >
          Đăng xuất
        </button>
      </div>

      {error ? (
        <p className="mt-5 rounded-[8px] bg-[#fff7ed] p-3 text-sm font-bold text-[#9a3412]">
          {error}
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-[8px] border border-[#dff3fa] bg-white p-6 text-base font-semibold text-[#496779]">
          Bạn chưa có đơn đặt tour nào.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((booking) => {
            const schedule = booking.tourSchedule;
            const tour = schedule?.tour;
            const canCancel = !["CANCELLED", "COMPLETED"].includes(booking.status);

            return (
              <article
                className="rounded-[8px] border border-[#dff3fa] bg-white p-5 shadow-[0_18px_45px_rgba(12,74,110,0.08)]"
                key={booking.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0e7490]">
                      {booking.bookingCode}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[#062f42]">
                      {tour?.title || "Tour du lịch"}
                    </h3>
                    <div className="mt-3 space-y-1 text-sm font-semibold leading-6 text-[#496779]">
                      {schedule ? (
                        <p>
                          Lịch trình: {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                        </p>
                      ) : null}
                      <p>
                        Khách: {booking.adultCount} người lớn, {booking.childCount} trẻ em
                      </p>
                      <p>Tổng tiền: {formatCurrency(booking.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="min-w-48">
                    <p className="rounded-[8px] bg-[#f8fdff] px-4 py-3 text-sm font-black text-[#062f42]">
                      {booking.status} / {booking.paymentStatus}
                    </p>
                    {canCancel ? (
                      <button
                        className="mt-3 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#ef4444] px-5 text-sm font-black text-white"
                        onClick={() => void handleCancel(booking.id)}
                        type="button"
                      >
                        Hủy đặt tour
                      </button>
                    ) : null}
                    <button
                      className="mt-3 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[8px] border border-[#ef4444] px-5 text-sm font-black text-[#ef4444]"
                      onClick={() => void handleDelete(booking.id)}
                      type="button"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
