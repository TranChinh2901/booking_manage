import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { Tour, TourStatus } from "@/modules/tours/entities/tour.entity";

import {
  CreateTourScheduleDto,
  UpdateTourScheduleDto,
} from "./dto/tour-schedule.dto";
import {
  TourSchedule,
  TourScheduleStatus,
} from "./entities/tour-schedule.entity";

export class TourScheduleService {
  private scheduleRepository: Repository<TourSchedule>;
  private tourRepository: Repository<Tour>;

  constructor() {
    this.scheduleRepository = AppDataSource.getRepository(TourSchedule);
    this.tourRepository = AppDataSource.getRepository(Tour);
  }

  async getAll(
    tourId?: number,
    activeOnly = false,
    includeInactive = false
  ): Promise<TourSchedule[]> {
    const queryBuilder = this.scheduleRepository
      .createQueryBuilder("schedule")
      .leftJoinAndSelect("schedule.tour", "tour")
      .leftJoinAndSelect("tour.destination", "destination")
      .leftJoinAndSelect("tour.category", "category")
      .leftJoinAndSelect("tour.images", "images")
      .orderBy("schedule.startDate", "ASC");

    if (tourId) {
      queryBuilder.andWhere("schedule.tourId = :tourId", { tourId });
    }

    if (activeOnly) {
      queryBuilder
        .andWhere("schedule.status = :status", {
          status: TourScheduleStatus.OPEN,
        })
        .andWhere("tour.status = :tourStatus", { tourStatus: TourStatus.ACTIVE });
    } else if (!includeInactive) {
      queryBuilder.andWhere("schedule.status != :cancelledStatus", {
        cancelledStatus: TourScheduleStatus.CANCELLED,
      });
    }

    return await queryBuilder.getMany();
  }

  async getById(id: number): Promise<TourSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ["tour", "tour.destination", "tour.category", "tour.images"],
    });

    if (!schedule) {
      throw new AppError(
        ErrorMessages.TOUR_SCHEDULE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.TOUR_SCHEDULE_NOT_FOUND
      );
    }

    return schedule;
  }

  async create(dto: CreateTourScheduleDto): Promise<TourSchedule> {
    const tour = await this.tourRepository.findOne({ where: { id: dto.tourId } });

    if (!tour) {
      throw new AppError(
        ErrorMessages.TOUR_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.TOUR_NOT_FOUND
      );
    }

    const schedule = this.scheduleRepository.create({
      ...dto,
      priceAdult: String(dto.priceAdult),
      priceChild: String(dto.priceChild || 0),
    });

    await this.scheduleRepository.save(schedule);

    return await this.getById(schedule.id);
  }

  async update(id: number, dto: UpdateTourScheduleDto): Promise<TourSchedule> {
    const schedule = await this.getById(id);

    if (
      dto.availableSeats !== undefined &&
      dto.availableSeats < schedule.bookedSeats
    ) {
      throw new AppError(
        ErrorMessages.NOT_ENOUGH_SEATS,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.NOT_ENOUGH_SEATS
      );
    }

    this.scheduleRepository.merge(schedule, {
      ...dto,
      priceAdult:
        dto.priceAdult !== undefined
          ? String(dto.priceAdult)
          : schedule.priceAdult,
      priceChild:
        dto.priceChild !== undefined
          ? String(dto.priceChild)
          : schedule.priceChild,
    });

    await this.scheduleRepository.save(schedule);

    return await this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const schedule = await this.getById(id);
    schedule.status = TourScheduleStatus.CANCELLED;
    await this.scheduleRepository.save(schedule);
  }
}

export default new TourScheduleService();
