import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";

import { CreateReviewDto, UpdateReviewDto } from "./dto/review.dto";
import { toReviewResponseDto } from "./review.mapper";
import reviewService from "./review.service";

class ReviewController {
  async getAll(req: Request, res: Response) {
    const visibleOnly = req.baseUrl.includes("/api/v1/reviews");
    const reviews = await reviewService.getAll(
      req.query.tourId ? Number(req.query.tourId) : undefined,
      visibleOnly
    );

    return new AppResponse({
      message: SuccessMessages.REVIEW.REVIEW_GET,
      statusCode: HttpStatusCode.OK,
      data: reviews.map(toReviewResponseDto),
    }).sendResponse(res);
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const review = await reviewService.create(
      req.user!,
      req.body as CreateReviewDto
    );

    return new AppResponse({
      message: SuccessMessages.REVIEW.REVIEW_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toReviewResponseDto(review),
    }).sendResponse(res);
  }

  async updateMine(req: AuthenticatedRequest, res: Response) {
    const review = await reviewService.update(
      Number(req.params.id),
      req.body as UpdateReviewDto,
      req.user!.id
    );

    return new AppResponse({
      message: SuccessMessages.REVIEW.REVIEW_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toReviewResponseDto(review),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const review = await reviewService.update(
      Number(req.params.id),
      req.body as UpdateReviewDto
    );

    return new AppResponse({
      message: SuccessMessages.REVIEW.REVIEW_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toReviewResponseDto(review),
    }).sendResponse(res);
  }

  async deleteMine(req: AuthenticatedRequest, res: Response) {
    await reviewService.delete(Number(req.params.id), req.user!.id);

    return new AppResponse({
      message: SuccessMessages.REVIEW.REVIEW_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await reviewService.delete(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.REVIEW.REVIEW_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new ReviewController();
