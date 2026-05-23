import { ArrowIcon } from "../icons";

export function BookingSearchForm() {
  return (
    <form
      action="/tours"
      className="mt-8 grid gap-3 rounded-[8px] border border-white/80 bg-white/86 p-3 shadow-[0_24px_70px_rgba(12,74,110,0.16)] backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto]"
      method="get"
    >
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
          Điểm đến
        </span>
        <input
          className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors placeholder:text-[#7b98a8] focus:border-[#0ea5e9]"
          name="keyword"
          placeholder="Bạn muốn đi đâu?"
          type="text"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
          Ngày đi
        </span>
        <input
          className="h-12 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-4 text-sm font-semibold text-[#0c3144] outline-none transition-colors placeholder:text-[#7b98a8] focus:border-[#0ea5e9]"
          name="dates"
          placeholder="18/05 - 26/05"
          type="text"
        />
      </label>
      <button
        className="mt-0 inline-flex h-12 cursor-pointer items-center justify-center gap-2 self-end rounded-[8px] bg-[#f97316] px-6 text-sm font-black text-white shadow-[0_14px_32px_rgba(249,115,22,0.28)] transition-colors hover:bg-[#ea580c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
        type="submit"
      >
        Tìm kiếm
        <ArrowIcon />
      </button>
    </form>
  );
}
