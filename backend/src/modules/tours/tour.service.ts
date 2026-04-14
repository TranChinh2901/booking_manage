import { Brackets, Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { slugify } from "@/helpers/slugify";
import { Category } from "@/modules/categories/entities/category.entity";
import { Destination } from "@/modules/destinations/entities/destination.entity";

import { CreateTourDto, TourQueryDto, UpdateTourDto } from "./dto/tour.dto";
import { TourImage } from "./entities/tour-image.entity";
import { Tour, TourStatus } from "./entities/tour.entity";

export class TourService {
  private tourRepository: Repository<Tour>;
  private destinationRepository: Repository<Destination>;
  private categoryRepository: Repository<Category>;

  constructor() {
    this.tourRepository = AppDataSource.getRepository(Tour);
    this.destinationRepository = AppDataSource.getRepository(Destination);
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  async getAll(query: TourQueryDto = {}, activeOnly = false) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;

    const queryBuilder = this.tourRepository
      .createQueryBuilder("tour")
      .leftJoinAndSelect("tour.destination", "destination")
      .leftJoinAndSelect("tour.category", "category")
      .leftJoinAndSelect("tour.images", "images")
      .orderBy("tour.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (activeOnly) {
      queryBuilder.andWhere("tour.status = :status", {
        status: TourStatus.ACTIVE,
      });
    } else if (query.status) {
      queryBuilder.andWhere("tour.status = :status", { status: query.status });
    }

    if (query.destinationId) {
      queryBuilder.andWhere("tour.destinationId = :destinationId", {
        destinationId: query.destinationId,
      });
    }

    if (query.categoryId) {
      queryBuilder.andWhere("tour.categoryId = :categoryId", {
        categoryId: query.categoryId,
      });
    }

    if (query.keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("tour.title LIKE :keyword", {
            keyword: `%${query.keyword}%`,
          }).orWhere("tour.description LIKE :keyword", {
            keyword: `%${query.keyword}%`,
          });
        })
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number, activeOnly = false): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: activeOnly ? { id, status: TourStatus.ACTIVE } : { id },
      relations: ["destination", "category", "images"],
    });

    if (!tour) {
      throw new AppError(
        ErrorMessages.TOUR_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.TOUR_NOT_FOUND
      );
    }

    return tour;
  }

  async getBySlug(slug: string, activeOnly = true): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: activeOnly ? { slug, status: TourStatus.ACTIVE } : { slug },
      relations: ["destination", "category", "images"],
    });

    if (!tour) {
      throw new AppError(
        ErrorMessages.TOUR_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.TOUR_NOT_FOUND
      );
    }

    return tour;
  }

  async create(dto: CreateTourDto): Promise<Tour> {
    await this.ensureDestinationExists(dto.destinationId);
    await this.ensureCategoryExists(dto.categoryId);

    const slug = dto.slug || slugify(dto.title);
    await this.ensureSlugAvailable(slug);

    const tour = this.tourRepository.create({
      ...dto,
      slug,
      priceAdult: String(dto.priceAdult),
      priceChild: String(dto.priceChild || 0),
      images: this.createImages(dto.images),
    });

    await this.tourRepository.save(tour);

    return await this.getById(tour.id);
  }

  async update(id: number, dto: UpdateTourDto): Promise<Tour> {
    const tour = await this.getById(id);

    if (dto.destinationId) {
      await this.ensureDestinationExists(dto.destinationId);
    }

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    const slug = dto.slug || (dto.title ? slugify(dto.title) : undefined);
    if (slug && slug !== tour.slug) {
      await this.ensureSlugAvailable(slug);
      tour.slug = slug;
    }

    this.tourRepository.merge(tour, {
      ...dto,
      slug: tour.slug,
      priceAdult:
        dto.priceAdult !== undefined ? String(dto.priceAdult) : tour.priceAdult,
      priceChild:
        dto.priceChild !== undefined ? String(dto.priceChild) : tour.priceChild,
      images: dto.images ? this.createImages(dto.images) : tour.images,
    });

    await this.tourRepository.save(tour);

    return await this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const tour = await this.getById(id);
    tour.status = TourStatus.INACTIVE;
    await this.tourRepository.save(tour);
  }

  private createImages(images: CreateTourDto["images"]): TourImage[] {
    return (images || []).map((image) =>
      AppDataSource.getRepository(TourImage).create({
        url: image.url,
        isThumbnail: image.isThumbnail || false,
        sortOrder: image.sortOrder || 0,
      })
    );
  }

  private async ensureDestinationExists(destinationId: number): Promise<void> {
    const exists = await this.destinationRepository.count({
      where: { id: destinationId },
    });

    if (exists === 0) {
      throw new AppError(
        ErrorMessages.DESTINATION_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.DESTINATION_NOT_FOUND
      );
    }
  }

  private async ensureCategoryExists(categoryId: number): Promise<void> {
    const exists = await this.categoryRepository.count({
      where: { id: categoryId },
    });

    if (exists === 0) {
      throw new AppError(
        ErrorMessages.CATEGORY_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.CATEGORY_NOT_FOUND
      );
    }
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    const exists = await this.tourRepository.count({ where: { slug } });
    if (exists > 0) {
      throw new AppError(
        ErrorMessages.SLUG_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.SLUG_ALREADY_EXISTS
      );
    }
  }
}

export default new TourService();
