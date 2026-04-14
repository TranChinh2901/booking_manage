import bcrypt from "bcryptjs";
import { Repository } from "typeorm";

import { AppDataSource } from "@/config/config-database";
import { loadedEnv } from "@/config/load-env";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { User, UserStatus } from "@/modules/users/entities/user.entity";
import { toUserResponseDto } from "@/modules/users/user.mapper";

import {
  AuthResponseDto,
  AuthTokensDto,
  JwtPayloadDto,
  LoginDto,
  RegisterDto,
} from "./dto/auth.dto";

const jwt = require("jsonwebtoken") as {
  sign: (
    payload: object,
    secret: string,
    options?: { expiresIn?: string }
  ) => string;
};

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existedUser = await this.userRepository.count({
      where: { email: registerDto.email },
    });

    if (existedUser > 0) {
      throw new AppError(
        ErrorMessages.EMAIL_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      phone: registerDto.phone,
    });

    await this.userRepository.save(user);

    return {
      user: toUserResponseDto(user),
      ...this.generateTokens(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: loginDto.email })
      .getOne();

    if (!user) {
      throw new AppError(
        ErrorMessages.INVALID_CREDENTIALS,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(
        ErrorMessages.USER_INACTIVE,
        HttpStatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(
        ErrorMessages.INVALID_CREDENTIALS,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    return {
      user: toUserResponseDto(user),
      ...this.generateTokens(user),
    };
  }

  private generateTokens(user: User): AuthTokensDto {
    const payload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: jwt.sign(payload, loadedEnv.jwt.accessSecret, {
        expiresIn: loadedEnv.jwt.accessExpiresIn,
      }),
      refreshToken: jwt.sign(payload, loadedEnv.jwt.refreshSecret, {
        expiresIn: loadedEnv.jwt.refreshExpiresIn,
      }),
    };
  }
}

export default new AuthService();
