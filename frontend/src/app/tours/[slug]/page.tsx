import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";
import { getTourBySlug, getTourReviews, getTourSchedules } from "@/lib/api/tours";
import type { Review, Tour } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import {
  getTourDuration,
  getTourImage,
  getTourLocation,
  getTourPrice,
} from "@/lib/tour-view";

export const dynamic = "force-dynamic";

type TourDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function loadTour(slug: string) {
  try {
    return await getTourBySlug(slug);
  } catch {
    return null;
  }
}

async function loadSchedules(tour: Tour) {
  try {
    return await getTourSchedules(tour.id);
  } catch {
    return [];
  }
}

async function loadReviews(tourId: number) {
  try {
    return await getTourReviews(tourId);
  } catch {
    return [];
  }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const tour = await loadTour(slug);

  if (!tour) {
    notFound();
  }

  const schedules = await loadSchedules(tour);
  const reviews = await loadReviews(tour.id);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <PageShell>
      <section className="relative px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />

        <div className="mx-auto grid max-w-[1200px] gap-10 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <Link className="text-sm font-black text-[#0e7490]" href="/tours">
              Back to tours
            </Link>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
              {getTourLocation(tour)}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-6xl">
              {tour.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#496779]">
              {tour.shortDescription || "A complete travel journey with a clear itinerary."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] bg-white p-4 shadow-[0_18px_45px_rgba(12,74,110,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
                  Duration
                </p>
                <p className="mt-2 text-lg font-black text-[#062f42]">
                  {getTourDuration(tour)}
                </p>
              </div>
              <div className="rounded-[8px] bg-white p-4 shadow-[0_18px_45px_rgba(12,74,110,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
                  From
                </p>
                <p className="mt-2 text-lg font-black text-[#f97316]">
                  {getTourPrice(tour)}
                </p>
              </div>
              <div className="rounded-[8px] bg-white p-4 shadow-[0_18px_45px_rgba(12,74,110,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
                  Guests
                </p>
                <p className="mt-2 text-lg font-black text-[#062f42]">
                  Up to {tour.maxPeople}
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[8px] shadow-[0_28px_80px_rgba(12,74,110,0.18)]">
            <Image
              alt={tour.title}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 570px, 94vw"
              src={getTourImage(tour)}
            />
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1200px] gap-8 lg:grid-cols-[1fr_380px]">
          <article className="rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_20px_55px_rgba(12,74,110,0.08)]">
            <h2 className="text-3xl font-black text-[#062f42]">Tour information</h2>
            <div className="mt-5 space-y-4 text-base font-semibold leading-8 text-[#496779]">
              <p>{tour.description || tour.shortDescription || "Detailed content will be updated soon."}</p>
              {tour.departureLocation ? <p>Departure: {tour.departureLocation}</p> : null}
              {tour.transport ? <p>Transport: {tour.transport}</p> : null}
              {tour.category?.name ? <p>Category: {tour.category.name}</p> : null}
            </div>
          </article>

          <aside className="rounded-[8px] border border-[#dff3fa] bg-white p-5 shadow-[0_20px_55px_rgba(12,74,110,0.08)]">
            <h2 className="text-2xl font-black text-[#062f42]">Departure schedules</h2>
            <div className="mt-5 space-y-3">
              {schedules.length === 0 ? (
                <p className="text-base font-semibold leading-7 text-[#496779]">
                  No open departure schedules yet.
                </p>
              ) : (
                schedules.map((schedule) => (
                  <div
                    className="rounded-[8px] border border-[#e3f2f7] bg-[#f8fdff] p-4"
                    key={schedule.id}
                  >
                    <p className="font-black text-[#062f42]">
                      {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#496779]">
                      {schedule.remainingSeats} seats left
                    </p>
                    <Link
                      className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white transition-colors hover:bg-[#ea580c]"
                      href={`/booking/${schedule.id}`}
                    >
                      Book tour
                    </Link>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* Reviews section */}
        <div className="mx-auto mt-12 max-w-[1200px]">
          <div className="rounded-[8px] border border-[#dff3fa] bg-white p-6 shadow-[0_20px_55px_rgba(12,74,110,0.08)]">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-[#062f42]">Đánh giá</h2>
              {avgRating && (
                <span className="rounded-full bg-[#f97316] px-3 py-1 text-sm font-black text-white">
                  ★ {avgRating} ({reviews.length} đánh giá)
                </span>
              )}
            </div>
            <div className="mt-6 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-base font-semibold text-[#496779]">
                  Chưa có đánh giá nào cho tour này.
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    className="rounded-[8px] border border-[#e3f2f7] bg-[#f8fdff] p-4"
                    key={review.id}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black text-[#062f42]">
                        {review.user?.name || "Khách hàng"}
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            className={i < review.rating ? "text-[#f97316]" : "text-[#d1d5db]"}
                            key={i}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm font-semibold text-[#496779]">
                        {review.comment}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[#94a3b8]">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
