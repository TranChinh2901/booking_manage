import { CategoryResponseDto } from "@/modules/categories/dto/category.dto";
import { DestinationResponseDto } from "@/modules/destinations/dto/destination.dto";

import { TourStatus } from "../entities/tour.entity";

export interface TourImageDto {
  url: string;
  isThumbnail?: boolean;
  sortOrder?: number;
}

export interface CreateTourDto {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  destinationId: number;
  categoryId: number;
  priceAdult: number;
  priceChild?: number;
  durationDays?: number;
  durationNights?: number;
  departureLocation?: string;
  transport?: string;
  maxPeople?: number;
  status?: TourStatus;
  images?: TourImageDto[];
}

export interface UpdateTourDto {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  destinationId?: number;
  categoryId?: number;
  priceAdult?: number;
  priceChild?: number;
  durationDays?: number;
  durationNights?: number;
  departureLocation?: string;
  transport?: string;
  maxPeople?: number;
  status?: TourStatus;
  images?: TourImageDto[];
}

export interface TourQueryDto {
  keyword?: string;
  destinationId?: number;
  categoryId?: number;
  status?: TourStatus;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

export interface TourResponseDto {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  destinationId: number;
  destination?: DestinationResponseDto;
  categoryId: number;
  category?: CategoryResponseDto;
  priceAdult: number;
  priceChild: number;
  durationDays: number;
  durationNights: number;
  departureLocation?: string;
  transport?: string;
  maxPeople: number;
  status: TourStatus;
  images: TourImageDto[];
  createdAt: Date;
  updatedAt: Date;
}
