import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { Booking, BookingStatus } from "@/modules/bookings/entities/booking.entity";
import { Tour } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

import { CreateReviewDto, UpdateReviewDto } from "./dto/review.dto";
import { Review, ReviewStatus } from "./entities/review.entity";

export class ReviewService {
  private reviewRepository: Repository<Review>;
  private tourRepository: Repository<Tour>;
  private bookingRepository: Repository<Booking>;

  constructor() {
    this.reviewRepository = AppDataSource.getRepository(Review);
    this.tourRepository = AppDataSource.getRepository(Tour);
    this.bookingRepository = AppDataSource.getRepository(Booking);
  }

  async getAll(tourId?: number, visibleOnly = false): Promise<Review[]> {
    const page = 1;
    const limit = 50;

    return await this.reviewRepository.find({
      where: {
        ...(tourId ? { tourId } : {}),
        ...(visibleOnly ? { status: ReviewStatus.VISIBLE } : {}),
      },
      relations: ["user", "tour", "tour.destination", "tour.category", "tour.images"],
      order: { createdAt: "DESC" },
      skip: 0,
      take: limit,
    });
  }

  async getById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ["user", "tour", "tour.destination", "tour.category", "tour.images"],
    });

    if (!review) {
      throw new AppError(
        ErrorMessages.REVIEW_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.REVIEW_NOT_FOUND
      );
    }

    return review;
  }

  async create(user: User, dto: CreateReviewDto): Promise<Review> {
    await this.ensureTourExists(dto.tourId);

    const exists = await this.reviewRepository.findOne({
      where: { userId: user.id, tourId: dto.tourId },
    });

    if (exists) {
      throw new AppError(
        ErrorMessages.REVIEW_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.REVIEW_ALREADY_EXISTS
      );
    }

    await this.ensureCompletedBooking(user.id, dto.tourId);

    const review = await this.reviewRepository.save(
      this.reviewRepository.create({
        userId: user.id,
        tourId: dto.tourId,
        rating: dto.rating,
        comment: dto.comment,
      })
    );

    return await this.getById(review.id);
  }

  async update(
    id: number,
    dto: UpdateReviewDto,
    userId?: number
  ): Promise<Review> {
    const review = await this.getById(id);

    if (userId && review.userId !== userId) {
      throw new AppError(
        ErrorMessages.FORBIDDEN,
        HttpStatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    this.reviewRepository.merge(review, dto);
    await this.reviewRepository.save(review);

    return await this.getById(id);
  }

  async delete(id: number, userId?: number): Promise<void> {
    const review = await this.getById(id);

    if (userId && review.userId !== userId) {
      throw new AppError(
        ErrorMessages.FORBIDDEN,
        HttpStatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    await this.reviewRepository.remove(review);
  }

  private async ensureTourExists(tourId: number): Promise<void> {
    const exists = await this.tourRepository.count({ where: { id: tourId } });

    if (exists === 0) {
      throw new AppError(
        ErrorMessages.TOUR_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.TOUR_NOT_FOUND
      );
    }
  }

  private async ensureCompletedBooking(
    userId: number,
    tourId: number
  ): Promise<void> {
    const completedBooking = await this.bookingRepository
      .createQueryBuilder("booking")
      .innerJoin("booking.tourSchedule", "schedule")
      .where("booking.userId = :userId", { userId })
      .andWhere("schedule.tourId = :tourId", { tourId })
      .andWhere("booking.status = :status", {
        status: BookingStatus.COMPLETED,
      })
      .getOne();

    if (!completedBooking) {
      throw new AppError(
        ErrorMessages.REVIEW_NOT_ALLOWED,
        HttpStatusCode.FORBIDDEN,
        ErrorCode.REVIEW_NOT_ALLOWED
      );
    }
  }
}

export default new ReviewService();
