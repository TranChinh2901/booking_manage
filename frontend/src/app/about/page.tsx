import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="relative min-h-screen px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />
        <div className="mx-auto max-w-[800px] pt-14">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
            Về chúng tôi
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-5xl">
            Northline Travel
          </h1>

          <div className="mt-8 space-y-6 text-base font-semibold leading-8 text-[#496779]">
            <p>
              Northline Travel là đơn vị chuyên cung cấp dịch vụ du lịch trọn gói với hơn 10 năm
              kinh nghiệm trong ngành. Chúng tôi cam kết mang đến cho khách hàng những trải nghiệm
              du lịch tuyệt vời nhất với giá cả hợp lý.
            </p>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Tầm nhìn</h2>
              <p className="mt-3">
                Trở thành đơn vị du lịch hàng đầu Việt Nam, kết nối mọi người với những điểm đến
                tuyệt vời trên khắp đất nước và thế giới.
              </p>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Sứ mệnh</h2>
              <p className="mt-3">
                Cung cấp dịch vụ du lịch chất lượng cao, an toàn và tiện lợi. Mỗi chuyến đi là một
                hành trình khám phá, mỗi khách hàng là một người bạn đồng hành.
              </p>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Giá trị cốt lõi</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Chất lượng dịch vụ là ưu tiên hàng đầu</li>
                <li>Minh bạch trong giá cả và chính sách</li>
                <li>Đội ngũ hướng dẫn viên chuyên nghiệp, nhiệt tình</li>
                <li>Hỗ trợ khách hàng 24/7</li>
                <li>Cam kết hoàn tiền nếu không hài lòng</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Liên hệ</h2>
              <div className="mt-3 space-y-2">
                <p>📍 Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                <p>📞 Hotline: 1900 1234</p>
                <p>✉️ Email: info@northlinetravel.com</p>
                <p>🕐 Giờ làm việc: 8:00 - 20:00 (Thứ 2 - Chủ nhật)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PageShell>
  );
}
