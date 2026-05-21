import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";

import bookingTravelerService from "./booking-traveler.service";
import { CreateTravelersDto } from "./dto/booking-traveler.dto";

class BookingTravelerController {
  async getByBookingId(req: Request, res: Response) {
    const travelers = await bookingTravelerService.getByBookingId(
      Number(req.params.bookingId)
    );

    return new AppResponse({
      message: "Travelers retrieved",
      statusCode: HttpStatusCode.OK,
      data: travelers,
    }).sendResponse(res);
  }

  async createMany(req: Request, res: Response) {
    const travelers = await bookingTravelerService.createMany(
      req.body as CreateTravelersDto
    );

    return new AppResponse({
      message: "Travelers created",
      statusCode: HttpStatusCode.CREATED,
      data: travelers,
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    await bookingTravelerService.delete(Number(req.params.id));

    return new AppResponse({
      message: "Traveler deleted",
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new BookingTravelerController();
