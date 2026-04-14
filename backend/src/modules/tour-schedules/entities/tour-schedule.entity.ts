import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Booking } from "@/modules/bookings/entities/booking.entity";
import { Tour } from "@/modules/tours/entities/tour.entity";

export enum TourScheduleStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

@Entity("tour_schedules")
export class TourSchedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tourId!: number;

  @ManyToOne(() => Tour, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "tourId" })
  tour!: Tour;

  @Column({ type: "date" })
  startDate!: string;

  @Column({ type: "date" })
  endDate!: string;

  @Column()
  availableSeats!: number;

  @Column({ default: 0 })
  bookedSeats!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  priceAdult!: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  priceChild!: string;

  @Column({
    type: "enum",
    enum: TourScheduleStatus,
    default: TourScheduleStatus.OPEN,
  })
  status!: TourScheduleStatus;

  @OneToMany(() => Booking, (booking) => booking.tourSchedule)
  bookings!: Booking[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
