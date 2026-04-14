import { TourScheduleResponseDto } from "@/modules/tour-schedules/dto/tour-schedule.dto";
import { UserResponseDto } from "@/modules/users/dto/user.dto";

import { BookingStatus, PaymentStatus } from "../entities/booking.entity";

export interface CreateBookingDto {
  tourScheduleId: number;
  adultCount: number;
  childCount?: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note?: string;
}

export interface UpdateBookingStatusDto {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export interface BookingResponseDto {
  id: number;
  bookingCode: string;
  userId: number;
  user?: UserResponseDto;
  tourScheduleId: number;
  tourSchedule?: TourScheduleResponseDto;
  adultCount: number;
  childCount: number;
  totalAmount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
