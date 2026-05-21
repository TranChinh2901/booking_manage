import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#dff3fa] bg-[#062f42] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1200px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-black">Northline Travel</h3>
          <p className="mt-3 text-sm font-semibold text-[#94a3b8]">
            Đơn vị du lịch uy tín hàng đầu Việt Nam. Mang đến trải nghiệm du lịch tuyệt vời cho
            mọi khách hàng.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-wider">Khám phá</h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#94a3b8]">
            <li><Link className="hover:text-white" href="/tours">Tour du lịch</Link></li>
            <li><Link className="hover:text-white" href="/posts">Cẩm nang du lịch</Link></li>
            <li><Link className="hover:text-white" href="/#destinations">Điểm đến</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-wider">Hỗ trợ</h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#94a3b8]">
            <li><Link className="hover:text-white" href="/about">Về chúng tôi</Link></li>
            <li><Link className="hover:text-white" href="/policy">Chính sách & Điều khoản</Link></li>
            <li><Link className="hover:text-white" href="/#contact">Liên hệ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-wider">Liên hệ</h4>
          <ul className="mt-3 space-y-2 text-sm font-semibold text-[#94a3b8]">
            <li>📍 123 Nguyễn Huệ, Q.1, TP.HCM</li>
            <li>📞 1900 1234</li>
            <li>✉️ info@northlinetravel.com</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1200px] border-t border-[#1e3a4f] pt-6 text-center text-sm font-semibold text-[#64748b]">
        © {new Date().getFullYear()} Northline Travel. All rights reserved.
      </div>
    </footer>
  );
}
