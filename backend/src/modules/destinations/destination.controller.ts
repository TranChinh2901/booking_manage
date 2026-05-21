import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import destinationService from "./destination.service";
import {
  CreateDestinationDto,
  UpdateDestinationDto,
} from "./dto/destination.dto";
import { toDestinationResponseDto } from "./destination.mapper";

class DestinationController {
  async getAll(req: Request, res: Response) {
    const activeOnly = req.baseUrl.includes("/api/v1/destinations");
    const includeInactive = req.query.includeInactive === "true";
    const destinations = await destinationService.getAll(
      activeOnly,
      includeInactive
    );

    return new AppResponse({
      message: SuccessMessages.DESTINATION.DESTINATION_GET,
      statusCode: HttpStatusCode.OK,
      data: destinations.map(toDestinationResponseDto),
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const destination = await destinationService.create(
      req.body as CreateDestinationDto
    );

    return new AppResponse({
      message: SuccessMessages.DESTINATION.DESTINATION_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toDestinationResponseDto(destination),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const destination = await destinationService.update(
      Number(req.params.id),
      req.body as UpdateDestinationDto
    );

    return new AppResponse({
      message: SuccessMessages.DESTINATION.DESTINATION_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toDestinationResponseDto(destination),
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await destinationService.delete(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.DESTINATION.DESTINATION_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new DestinationController();
