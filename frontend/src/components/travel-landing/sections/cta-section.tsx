import { ArrowIcon } from "../icons";

export function CtaSection() {
  return (
    <section id="planner" className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[8px] bg-[#062f42] p-8 text-white shadow-[0_30px_90px_rgba(12,74,110,0.2)] md:p-12">
        <div className="aurora-wave-secondary absolute right-[-24%] top-[-30%] h-72 w-[70vw] opacity-50 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#fef08a]">
              Plan Your Next Adventure
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Plan your next adventure.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
              Share your destination shortlist, travel dates, and ideal pace. A
              planner will turn it into a clear first route.
            </p>
          </div>
          <a
            className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#f97316] px-7 text-base font-black text-white shadow-[0_18px_42px_rgba(249,115,22,0.3)] transition-colors hover:bg-[#ea580c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            href="mailto:hoang99101@donga.edu.vn?subject=Trip%20planner%20request"
            id="contact"
          >
            Contact a Planner
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
