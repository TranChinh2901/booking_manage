import { toTourResponseDto } from "@/modules/tours/tour.mapper";

import { FavoriteResponseDto } from "./dto/favorite.dto";
import { Favorite } from "./entities/favorite.entity";

export const toFavoriteResponseDto = (
  favorite: Favorite
): FavoriteResponseDto => {
  return {
    id: favorite.id,
    userId: favorite.userId,
    tourId: favorite.tourId,
    tour: favorite.tour ? toTourResponseDto(favorite.tour) : undefined,
    createdAt: favorite.createdAt,
  };
};
