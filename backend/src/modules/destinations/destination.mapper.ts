import { DestinationResponseDto } from "./dto/destination.dto";
import { Destination } from "./entities/destination.entity";

export const toDestinationResponseDto = (
  destination: Destination
): DestinationResponseDto => {
  return {
    id: destination.id,
    name: destination.name,
    slug: destination.slug,
    description: destination.description,
    image: destination.image,
    status: destination.status,
    createdAt: destination.createdAt,
    updatedAt: destination.updatedAt,
  };
};
