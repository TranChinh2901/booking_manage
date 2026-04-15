import { Request, Response } from "express";

import { AppError } from "@/common/error.response";
import { AppResponse } from "@/common/success.response";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import uploadService from "./upload.service";

class UploadController {
  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError(
        ErrorMessages.FILE_REQUIRED,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.FILE_REQUIRED
      );
    }

    const result = await uploadService.uploadImage(
      req.file,
      req.body.folder || req.query.folder?.toString()
    );

    return new AppResponse({
      message: "Image uploaded successfully",
      statusCode: HttpStatusCode.CREATED,
      data: result,
    }).sendResponse(res);
  }

  async uploadImages(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      throw new AppError(
        ErrorMessages.FILE_REQUIRED,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.FILE_REQUIRED
      );
    }

    const result = await uploadService.uploadImages(
      files,
      req.body.folder || req.query.folder?.toString()
    );

    return new AppResponse({
      message: "Images uploaded successfully",
      statusCode: HttpStatusCode.CREATED,
      data: result,
    }).sendResponse(res);
  }
}

export default new UploadController();
