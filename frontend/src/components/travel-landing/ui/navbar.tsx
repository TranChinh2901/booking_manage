import { CompassIcon } from "../icons";

export function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto flex max-w-[1200px] items-center justify-between rounded-[8px] border border-white/70 bg-white/78 px-4 py-3 shadow-[0_18px_55px_rgba(12,74,110,0.12)] backdrop-blur-xl"
    >
      <a className="flex items-center gap-3 font-black text-[#073449]" href="#top">
        <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#0ea5e9] text-white shadow-[0_12px_28px_rgba(14,165,233,0.28)]">
          <CompassIcon />
        </span>
        Northline
      </a>
      <div className="hidden items-center gap-8 text-sm font-bold text-[#496779] md:flex">
        <a className="transition-colors hover:text-[#0c4a6e]" href="#destinations">
          Destinations
        </a>
        <a className="transition-colors hover:text-[#0c4a6e]" href="#experiences">
          Experiences
        </a>
        <a className="transition-colors hover:text-[#0c4a6e]" href="#contact">
          Contact
        </a>
      </div>
      <a
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white shadow-[0_14px_32px_rgba(249,115,22,0.3)] transition-colors hover:bg-[#ea580c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
        href="#planner"
      >
        Start Planning
      </a>
    </nav>
  );
}
