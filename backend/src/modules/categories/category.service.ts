import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { slugify } from "@/helpers/slugify";

import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { Category, CategoryStatus } from "./entities/category.entity";

export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async getAll(activeOnly = false, includeInactive = false): Promise<Category[]> {
    return await this.categoryRepository.find({
      where:
        activeOnly || !includeInactive
          ? { status: CategoryStatus.ACTIVE }
          : {},
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new AppError(
        ErrorMessages.CATEGORY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.CATEGORY_NOT_FOUND
      );
    }

    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug || slugify(dto.name);
    await this.ensureSlugAvailable(slug);

    const category = this.categoryRepository.create({
      ...dto,
      slug,
    });

    return await this.categoryRepository.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getById(id);
    const slug = dto.slug || (dto.name ? slugify(dto.name) : undefined);

    if (slug && slug !== category.slug) {
      await this.ensureSlugAvailable(slug);
      category.slug = slug;
    }

    this.categoryRepository.merge(category, {
      ...dto,
      slug: category.slug,
    });

    return await this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    const category = await this.getById(id);
    category.status = CategoryStatus.INACTIVE;
    await this.categoryRepository.save(category);
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    const exists = await this.categoryRepository.count({ where: { slug } });
    if (exists > 0) {
      throw new AppError(
        ErrorMessages.SLUG_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.SLUG_ALREADY_EXISTS
      );
    }
  }
}

export default new CategoryService();
