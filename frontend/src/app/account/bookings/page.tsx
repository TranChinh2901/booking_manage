import { MyBookings } from "@/components/account/my-bookings";
import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";

export default function AccountBookingsPage() {
  return (
    <PageShell>
      <section className="relative min-h-screen px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />
        <div className="mx-auto max-w-[1200px] pt-14">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
            Tài khoản
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-6xl">
            Đơn đặt của tôi.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#496779]">
            Theo dõi lịch sử tour, trạng thái xử lý và hủy đặt tour khi cần.
          </p>
          <MyBookings />
        </div>
      </section>
    </PageShell>
  );
}
