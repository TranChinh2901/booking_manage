import Image from "next/image";
import { destinations } from "../data";
import type { Tour } from "@/lib/api/types";
import {
  getTourDuration,
  getTourImage,
  getTourLocation,
  getTourPrice,
} from "@/lib/tour-view";
import Link from "next/link";

type DestinationShowcaseProps = {
  tours: Tour[];
};

export function DestinationShowcase({ tours }: DestinationShowcaseProps) {
  const hasTours = tours.length > 0;

  return (
    <section id="destinations" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
            Destination Showcase
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-5xl">
            Pick a place with the right color, climate, and pace.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {hasTours
            ? tours.map((tour) => (
                <Link
                  className="group overflow-hidden rounded-[8px] border border-[#dff3fa] bg-white shadow-[0_20px_55px_rgba(12,74,110,0.1)]"
                  href={`/tours/${tour.slug}`}
                  key={tour.id}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      alt={tour.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                      fill
                      sizes="(min-width: 768px) 380px, 94vw"
                      src={getTourImage(tour)}
                    />
                    <div className="absolute left-4 top-4 h-2 w-24 rounded-full bg-[#f97316]" />
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#64748b]">
                      {getTourLocation(tour)}
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-[#062f42]">
                      {tour.title}
                    </h3>
                    <p className="mt-3 min-h-14 text-base font-semibold leading-7 text-[#496779]">
                      {tour.shortDescription || tour.category?.name || "Complete travel itinerary"}
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
              ))
            : destinations.map((destination) => (
                <article
                  className="group overflow-hidden rounded-[8px] border border-[#dff3fa] bg-white shadow-[0_20px_55px_rgba(12,74,110,0.1)]"
                  key={destination.city}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      alt={destination.alt}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                      fill
                      sizes="(min-width: 768px) 380px, 94vw"
                      src={destination.image}
                    />
                    <div
                      className="absolute left-4 top-4 h-2 w-24 rounded-full"
                      style={{ backgroundColor: destination.accent }}
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#64748b]">
                      {destination.country}
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-[#062f42]">
                      {destination.city}
                    </h3>
                    <p className="mt-3 min-h-14 text-base font-semibold leading-7 text-[#496779]">
                      {destination.mood}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-[#e3f2f7] pt-4">
                      <span className="text-sm font-black text-[#0e7490]">
                        {destination.days}
                      </span>
                      <span className="text-xl font-black text-[#f97316]">
                        {destination.price}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
