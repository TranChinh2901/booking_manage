import { DestinationStatus } from "../entities/destination.entity";

export interface CreateDestinationDto {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: DestinationStatus;
}

export interface UpdateDestinationDto {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: DestinationStatus;
}

export interface DestinationResponseDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: DestinationStatus;
  createdAt: Date;
  updatedAt: Date;
}
