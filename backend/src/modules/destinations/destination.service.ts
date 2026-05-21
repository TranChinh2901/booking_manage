import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { slugify } from "@/helpers/slugify";

import {
  CreateDestinationDto,
  UpdateDestinationDto,
} from "./dto/destination.dto";
import {
  Destination,
  DestinationStatus,
} from "./entities/destination.entity";

export class DestinationService {
  private destinationRepository: Repository<Destination>;

  constructor() {
    this.destinationRepository = AppDataSource.getRepository(Destination);
  }

  async getAll(activeOnly = false, includeInactive = false): Promise<Destination[]> {
    return await this.destinationRepository.find({
      where:
        activeOnly || !includeInactive
          ? { status: DestinationStatus.ACTIVE }
          : {},
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number): Promise<Destination> {
    const destination = await this.destinationRepository.findOne({ where: { id } });
    if (!destination) {
      throw new AppError(
        ErrorMessages.DESTINATION_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.DESTINATION_NOT_FOUND
      );
    }

    return destination;
  }

  async create(dto: CreateDestinationDto): Promise<Destination> {
    const slug = dto.slug || slugify(dto.name);
    await this.ensureSlugAvailable(slug);

    const destination = this.destinationRepository.create({
      ...dto,
      slug,
    });

    return await this.destinationRepository.save(destination);
  }

  async update(id: number, dto: UpdateDestinationDto): Promise<Destination> {
    const destination = await this.getById(id);
    const slug = dto.slug || (dto.name ? slugify(dto.name) : undefined);

    if (slug && slug !== destination.slug) {
      await this.ensureSlugAvailable(slug);
      destination.slug = slug;
    }

    this.destinationRepository.merge(destination, {
      ...dto,
      slug: destination.slug,
    });

    return await this.destinationRepository.save(destination);
  }

  async delete(id: number): Promise<void> {
    const destination = await this.getById(id);
    destination.status = DestinationStatus.INACTIVE;
    await this.destinationRepository.save(destination);
  }

  private async ensureSlugAvailable(slug: string): Promise<void> {
    const exists = await this.destinationRepository.count({ where: { slug } });
    if (exists > 0) {
      throw new AppError(
        ErrorMessages.SLUG_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.SLUG_ALREADY_EXISTS
      );
    }
  }
}

export default new DestinationService();
