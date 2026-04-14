import { CategoryResponseDto } from "./dto/category.dto";
import { Category } from "./entities/category.entity";

export const toCategoryResponseDto = (
  category: Category
): CategoryResponseDto => {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};
