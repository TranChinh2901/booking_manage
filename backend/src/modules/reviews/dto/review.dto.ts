import { TourResponseDto } from "@/modules/tours/dto/tour.dto";
import { UserResponseDto } from "@/modules/users/dto/user.dto";

import { ReviewStatus } from "../entities/review.entity";

export interface CreateReviewDto {
  tourId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  status?: ReviewStatus;
}

export interface ReviewResponseDto {
  id: number;
  userId: number;
  user?: UserResponseDto;
  tourId: number;
  tour?: TourResponseDto;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}
