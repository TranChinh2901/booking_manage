import { toTourScheduleResponseDto } from "@/modules/tour-schedules/tour-schedule.mapper";
import { toUserResponseDto } from "@/modules/users/user.mapper";

import { BookingResponseDto } from "./dto/booking.dto";
import { Booking } from "./entities/booking.entity";

export const toBookingResponseDto = (booking: Booking): BookingResponseDto => {
  return {
    id: booking.id,
    bookingCode: booking.bookingCode,
    userId: booking.userId,
    user: booking.user ? toUserResponseDto(booking.user) : undefined,
    tourScheduleId: booking.tourScheduleId,
    tourSchedule: booking.tourSchedule
      ? toTourScheduleResponseDto(booking.tourSchedule)
      : undefined,
    adultCount: booking.adultCount,
    childCount: booking.childCount,
    totalAmount: Number(booking.totalAmount),
    contactName: booking.contactName,
    contactEmail: booking.contactEmail,
    contactPhone: booking.contactPhone,
    note: booking.note,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
};
