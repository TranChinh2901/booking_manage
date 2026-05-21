import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";

import { ConfirmPaymentDto, CreatePaymentDto } from "./dto/payment.dto";
import paymentService from "./payment.service";

class PaymentController {
  async getAll(req: Request, res: Response) {
    const bookingId = req.query.bookingId ? Number(req.query.bookingId) : undefined;
    const payments = await paymentService.getAll(bookingId);

    return new AppResponse({
      message: "Payments retrieved",
      statusCode: HttpStatusCode.OK,
      data: payments,
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const payment = await paymentService.getById(Number(req.params.id));

    return new AppResponse({
      message: "Payment retrieved",
      statusCode: HttpStatusCode.OK,
      data: payment,
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const payment = await paymentService.create(req.body as CreatePaymentDto);

    return new AppResponse({
      message: "Payment created",
      statusCode: HttpStatusCode.CREATED,
      data: payment,
    }).sendResponse(res);
  }

  async confirm(req: Request, res: Response) {
    const payment = await paymentService.confirm(
      Number(req.params.id),
      req.body as ConfirmPaymentDto
    );

    return new AppResponse({
      message: "Payment confirmed",
      statusCode: HttpStatusCode.OK,
      data: payment,
    }).sendResponse(res);
  }

  async refund(req: Request, res: Response) {
    const payment = await paymentService.refund(Number(req.params.id));

    return new AppResponse({
      message: "Payment refunded",
      statusCode: HttpStatusCode.OK,
      data: payment,
    }).sendResponse(res);
  }
}

export default new PaymentController();
