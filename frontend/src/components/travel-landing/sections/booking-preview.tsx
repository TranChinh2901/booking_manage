import { bookingPreviewStats } from "../data";
import { CalendarIcon } from "../icons";

export function BookingPreview() {
  return (
    <section id="experiences" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#ecfeff_0%,#fff7ed_54%,#f0fdf4_100%)]" />
      <div className="aurora-sheet absolute left-[-12%] top-10 -z-10 h-80 w-[70vw] opacity-70 blur-3xl" />
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
            Booking Preview
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-5xl">
            See the trip shape before you commit.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#496779]">
            Every preview includes dates, route logic, hotel mood, private
            transfers, and guided moments with space left for wandering.
          </p>
        </div>

        <article className="rounded-[8px] border border-white/80 bg-white/88 p-5 shadow-[0_28px_80px_rgba(12,74,110,0.14)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-[#d7edf4] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#0e7490]">
                Featured Trip
              </p>
              <h3 className="mt-2 text-3xl font-black text-[#062f42]">
                Portugal color route
              </h3>
            </div>
            <p className="rounded-[8px] bg-[#ffedd5] px-4 py-3 text-lg font-black text-[#c2410c]">
              $4,680
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {bookingPreviewStats.map(([label, value]) => (
              <div className="rounded-[8px] bg-[#f8fdff] p-4" key={label}>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
                  {label}
                </p>
                <p className="mt-2 text-lg font-black text-[#0c3144]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-[8px] bg-[#062f42] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-white/12 text-[#67e8f9]">
                <CalendarIcon />
              </span>
              <div>
                <p className="font-black">Preview call available</p>
                <p className="mt-1 text-sm font-semibold text-white/72">
                  Review the route with a planner this week.
                </p>
              </div>
            </div>
            <a
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white transition-colors hover:bg-[#ea580c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="#planner"
            >
              Customize
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
