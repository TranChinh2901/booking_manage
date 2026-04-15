import { Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

import { toFavoriteResponseDto } from "./favorite.mapper";
import favoriteService from "./favorite.service";

class FavoriteController {
  async getMine(req: AuthenticatedRequest, res: Response) {
    const favorites = await favoriteService.getMine(req.user!.id);

    return new AppResponse({
      message: SuccessMessages.FAVORITE.FAVORITE_GET,
      statusCode: HttpStatusCode.OK,
      data: favorites.map(toFavoriteResponseDto),
    }).sendResponse(res);
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const favorite = await favoriteService.create(
      req.user!,
      Number(req.params.tourId)
    );

    return new AppResponse({
      message: SuccessMessages.FAVORITE.FAVORITE_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toFavoriteResponseDto(favorite),
    }).sendResponse(res);
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    await favoriteService.delete(req.user!.id, Number(req.params.tourId));

    return new AppResponse({
      message: SuccessMessages.FAVORITE.FAVORITE_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new FavoriteController();
