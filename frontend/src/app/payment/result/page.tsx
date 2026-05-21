"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";

function PaymentResult() {
  const searchParams = useSearchParams();
  const resultCode = searchParams.get("resultCode");
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  const isSuccess = resultCode === "0";

  return (
    <PageShell>
      <section className="relative min-h-screen px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />

        <div className="mx-auto max-w-lg pt-20">
          {isSuccess ? (
            <div className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a] text-3xl text-white">
                ✓
              </div>
              <h1 className="text-2xl font-black text-[#166534]">Thanh toán thành công!</h1>
              <p className="mt-3 text-base font-semibold text-[#166534]">
                Đơn hàng: {orderId}
              </p>
              <p className="mt-1 text-sm text-[#496779]">{message}</p>
              <Link
                className="mt-6 inline-flex h-11 items-center justify-center rounded-[8px] bg-[#16a34a] px-5 text-sm font-black text-white"
                href="/account/bookings"
              >
                Xem đơn đặt tour
              </Link>
            </div>
          ) : (
            <div className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ef4444] text-3xl text-white">
                ✗
              </div>
              <h1 className="text-2xl font-black text-[#9a3412]">Thanh toán thất bại</h1>
              <p className="mt-3 text-base font-semibold text-[#9a3412]">
                Mã lỗi: {resultCode}
              </p>
              <p className="mt-1 text-sm text-[#496779]">{message}</p>
              <Link
                className="mt-6 inline-flex h-11 items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white"
                href="/account/bookings"
              >
                Xem đơn đặt tour
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-lg font-semibold text-[#496779]">
          Đang xử lý kết quả thanh toán...
        </div>
      }
    >
      <PaymentResult />
    </Suspense>
  );
}
