import { Request, Response } from "express";

import { AppResponse } from "@/common/success.response";
import { SuccessMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AuthenticatedRequest } from "@/middlewares/auth.middleware";
import { toUserResponseDto } from "@/modules/users/user.mapper";

import authService from "./auth.service";
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  UpdateProfileDto,
} from "./dto/auth.dto";

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

  async refreshToken(req: Request, res: Response) {
    const result = await authService.refreshToken(req.body as RefreshTokenDto);

    return new AppResponse({
      message: SuccessMessages.AUTH.REFRESH_TOKEN_SUCCESS,
      statusCode: HttpStatusCode.OK,
      data: result,
    }).sendResponse(res);
  }

  async logout(req: Request, res: Response) {
    return new AppResponse({
      message: SuccessMessages.AUTH.LOGOUT_SUCCESS,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }

  async profile(req: AuthenticatedRequest, res: Response) {
    return new AppResponse({
      message: SuccessMessages.USER.USER_GET,
      statusCode: HttpStatusCode.OK,
      data: toUserResponseDto(req.user!),
    }).sendResponse(res);
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const user = await authService.updateProfile(
      req.user!.id,
      req.body as UpdateProfileDto
    );

    return new AppResponse({
      message: SuccessMessages.AUTH.PROFILE_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toUserResponseDto(user),
    }).sendResponse(res);
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    await authService.changePassword(
      req.user!.id,
      req.body as ChangePasswordDto
    );

    return new AppResponse({
      message: SuccessMessages.AUTH.PASSWORD_CHANGED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new AuthController();
