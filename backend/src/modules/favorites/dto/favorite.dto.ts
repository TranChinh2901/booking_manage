import { TourResponseDto } from "@/modules/tours/dto/tour.dto";

export interface CreateFavoriteDto {
  tourId: number;
}

export interface FavoriteResponseDto {
  id: number;
  userId: number;
  tourId: number;
  tour?: TourResponseDto;
  createdAt: Date;
}
