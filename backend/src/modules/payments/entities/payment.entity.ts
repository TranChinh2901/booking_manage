import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Booking } from "@/modules/bookings/entities/booking.entity";

export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOMO = "MOMO",
  VNPAY = "VNPAY",
}

export enum PaymentTransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  paymentCode!: string;

  @Column()
  bookingId!: number;

  @ManyToOne(() => Booking, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bookingId" })
  booking!: Booking;

  @Column({ type: "enum", enum: PaymentMethod })
  method!: PaymentMethod;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount!: string;

  @Column({ nullable: true })
  transactionRef?: string;

  @Column({
    type: "enum",
    enum: PaymentTransactionStatus,
    default: PaymentTransactionStatus.PENDING,
  })
  status!: PaymentTransactionStatus;

  @Column({ type: "datetime", nullable: true })
  paidAt?: Date;

  @Column({ type: "text", nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
