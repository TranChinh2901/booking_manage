import nodemailer from "nodemailer";

import { loadedEnv } from "@/config/load-env";
import { logger } from "@/utils/logger";

const transporter = nodemailer.createTransport({
  host: loadedEnv.mail.host,
  port: loadedEnv.mail.port,
  secure: loadedEnv.mail.port === 465,
  auth: {
    user: loadedEnv.mail.user,
    pass: loadedEnv.mail.pass,
  },
});

interface BookingEmailData {
  contactName: string;
  contactEmail: string;
  bookingCode: string;
  tourName: string;
  startDate: string;
  endDate: string;
  adultCount: number;
  childCount: number;
  totalAmount: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  if (!loadedEnv.mail.user) {
    logger.log("Mail not configured, skipping email send");
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0e7490;">Xác nhận đặt tour thành công!</h2>
      <p>Xin chào <strong>${data.contactName}</strong>,</p>
      <p>Cảm ơn bạn đã đặt tour. Dưới đây là thông tin đặt tour của bạn:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mã đặt tour</td><td style="padding: 8px; border: 1px solid #ddd;">${data.bookingCode}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Tour</td><td style="padding: 8px; border: 1px solid #ddd;">${data.tourName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ngày khởi hành</td><td style="padding: 8px; border: 1px solid #ddd;">${data.startDate}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Ngày kết thúc</td><td style="padding: 8px; border: 1px solid #ddd;">${data.endDate}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Số người lớn</td><td style="padding: 8px; border: 1px solid #ddd;">${data.adultCount}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Số trẻ em</td><td style="padding: 8px; border: 1px solid #ddd;">${data.childCount}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Tổng tiền</td><td style="padding: 8px; border: 1px solid #ddd; color: #f97316; font-weight: bold;">${Number(data.totalAmount).toLocaleString("vi-VN")} VNĐ</td></tr>
      </table>
      <p>Chúng tôi sẽ liên hệ với bạn để xác nhận chi tiết. Nếu có thắc mắc, vui lòng liên hệ hotline.</p>
      <p style="color: #64748b; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: loadedEnv.mail.from,
      to: data.contactEmail,
      subject: `[Travel Booking] Xác nhận đặt tour - ${data.bookingCode}`,
      html,
    });
    logger.success(`Booking confirmation email sent to ${data.contactEmail}`);
  } catch (error) {
    logger.error(`Failed to send email to ${data.contactEmail}: ${error}`);
  }
}

export async function sendBookingCancelledEmail(data: {
  contactName: string;
  contactEmail: string;
  bookingCode: string;
  tourName: string;
}) {
  if (!loadedEnv.mail.user) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Thông báo hủy đặt tour</h2>
      <p>Xin chào <strong>${data.contactName}</strong>,</p>
      <p>Đơn đặt tour <strong>${data.bookingCode}</strong> cho tour <strong>${data.tourName}</strong> đã được hủy.</p>
      <p>Nếu bạn không thực hiện thao tác này hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
      <p style="color: #64748b; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: loadedEnv.mail.from,
      to: data.contactEmail,
      subject: `[Travel Booking] Hủy đặt tour - ${data.bookingCode}`,
      html,
    });
  } catch (error) {
    logger.error(`Failed to send cancellation email: ${error}`);
  }
}
