import { toCategoryResponseDto } from "@/modules/categories/category.mapper";
import { toDestinationResponseDto } from "@/modules/destinations/destination.mapper";

import { TourImageDto, TourResponseDto } from "./dto/tour.dto";
import { Tour } from "./entities/tour.entity";

export const toTourResponseDto = (tour: Tour): TourResponseDto => {
  return {
    id: tour.id,
    title: tour.title,
    slug: tour.slug,
    shortDescription: tour.shortDescription,
    description: tour.description,
    destinationId: tour.destinationId,
    destination: tour.destination
      ? toDestinationResponseDto(tour.destination)
      : undefined,
    categoryId: tour.categoryId,
    category: tour.category ? toCategoryResponseDto(tour.category) : undefined,
    priceAdult: Number(tour.priceAdult),
    priceChild: Number(tour.priceChild),
    durationDays: tour.durationDays,
    durationNights: tour.durationNights,
    departureLocation: tour.departureLocation,
    transport: tour.transport,
    maxPeople: tour.maxPeople,
    status: tour.status,
    images: (tour.images || []).map<TourImageDto>((image) => ({
      url: image.url,
      isThumbnail: image.isThumbnail,
      sortOrder: image.sortOrder,
    })),
    createdAt: tour.createdAt,
    updatedAt: tour.updatedAt,
  };
};
