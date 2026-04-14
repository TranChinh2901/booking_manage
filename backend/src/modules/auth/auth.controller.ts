import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { toUserResponseDto } from "@/modules/users/user.mapper";

import authService from "./auth.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body as RegisterDto);

    return new AppResponse({
      message: SuccessMessages.AUTH.REGISTER_SUCCESS,
      statusCode: HttpStatusCode.CREATED,
      data: result,
    }).sendResponse(res);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body as LoginDto);

    return new AppResponse({
      message: SuccessMessages.AUTH.LOGIN_SUCCESS,
      statusCode: HttpStatusCode.OK,
      data: result,
    }).sendResponse(res);
  }

  async profile(req: AuthenticatedRequest, res: Response) {
    return new AppResponse({
      message: SuccessMessages.USER.USER_GET,
      statusCode: HttpStatusCode.OK,
      data: toUserResponseDto(req.user!),
    }).sendResponse(res);
  }
}

export default new AuthController();
