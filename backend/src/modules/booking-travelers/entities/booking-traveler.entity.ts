import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Booking } from "@/modules/bookings/entities/booking.entity";

export enum TravelerType {
  ADULT = "ADULT",
  CHILD = "CHILD",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

@Entity("booking_travelers")
export class BookingTraveler {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookingId!: number;

  @ManyToOne(() => Booking, { onDelete: "CASCADE" })
  @JoinColumn({ name: "bookingId" })
  booking!: Booking;

  @Column()
  fullName!: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: string;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ type: "enum", enum: TravelerType })
  travelerType!: TravelerType;

  @Column({ nullable: true })
  identityNumber?: string;

  @Column({ nullable: true })
  nationality?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
