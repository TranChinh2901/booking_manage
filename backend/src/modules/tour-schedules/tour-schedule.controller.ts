import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import {
  CreateTourScheduleDto,
  UpdateTourScheduleDto,
} from "./dto/tour-schedule.dto";
import tourScheduleService from "./tour-schedule.service";
import { toTourScheduleResponseDto } from "./tour-schedule.mapper";

class TourScheduleController {
  async getAll(req: Request, res: Response) {
    const activeOnly = req.baseUrl.includes("/api/v1/tour-schedules");
    const schedules = await tourScheduleService.getAll(
      req.query.tourId ? Number(req.query.tourId) : undefined,
      activeOnly,
      req.query.includeInactive === "true"
    );

    return new AppResponse({
      message: SuccessMessages.TOUR_SCHEDULE.TOUR_SCHEDULE_GET,
      statusCode: HttpStatusCode.OK,
      data: schedules.map(toTourScheduleResponseDto),
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const schedule = await tourScheduleService.create(
      req.body as CreateTourScheduleDto
    );

    return new AppResponse({
      message: SuccessMessages.TOUR_SCHEDULE.TOUR_SCHEDULE_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toTourScheduleResponseDto(schedule),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const schedule = await tourScheduleService.update(
      Number(req.params.id),
      req.body as UpdateTourScheduleDto
    );

    return new AppResponse({
      message: SuccessMessages.TOUR_SCHEDULE.TOUR_SCHEDULE_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toTourScheduleResponseDto(schedule),
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await tourScheduleService.delete(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.TOUR_SCHEDULE.TOUR_SCHEDULE_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new TourScheduleController();
