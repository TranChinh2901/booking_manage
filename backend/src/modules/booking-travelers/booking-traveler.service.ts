import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { Booking } from "@/modules/bookings/entities/booking.entity";

import { CreateTravelersDto } from "./dto/booking-traveler.dto";
import { BookingTraveler, Gender, TravelerType } from "./entities/booking-traveler.entity";

export class BookingTravelerService {
  private travelerRepository: Repository<BookingTraveler>;
  private bookingRepository: Repository<Booking>;

  constructor() {
    this.travelerRepository = AppDataSource.getRepository(BookingTraveler);
    this.bookingRepository = AppDataSource.getRepository(Booking);
  }

  async getByBookingId(bookingId: number): Promise<BookingTraveler[]> {
    return await this.travelerRepository.find({
      where: { bookingId },
      order: { id: "ASC" },
    });
  }

  async createMany(dto: CreateTravelersDto): Promise<BookingTraveler[]> {
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new AppError(
        ErrorMessages.BOOKING_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.BOOKING_NOT_FOUND
      );
    }

    const travelers = dto.travelers.map((t) =>
      this.travelerRepository.create({
        bookingId: dto.bookingId,
        fullName: t.fullName,
        dateOfBirth: t.dateOfBirth || undefined,
        gender: (t.gender as Gender) || undefined,
        travelerType: t.travelerType as TravelerType,
        identityNumber: t.identityNumber || undefined,
        nationality: t.nationality || undefined,
      })
    );

    return await this.travelerRepository.save(travelers);
  }

  async delete(id: number): Promise<void> {
    await this.travelerRepository.delete(id);
  }
}

export default new BookingTravelerService();
