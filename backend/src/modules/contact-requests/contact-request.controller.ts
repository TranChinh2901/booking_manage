import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import { toContactRequestResponseDto } from "./contact-request.mapper";
import contactRequestService from "./contact-request.service";
import {
  CreateContactRequestDto,
  UpdateContactRequestDto,
} from "./dto/contact-request.dto";

class ContactRequestController {
  async getAll(req: Request, res: Response) {
    const contactRequests = await contactRequestService.getAll();

    return new AppResponse({
      message: SuccessMessages.CONTACT_REQUEST.CONTACT_REQUEST_GET,
      statusCode: HttpStatusCode.OK,
      data: contactRequests.map(toContactRequestResponseDto),
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const contactRequest = await contactRequestService.getById(
      Number(req.params.id)
    );

    return new AppResponse({
      message: SuccessMessages.CONTACT_REQUEST.CONTACT_REQUEST_GET,
      statusCode: HttpStatusCode.OK,
      data: toContactRequestResponseDto(contactRequest),
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const contactRequest = await contactRequestService.create(
      req.body as CreateContactRequestDto
    );

    return new AppResponse({
      message: SuccessMessages.CONTACT_REQUEST.CONTACT_REQUEST_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: toContactRequestResponseDto(contactRequest),
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const contactRequest = await contactRequestService.update(
      Number(req.params.id),
      req.body as UpdateContactRequestDto
    );

    return new AppResponse({
      message: SuccessMessages.CONTACT_REQUEST.CONTACT_REQUEST_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toContactRequestResponseDto(contactRequest),
    }).sendResponse(res);
  }
}

export default new ContactRequestController();
