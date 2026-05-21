import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";
import { Footer } from "@/components/layout/footer";

export default function PolicyPage() {
  return (
    <PageShell>
      <section className="relative min-h-screen px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />
        <div className="mx-auto max-w-[800px] pt-14">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f97316]">
            Chính sách
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#062f42] sm:text-5xl">
            Chính sách & Điều khoản
          </h1>

          <div className="mt-8 space-y-6 text-base font-semibold leading-8 text-[#496779]">
            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Chính sách đặt tour</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Khách hàng cần đặt tour trước ít nhất 3 ngày so với ngày khởi hành.</li>
                <li>Thanh toán đầy đủ trước ngày khởi hành để xác nhận chỗ.</li>
                <li>Thông tin hành khách phải chính xác theo giấy tờ tùy thân.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Chính sách hủy tour</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Hủy trước 7 ngày: hoàn 100% tiền tour.</li>
                <li>Hủy trước 3-7 ngày: hoàn 70% tiền tour.</li>
                <li>Hủy trước 1-3 ngày: hoàn 50% tiền tour.</li>
                <li>Hủy trong ngày khởi hành: không hoàn tiền.</li>
                <li>Trường hợp bất khả kháng sẽ được xem xét riêng.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Chính sách thanh toán</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Hỗ trợ thanh toán qua: chuyển khoản ngân hàng, MoMo, VNPay, tiền mặt.</li>
                <li>Thanh toán trực tuyến được xử lý tức thì.</li>
                <li>Hóa đơn điện tử được gửi qua email sau khi thanh toán thành công.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Chính sách bảo mật</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Thông tin cá nhân của khách hàng được bảo mật tuyệt đối.</li>
                <li>Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý.</li>
                <li>Dữ liệu thanh toán được mã hóa theo tiêu chuẩn quốc tế.</li>
                <li>Khách hàng có quyền yêu cầu xóa dữ liệu cá nhân bất kỳ lúc nào.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-[#dff3fa] bg-white p-6">
              <h2 className="text-2xl font-black text-[#062f42]">Điều khoản sử dụng</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Người dùng phải từ 18 tuổi trở lên để đặt tour.</li>
                <li>Thông tin đăng ký phải chính xác và trung thực.</li>
                <li>Nghiêm cấm sử dụng dịch vụ cho mục đích bất hợp pháp.</li>
                <li>Northline Travel có quyền từ chối phục vụ nếu vi phạm điều khoản.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </PageShell>
  );
}
