import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import { toBookingResponseDto } from "./booking.mapper";
import bookingService from "./booking.service";
import { CreateBookingDto, UpdateBookingStatusDto } from "./dto/booking.dto";

class BookingController {
  async getAll(req: Request, res: Response) {
    const bookings = await bookingService.getAll();

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_GET,
      statusCode: HttpStatusCode.OK,
      data: bookings.map(toBookingResponseDto),
    }).sendResponse(res);
  }

  async getMine(req: AuthenticatedRequest, res: Response) {
    const bookings = await bookingService.getMine(req.user!.id);

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_GET,
      statusCode: HttpStatusCode.OK,
      data: bookings.map(toBookingResponseDto),
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const booking = await bookingService.getById(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_GET,
      statusCode: HttpStatusCode.OK,
      data: toBookingResponseDto(booking),
    }).sendResponse(res);
  }

  async create(req: AuthenticatedRequest, res: Response) {
    const booking = await bookingService.create(
      req.user!,
      req.body as CreateBookingDto
    );

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toBookingResponseDto(booking),
    }).sendResponse(res);
  }

  async updateStatus(req: Request, res: Response) {
    const booking = await bookingService.updateStatus(
      Number(req.params.id),
      req.body as UpdateBookingStatusDto
    );

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toBookingResponseDto(booking),
    }).sendResponse(res);
  }

  async cancelMine(req: AuthenticatedRequest, res: Response) {
    const booking = await bookingService.cancel(
      Number(req.params.id),
      req.user!.id
    );

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_CANCELLED,
      statusCode: HttpStatusCode.OK,
      data: toBookingResponseDto(booking),
    }).sendResponse(res);
  }

  async cancel(req: Request, res: Response) {
    const booking = await bookingService.cancel(Number(req.params.id));

    return new AppResponse({
      message: SuccessMessages.BOOKING.BOOKING_CANCELLED,
      statusCode: HttpStatusCode.OK,
      data: toBookingResponseDto(booking),
    }).sendResponse(res);
  }
}

export default new BookingController();
