import { TourResponseDto } from "@/modules/tours/dto/tour.dto";

import { TourScheduleStatus } from "../entities/tour-schedule.entity";

export interface CreateTourScheduleDto {
  tourId: number;
  startDate: string;
  endDate: string;
  availableSeats: number;
  priceAdult: number;
  priceChild?: number;
  status?: TourScheduleStatus;
}

export interface UpdateTourScheduleDto {
  startDate?: string;
  endDate?: string;
  availableSeats?: number;
  bookedSeats?: number;
  priceAdult?: number;
  priceChild?: number;
  status?: TourScheduleStatus;
}

export interface TourScheduleResponseDto {
  id: number;
  tourId: number;
  tour?: TourResponseDto;
  startDate: string;
  endDate: string;
  availableSeats: number;
  bookedSeats: number;
  remainingSeats: number;
  priceAdult: number;
  priceChild: number;
  status: TourScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}
