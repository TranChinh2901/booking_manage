import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";
import { getDestinations, getTours } from "@/lib/api/tours";
import type { Destination, Tour } from "@/lib/api/types";
import {
  getTourDuration,
  getTourImage,
  getTourLocation,
  getTourPrice,
} from "@/lib/tour-view";

export const dynamic = "force-dynamic";

type ToursPageProps = {
  searchParams: Promise<{
    destinationId?: string;
    keyword?: string;
    page?: string;
  }>;
};

async function loadTours(keyword?: string, page?: string, destinationId?: string) {
  try {
    return await getTours({
      keyword,
      destinationId: destinationId ? Number(destinationId) : undefined,
      page: page ? Number(page) : 1,
      limit: 9,
    });
  } catch {
    return null;
  }
}

async function loadDestinations() {
  try {
    return await getDestinations();
  } catch {
    return [];
  }
}

function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      className="group overflow-hidden rounded-[8px] border border-[#dff3fa] bg-white shadow-[0_20px_55px_rgba(12,74,110,0.09)]"
      href={`/tours/${tour.slug}`}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          alt={tour.title}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 48vw, 94vw"
          src={getTourImage(tour)}
        />
      </div>
      <div className="p-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0e7490]">
          {getTourLocation(tour)}
        </p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-[#062f42]">
          {tour.title}
        </h2>
        <p className="mt-3 min-h-14 text-base font-semibold leading-7 text-[#496779]">
          {tour.shortDescription || tour.category?.name || "Hành trình du lịch trọn gói"}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-[#e3f2f7] pt-4">
          <span className="text-sm font-black text-[#0e7490]">
            {getTourDuration(tour)}
          </span>
          <span className="text-xl font-black text-[#f97316]">
            {getTourPrice(tour)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const { destinationId, keyword, page } = await searchParams;
  const [result, destinations] = await Promise.all([
    loadTours(keyword, page, destinationId),
    loadDestinations(),
  ]);
  const tours = result?.items || [];
  const selectedDestination = destinations.find(
    (destination) => String(destination.id) === destinationId
  );

  return (
    <PageShell>
      <section className="relative px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />

        <div className="mx-auto max-w-[1200px] pt-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
                Tour
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-6xl">
                {selectedDestination
                  ? `Tour tại ${selectedDestination.name}.`
                  : "Chọn hành trình phù hợp."}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#496779]">
                {selectedDestination?.description ||
                  "Tìm kiếm tour theo điểm đến, so sánh giá, thời gian và lịch khởi hành."}
              </p>
            </div>

            <form
              action="/tours"
              className="grid gap-3 rounded-[8px] border border-white/80 bg-white/86 p-3 shadow-[0_24px_70px_rgba(12,74,110,0.12)] backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto]"
              method="get"
            >
              <select
                className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors focus:border-[#0ea5e9] sm:w-56"
                defaultValue={destinationId || ""}
                name="destinationId"
              >
                <option value="">Tất cả điểm đến</option>
                {destinations.map((destination: Destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
              <input
                className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors placeholder:text-[#7b98a8] focus:border-[#0ea5e9] sm:w-72"
                defaultValue={keyword || ""}
                name="keyword"
                placeholder="Tìm kiếm tour..."
                type="text"
              />
              <button
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-6 text-sm font-black text-white transition-colors hover:bg-[#ea580c]"
                type="submit"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          {selectedDestination ? (
            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[8px] border border-[#dff3fa] bg-white p-4 text-sm font-bold text-[#496779]">
              <span>
                Đang lọc theo{" "}
                <strong className="text-[#062f42]">{selectedDestination.name}</strong>
              </span>
              <Link className="text-[#0e7490]" href="/tours">
                Xóa bộ lọc
              </Link>
            </div>
          ) : null}

          {!result ? (
            <div className="mt-12 rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-6 text-base font-semibold text-[#9a3412]">
              Không thể kết nối đến máy chủ. Vui lòng khởi động backend và tải lại trang.
            </div>
          ) : tours.length === 0 ? (
            <div className="mt-12 rounded-[8px] border border-[#dff3fa] bg-white p-6 text-base font-semibold text-[#496779]">
              Không tìm thấy tour phù hợp.
            </div>
          ) : (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
