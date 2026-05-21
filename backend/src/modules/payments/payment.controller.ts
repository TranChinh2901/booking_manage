import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";

import paymentService, { MoMoCallbackBody } from "./payment.service";

class PaymentController {
  async createMoMoPayment(req: Request, res: Response) {
    const { bookingId } = req.body;
    const result = await paymentService.createMoMoPayment(Number(bookingId));

    return new AppResponse({
      message: "Payment URL created",
      statusCode: HttpStatusCode.OK,
      data: result,
    }).sendResponse(res);
  }

  async momoCallback(req: Request, res: Response) {
    await paymentService.handleMoMoCallback(req.body as MoMoCallbackBody);
    res.status(204).send();
  }
}

export default new PaymentController();
