import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { TourSchedule } from "@/modules/tour-schedules/entities/tour-schedule.entity";
import { User } from "@/modules/users/entities/user.entity";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

@Entity("bookings")
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  bookingCode!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  tourScheduleId!: number;

  @ManyToOne(() => TourSchedule, (schedule) => schedule.bookings, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "tourScheduleId" })
  tourSchedule!: TourSchedule;

  @Column()
  adultCount!: number;

  @Column({ default: 0 })
  childCount!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  totalAmount!: string;

  @Column()
  contactName!: string;

  @Column()
  contactEmail!: string;

  @Column()
  contactPhone!: string;

  @Column({ type: "text", nullable: true })
  note?: string;

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus!: PaymentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
