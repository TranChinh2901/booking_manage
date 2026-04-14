import Image from "next/image";
import { heroDestinations } from "../data";
import { BookingSearchForm } from "../ui/booking-search-form";
import { Navbar } from "../ui/navbar";

export function HeroSection() {
  return (
    <section className="relative px-4 pb-20 pt-5 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_16%,rgba(20,184,166,0.34),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(251,113,133,0.34),transparent_30%),linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
      <div className="aurora-wave absolute left-[-18%] top-20 -z-10 h-80 w-[78vw] opacity-80 blur-3xl" />
      <div className="aurora-wave-secondary absolute bottom-6 right-[-22%] -z-10 h-80 w-[72vw] opacity-70 blur-3xl" />

      <Navbar />

      <div
        id="top"
        className="mx-auto grid max-w-[1200px] gap-12 pt-16 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:pt-24"
      >
        <div>
          <p className="inline-flex items-center gap-3 rounded-[8px] border border-white/80 bg-white/72 px-4 py-2 text-sm font-black text-[#0e7490] shadow-[0_14px_42px_rgba(12,74,110,0.1)] backdrop-blur-lg">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            Tailor-made travel, built like a modern product
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-[#062f42] sm:text-6xl lg:text-7xl">
            Travel brighter with trips designed around you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#496779]">
            Discover vivid destinations, compare curated experiences, and
            preview your route before a single booking is made.
          </p>

          <BookingSearchForm />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {heroDestinations.map((destination, index) => (
            <article
              className={`group relative overflow-hidden rounded-[8px] bg-[#0c4a6e] shadow-[0_24px_60px_rgba(12,74,110,0.16)] ${
                index === 0 || index === 3 ? "min-h-[260px]" : "min-h-[220px] lg:translate-y-8"
              }`}
              key={destination.city}
            >
              <Image
                alt={destination.alt}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                fill
                sizes="(min-width: 1024px) 292px, 46vw"
                src={destination.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061f2a]/78 via-[#061f2a]/16 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h2 className="text-2xl font-black">{destination.city}</h2>
                <p className="mt-1 text-sm font-bold text-white/78">{destination.country}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
