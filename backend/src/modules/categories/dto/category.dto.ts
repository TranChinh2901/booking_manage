import { CategoryStatus } from "../entities/category.entity";

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  status?: CategoryStatus;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
  status?: CategoryStatus;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}
