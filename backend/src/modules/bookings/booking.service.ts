import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import {
  TourSchedule,
  TourScheduleStatus,
} from "@/modules/tour-schedules/entities/tour-schedule.entity";
import { User } from "@/modules/users/entities/user.entity";

import { CreateBookingDto, UpdateBookingStatusDto } from "./dto/booking.dto";
import { Booking, BookingStatus } from "./entities/booking.entity";

export class BookingService {
  private bookingRepository: Repository<Booking>;

  constructor() {
    this.bookingRepository = AppDataSource.getRepository(Booking);
  }

  async getAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: [
        "user",
        "tourSchedule",
        "tourSchedule.tour",
        "tourSchedule.tour.destination",
        "tourSchedule.tour.category",
        "tourSchedule.tour.images",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async getMine(userId: number): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { userId },
      relations: [
        "tourSchedule",
        "tourSchedule.tour",
        "tourSchedule.tour.destination",
        "tourSchedule.tour.category",
        "tourSchedule.tour.images",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: [
        "user",
        "tourSchedule",
        "tourSchedule.tour",
        "tourSchedule.tour.destination",
        "tourSchedule.tour.category",
        "tourSchedule.tour.images",
      ],
    });

    if (!booking) {
      throw new AppError(
        ErrorMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.BOOKING_NOT_FOUND
      );
    }

    return booking;
  }

  async create(user: User, dto: CreateBookingDto): Promise<Booking> {
    const bookingId = await AppDataSource.transaction(async (manager) => {
      const schedule = await manager
        .getRepository(TourSchedule)
        .createQueryBuilder("schedule")
        .setLock("pessimistic_write")
        .where("schedule.id = :id", { id: dto.tourScheduleId })
        .getOne();

      if (!schedule) {
        throw new AppError(
          ErrorMessages.TOUR_SCHEDULE_NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
          ErrorCode.TOUR_SCHEDULE_NOT_FOUND
        );
      }

      if (schedule.status !== TourScheduleStatus.OPEN) {
        throw new AppError(
          ErrorMessages.TOUR_SCHEDULE_NOT_OPEN,
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.TOUR_SCHEDULE_NOT_OPEN
        );
      }

      const childCount = dto.childCount || 0;
      const totalPeople = dto.adultCount + childCount;
      const remainingSeats = schedule.availableSeats - schedule.bookedSeats;

      if (totalPeople > remainingSeats) {
        throw new AppError(
          ErrorMessages.NOT_ENOUGH_SEATS,
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.NOT_ENOUGH_SEATS
        );
      }

      const totalAmount =
        dto.adultCount * Number(schedule.priceAdult) +
        childCount * Number(schedule.priceChild);

      schedule.bookedSeats += totalPeople;
      await manager.getRepository(TourSchedule).save(schedule);

      const booking = manager.getRepository(Booking).create({
        bookingCode: this.generateBookingCode(),
        userId: user.id,
        tourScheduleId: dto.tourScheduleId,
        adultCount: dto.adultCount,
        childCount,
        totalAmount: String(totalAmount),
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        note: dto.note,
      });

      const savedBooking = await manager.getRepository(Booking).save(booking);
      return savedBooking.id;
    });

    return await this.getById(bookingId);
  }

  async updateStatus(
    id: number,
    dto: UpdateBookingStatusDto
  ): Promise<Booking> {
    const booking = await this.getById(id);

    if (dto.status) {
      booking.status = dto.status;
    }

    if (dto.paymentStatus) {
      booking.paymentStatus = dto.paymentStatus;
    }

    await this.bookingRepository.save(booking);

    return await this.getById(id);
  }

  async cancel(id: number, userId?: number): Promise<Booking> {
    const booking = await this.getById(id);

    if (userId && booking.userId !== userId) {
      throw new AppError(
        ErrorMessages.FORBIDDEN,
        HttpStatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return booking;
    }

    await AppDataSource.transaction(async (manager) => {
      const schedule = await manager
        .getRepository(TourSchedule)
        .createQueryBuilder("schedule")
        .setLock("pessimistic_write")
        .where("schedule.id = :id", { id: booking.tourScheduleId })
        .getOne();

      if (schedule) {
        schedule.bookedSeats = Math.max(
          0,
          schedule.bookedSeats - booking.adultCount - booking.childCount
        );
        await manager.getRepository(TourSchedule).save(schedule);
      }

      booking.status = BookingStatus.CANCELLED;
      await manager.getRepository(Booking).save(booking);
    });

    return await this.getById(id);
  }

  private generateBookingCode(): string {
    return `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
}

export default new BookingService();
