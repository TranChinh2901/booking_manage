import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { Tour } from "@/modules/tours/entities/tour.entity";
import { User } from "@/modules/users/entities/user.entity";

import { Favorite } from "./entities/favorite.entity";

export class FavoriteService {
  private favoriteRepository: Repository<Favorite>;
  private tourRepository: Repository<Tour>;

  constructor() {
    this.favoriteRepository = AppDataSource.getRepository(Favorite);
    this.tourRepository = AppDataSource.getRepository(Tour);
  }

  async getMine(userId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { userId },
      relations: ["tour", "tour.destination", "tour.category", "tour.images"],
      order: { createdAt: "DESC" },
    });
  }

  async create(user: User, tourId: number): Promise<Favorite> {
    await this.ensureTourExists(tourId);

    const exists = await this.favoriteRepository.findOne({
      where: { userId: user.id, tourId },
    });

    if (exists) {
      throw new AppError(
        ErrorMessages.FAVORITE_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.FAVORITE_ALREADY_EXISTS
      );
    }

    const favorite = await this.favoriteRepository.save(
      this.favoriteRepository.create({
        userId: user.id,
        tourId,
      })
    );

    return await this.favoriteRepository.findOneOrFail({
      where: { id: favorite.id },
      relations: ["tour", "tour.destination", "tour.category", "tour.images"],
    });
  }

  async delete(userId: number, tourId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, tourId },
    });

    if (!favorite) {
      throw new AppError(
        ErrorMessages.FAVORITE_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.FAVORITE_NOT_FOUND
      );
    }

    await this.favoriteRepository.remove(favorite);
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
}

export default new FavoriteService();
