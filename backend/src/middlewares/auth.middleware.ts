import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { loadedEnv } from "@/config/load-env";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import {
  User,
  UserRole,
  UserStatus,
} from "@/modules/users/entities/user.entity";

import { JwtPayloadDto } from "@/modules/auth/dto/auth.dto";

const jwt = require("jsonwebtoken") as {
  verify: (token: string, secret: string) => string | JwtPayloadDto;
};

export interface AuthenticatedRequest extends Request {
  user?: User;
}

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const authGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    throw new AppError(
      ErrorMessages.UNAUTHORIZED,
      HttpStatusCode.UNAUTHORIZED,
      ErrorCode.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(token, loadedEnv.jwt.accessSecret);

    if (typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }

    const user = await userRepository.findOne({
      where: { id: decoded.sub },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new AppError(
        ErrorMessages.UNAUTHORIZED,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      ErrorMessages.UNAUTHORIZED,
      HttpStatusCode.UNAUTHORIZED,
      ErrorCode.INVALID_TOKEN
    );
  }
};

export const roleGuard = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        ErrorMessages.FORBIDDEN,
        HttpStatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    next();
  };
};
