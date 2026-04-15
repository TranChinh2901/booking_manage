import { toTourResponseDto } from "@/modules/tours/tour.mapper";
import { toUserResponseDto } from "@/modules/users/user.mapper";

import { ReviewResponseDto } from "./dto/review.dto";
import { Review } from "./entities/review.entity";

export const toReviewResponseDto = (review: Review): ReviewResponseDto => {
  return {
    id: review.id,
    userId: review.userId,
    user: review.user ? toUserResponseDto(review.user) : undefined,
    tourId: review.tourId,
    tour: review.tour ? toTourResponseDto(review.tour) : undefined,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
};
