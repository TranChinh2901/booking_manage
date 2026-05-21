import crypto from "crypto";

import { loadedEnv } from "@/config/load-env";
import { AppDataSource } from "@/config/config-database";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { Booking, PaymentStatus } from "@/modules/bookings/entities/booking.entity";

const { partnerCode, accessKey, secretKey, endpoint, returnUrl, notifyUrl } = loadedEnv.momo;

export interface MoMoPaymentResult {
  payUrl: string;
  orderId: string;
}

export interface MoMoCallbackBody {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

class PaymentService {
  async createMoMoPayment(bookingId: number): Promise<MoMoPaymentResult> {
    const booking = await AppDataSource.getRepository(Booking).findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new AppError("Booking not found", HttpStatusCode.NOT_FOUND, "BOOKING_NOT_FOUND");
    }

    const orderId = `${booking.bookingCode}_${Date.now()}`;
    const requestId = orderId;
    const amount = Math.round(Number(booking.totalAmount));
    const orderInfo = `Thanh toan tour - ${booking.bookingCode}`;
    const requestType = "payWithMethod";
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const body = {
      partnerCode,
      partnerName: "Tour Booking",
      storeId: "TourStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: returnUrl,
      ipnUrl: notifyUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.resultCode !== 0) {
      throw new AppError(
        data.message || "MoMo payment creation failed",
        HttpStatusCode.BAD_REQUEST,
        "MOMO_PAYMENT_FAILED"
      );
    }

    return { payUrl: data.payUrl, orderId };
  }

  async handleMoMoCallback(body: MoMoCallbackBody): Promise<void> {
    // Verify signature
    const rawSignature = `accessKey=${accessKey}&amount=${body.amount}&extraData=${body.extraData}&message=${body.message}&orderId=${body.orderId}&orderInfo=${body.orderInfo}&orderType=${body.orderType}&partnerCode=${body.partnerCode}&payType=${body.payType}&requestId=${body.requestId}&responseTime=${body.responseTime}&resultCode=${body.resultCode}&transId=${body.transId}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    if (signature !== body.signature) {
      throw new AppError("Invalid signature", HttpStatusCode.BAD_REQUEST, "INVALID_SIGNATURE");
    }

    // Extract bookingCode from orderId (format: BK123456789_timestamp)
    const bookingCode = body.orderId.split("_").slice(0, -1).join("_");

    const bookingRepo = AppDataSource.getRepository(Booking);
    const booking = await bookingRepo.findOne({ where: { bookingCode } });

    if (!booking) {
      return;
    }

    if (body.resultCode === 0) {
      booking.paymentStatus = PaymentStatus.PAID;
    } else {
      booking.paymentStatus = PaymentStatus.FAILED;
    }

    await bookingRepo.save(booking);
  }
}

export default new PaymentService();
