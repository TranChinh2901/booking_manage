import { toTourResponseDto } from "@/modules/tours/tour.mapper";

import { TourScheduleResponseDto } from "./dto/tour-schedule.dto";
import { TourSchedule } from "./entities/tour-schedule.entity";

export const toTourScheduleResponseDto = (
  schedule: TourSchedule
): TourScheduleResponseDto => {
  return {
    id: schedule.id,
    tourId: schedule.tourId,
    tour: schedule.tour ? toTourResponseDto(schedule.tour) : undefined,
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    availableSeats: schedule.availableSeats,
    bookedSeats: schedule.bookedSeats,
    remainingSeats: schedule.availableSeats - schedule.bookedSeats,
    priceAdult: Number(schedule.priceAdult),
    priceChild: Number(schedule.priceChild),
    status: schedule.status,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
};
