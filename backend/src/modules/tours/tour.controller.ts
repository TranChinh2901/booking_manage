import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import { CreateTourDto, TourQueryDto, UpdateTourDto } from "./dto/tour.dto";
import { toTourResponseDto } from "./tour.mapper";
import tourService from "./tour.service";

class TourController {
  async getAll(req: Request, res: Response) {
    const activeOnly = req.baseUrl.includes("/api/v1/tours");
    const result = await tourService.getAll(
      {
        keyword: req.query.keyword as string | undefined,
        destinationId: req.query.destinationId
          ? Number(req.query.destinationId)
          : undefined,
        categoryId: req.query.categoryId
          ? Number(req.query.categoryId)
          : undefined,
        status: req.query.status as TourQueryDto["status"],
        includeInactive: req.query.includeInactive === "true",
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      },
      activeOnly
    );

    return new AppResponse({
      message: SuccessMessages.TOUR.TOUR_GET,
      statusCode: HttpStatusCode.OK,
      data: {
        items: result.items.map(toTourResponseDto),
        meta: result.meta,
      },
    }).sendResponse(res);
  }

  async getBySlug(req: Request, res: Response) {
    const activeOnly = req.baseUrl.includes("/api/v1/tours");
    const tour = await tourService.getBySlug(req.params.slug, activeOnly);

    return new AppResponse({
      message: SuccessMessages.TOUR.TOUR_GET,
      statusCode: HttpStatusCode.OK,
      data: toTourResponseDto(tour),
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const tour = await tourService.getById(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.TOUR.TOUR_GET,
      statusCode: HttpStatusCode.OK,
      data: toTourResponseDto(tour),
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const tour = await tourService.create(req.body as CreateTourDto);

    return new AppResponse({
      message: SuccessMessages.TOUR.TOUR_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toTourResponseDto(tour),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const tour = await tourService.update(
      Number(req.params.id),
      req.body as UpdateTourDto
    );

    return new AppResponse({
      message: SuccessMessages.TOUR.TOUR_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toTourResponseDto(tour),
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await tourService.delete(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.TOUR.TOUR_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new TourController();
