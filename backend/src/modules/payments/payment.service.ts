import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { Booking, PaymentStatus } from "@/modules/bookings/entities/booking.entity";

import { ConfirmPaymentDto, CreatePaymentDto } from "./dto/payment.dto";
import { Payment, PaymentMethod, PaymentTransactionStatus } from "./entities/payment.entity";

export class PaymentService {
  private paymentRepository: Repository<Payment>;
  private bookingRepository: Repository<Booking>;

  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.bookingRepository = AppDataSource.getRepository(Booking);
  }

  async getAll(bookingId?: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: bookingId ? { bookingId } : {},
      relations: ["booking"],
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ["booking"],
    });

    if (!payment) {
      throw new AppError(
        "Payment not found",
        HttpStatusCode.NOT_FOUND,
        ErrorCode.BOOKING_NOT_FOUND
      );
    }

    return payment;
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new AppError(
        ErrorMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.BOOKING_NOT_FOUND
      );
    }

    const payment = this.paymentRepository.create({
      paymentCode: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`,
      bookingId: dto.bookingId,
      method: dto.method as PaymentMethod,
      amount: String(dto.amount),
      transactionRef: dto.transactionRef,
      note: dto.note,
    });

    return await this.paymentRepository.save(payment);
  }

  async confirm(id: number, dto: ConfirmPaymentDto): Promise<Payment> {
    const payment = await this.getById(id);

    if (payment.status !== PaymentTransactionStatus.PENDING) {
      throw new AppError(
        "Payment already processed",
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR
      );
    }

    payment.status = PaymentTransactionStatus.SUCCESS;
    payment.paidAt = new Date();
    if (dto.transactionRef) payment.transactionRef = dto.transactionRef;
    if (dto.note) payment.note = dto.note;

    await this.paymentRepository.save(payment);

    // Update booking payment status
    await this.bookingRepository.update(payment.bookingId, {
      paymentStatus: PaymentStatus.PAID,
    });

    return await this.getById(id);
  }

  async refund(id: number): Promise<Payment> {
    const payment = await this.getById(id);

    if (payment.status !== PaymentTransactionStatus.SUCCESS) {
      throw new AppError(
        "Only successful payments can be refunded",
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR
      );
    }

    payment.status = PaymentTransactionStatus.REFUNDED;
    await this.paymentRepository.save(payment);

    await this.bookingRepository.update(payment.bookingId, {
      paymentStatus: PaymentStatus.REFUNDED,
    });

    return await this.getById(id);
  }
}

export default new PaymentService();
