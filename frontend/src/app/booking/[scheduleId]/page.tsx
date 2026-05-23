import { notFound } from "next/navigation";

import { BookingForm } from "@/components/booking/booking-form";
import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";
import { getTourSchedules } from "@/lib/api/tours";
import { formatCurrency, formatDate } from "@/lib/format";
import { getTourDuration, getTourLocation } from "@/lib/tour-view";

export const dynamic = "force-dynamic";

type BookingPageProps = {
  params: Promise<{
    scheduleId: string;
  }>;
};

async function loadSchedule(scheduleId: number) {
  try {
    const schedules = await getTourSchedules();
    return schedules.find((schedule) => schedule.id === scheduleId) || null;
  } catch {
    return null;
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { scheduleId } = await params;
  const schedule = await loadSchedule(Number(scheduleId));

  if (!schedule) {
    notFound();
  }

  const tour = schedule.tour;

  return (
    <PageShell>
      <section className="relative min-h-screen px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />

        <div className="mx-auto grid max-w-[1200px] gap-8 pt-14 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_24px_70px_rgba(12,74,110,0.1)]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
              Đặt tour
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42]">
              {tour?.title || "Tour du lịch"}
            </h1>
            <div className="mt-6 space-y-4 text-base font-semibold leading-7 text-[#496779]">
              <p>Điểm đến: {tour ? getTourLocation(tour) : "Đang cập nhật"}</p>
              <p>Thời gian: {tour ? getTourDuration(tour) : "Đang cập nhật"}</p>
              <p>
                Lịch trình: {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
              </p>
              <p>Số chỗ còn lại: {schedule.remainingSeats}</p>
              <p>Giá người lớn: {formatCurrency(schedule.priceAdult)}</p>
              <p>Giá trẻ em: {formatCurrency(schedule.priceChild)}</p>
            </div>
          </aside>

          <BookingForm schedule={schedule} />
        </div>
      </section>
    </PageShell>
  );
}
