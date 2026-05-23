"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { createBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { createMoMoPayment } from "@/lib/api/payments";
import type { Booking, TourSchedule } from "@/lib/api/types";
import { clearAuth, getStoredAuth, type StoredAuth } from "@/lib/auth-storage";
import { formatCurrency, formatDate } from "@/lib/format";

type BookingFormProps = {
  schedule: TourSchedule;
};

export function BookingForm({ schedule }: BookingFormProps) {
  const router = useRouter();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "momo">("cash");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount =
    adultCount * schedule.priceAdult + childCount * schedule.priceChild;

  useEffect(() => {
    setAuth(getStoredAuth());
    setAuthChecked(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth) {
      setError("Bạn cần đăng nhập trước khi đặt tour.");
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createBooking(
        {
          tourScheduleId: schedule.id,
          adultCount,
          childCount,
          contactName: String(formData.get("contactName") || ""),
          contactEmail: String(formData.get("contactEmail") || ""),
          contactPhone: String(formData.get("contactPhone") || ""),
          note: String(formData.get("note") || ""),
        },
        auth.accessToken
      );

      // Create MoMo payment and redirect
      if (paymentMethod === "momo") {
        try {
          const payment = await createMoMoPayment(result.id, auth.accessToken);
          window.location.href = payment.payUrl;
          return;
        } catch {
          setBooking(result);
        }
      } else {
        setBooking(result);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuth();
        setAuth(null);
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        router.refresh();
        return;
      }

      setError(error instanceof ApiError ? error.message : "Không thể tạo đơn đặt tour.");
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="rounded-[8px] border border-[#dff3fa] bg-white p-6 text-base font-semibold text-[#496779]">
        Đang kiểm tra trạng thái đăng nhập...
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-6">
        <h2 className="text-2xl font-black text-[#9a3412]">Yêu cầu đăng nhập</h2>
        <p className="mt-3 text-base font-semibold leading-7 text-[#9a3412]">
          Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục đặt tour.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white"
            href={`/login?next=/booking/${schedule.id}`}
          >
            Đăng nhập
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#f97316] px-5 text-sm font-black text-[#9a3412]"
            href={`/register?next=/booking/${schedule.id}`}
          >
            Đăng ký
          </Link>
        </div>
      </div>
    );
  }

  if (booking) {
    return (
      <div className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-6">
        <h2 className="text-2xl font-black text-[#166534]">Đặt tour thành công</h2>
        <p className="mt-3 text-base font-semibold leading-7 text-[#166534]">
          Mã đặt tour của bạn là {booking.bookingCode}. Trạng thái hiện tại: {booking.status}.
        </p>
        <Link
          className="mt-5 inline-flex h-11 items-center justify-center rounded-[8px] bg-[#16a34a] px-5 text-sm font-black text-white"
          href="/account/bookings"
        >
          Xem đơn đặt của tôi
        </Link>
      </div>
    );
  }

  return (
    <form
      className="rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_24px_70px_rgba(12,74,110,0.12)]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-black text-[#062f42]">Thông tin đặt tour</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Người lớn
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
            min={1}
            onChange={(event) => setAdultCount(Number(event.target.value))}
            required
            type="number"
            value={adultCount}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Trẻ em
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
            min={0}
            onChange={(event) => setChildCount(Number(event.target.value))}
            type="number"
            value={childCount}
          />
        </label>
      </div>

      <div className="mt-5 rounded-[8px] bg-[#f8fdff] p-4">
        <p className="text-sm font-bold text-[#496779]">
          {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
        </p>
        <p className="mt-2 text-2xl font-black text-[#f97316]">
          Tổng dự kiến: {formatCurrency(totalAmount)}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Họ và tên liên hệ
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
            defaultValue={auth.user.name}
            name="contactName"
            required
            type="text"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Email
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
            defaultValue={auth.user.email}
            name="contactEmail"
            required
            type="email"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Số điện thoại
          </span>
          <input
            className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
            defaultValue={auth.user.phone || ""}
            name="contactPhone"
            required
            type="tel"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
            Ghi chú
          </span>
          <textarea
            className="min-h-28 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 py-3 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
            name="note"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-[8px] bg-[#fff7ed] p-3 text-sm font-bold text-[#9a3412]">
          {error}
        </p>
      ) : null}

      <div className="mt-5">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
          Phương thức thanh toán
        </span>
        <div className="flex gap-3">
          <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-[8px] border p-4 ${paymentMethod === "cash" ? "border-[#0ea5e9] bg-[#f0f9ff]" : "border-[#d7edf4] bg-[#f8fdff]"}`}>
            <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} className="accent-[#0ea5e9]" />
            <span className="text-sm font-semibold text-[#0c3144]">Tiền mặt</span>
          </label>
          <label className={`flex flex-1 cursor-pointer items-center gap-2 rounded-[8px] border p-4 ${paymentMethod === "momo" ? "border-[#a50064] bg-[#fff0f6]" : "border-[#d7edf4] bg-[#f8fdff]"}`}>
            <input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === "momo"} onChange={() => setPaymentMethod("momo")} className="accent-[#a50064]" />
            <span className="text-sm font-semibold text-[#0c3144]">Ví MoMo</span>
          </label>
        </div>
      </div>

      <button
        className="mt-6 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-6 text-sm font-black text-white transition-colors hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading ? "Đang đặt..." : "Xác nhận đặt tour"}
      </button>
    </form>
  );
}
