import { Request, Response } from "express";

import userService from "@/modules/users/user.service";

import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorMessages, SuccessMessages } from "@/constants/message";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";

import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./dto/user.dto";
import { toUserResponseDto } from "./user.mapper";

class UserController {
  async getAll(req: Request, res: Response) {
    const includeInactive = req.query.includeInactive === "true";
    const result = await userService.getAll(includeInactive);

    // Converts list User entity returned from the service to list UserResponseDto
    const listUserDto: UserResponseDto[] = result.map((user) =>
      toUserResponseDto(user)
    );

    return new AppResponse({
      message: SuccessMessages.USER.USER_GET,
      statusCode: HttpStatusCode.OK,
      data: listUserDto,
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError(
        ErrorMessages.INVALID_ID,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.INVALID_PARAMS
      );
    }
    const user = await userService.getById(id);

    // Converts a User entity returned from the service to a UserResponseDto
    const userDto: UserResponseDto = toUserResponseDto(user);

    return new AppResponse({
      message: SuccessMessages.USER.USER_GET,
      statusCode: HttpStatusCode.OK,
      data: userDto,
    }).sendResponse(res);
  }

  async create(req: Request, res: Response) {
    const createUserDto: CreateUserDto = req.body as CreateUserDto;
    const newUser = await userService.create(createUserDto);
    const userDto: UserResponseDto = toUserResponseDto(newUser);

    return new AppResponse({
      message: SuccessMessages.USER.USER_CREATED,
      statusCode: HttpStatusCode.CREATED,
      data: userDto,
    }).sendResponse(res);
  }

  async update(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError(
        ErrorMessages.INVALID_ID,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.INVALID_PARAMS
      );
    }

    const user = await userService.update(id, req.body as UpdateUserDto);

    return new AppResponse({
      message: SuccessMessages.USER.USER_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: toUserResponseDto(user),
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError(
        ErrorMessages.INVALID_ID,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.INVALID_PARAMS
      );
    }

    await userService.delete(id);

    return new AppResponse({
      message: SuccessMessages.USER.USER_DELETED,
      statusCode: HttpStatusCode.OK,
    }).sendResponse(res);
  }
}

export default new UserController();
