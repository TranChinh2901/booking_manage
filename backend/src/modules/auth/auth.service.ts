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
  ChangePasswordDto,
  JwtPayloadDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  UpdateProfileDto,
} from "./dto/auth.dto";

const jwt = require("jsonwebtoken") as {
  sign: (
    payload: object,
    secret: string,
    options?: { expiresIn?: string }
  ) => string;
  verify: (token: string, secret: string) => string | JwtPayloadDto;
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

  async refreshToken(dto: RefreshTokenDto): Promise<AuthTokensDto> {
    try {
      const decoded = jwt.verify(dto.refreshToken, loadedEnv.jwt.refreshSecret);

      if (typeof decoded === "string") {
        throw new Error("Invalid token payload");
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new AppError(
          ErrorMessages.UNAUTHORIZED,
          HttpStatusCode.UNAUTHORIZED,
          ErrorCode.UNAUTHORIZED
        );
      }

      return this.generateTokens(user);
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
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    this.userRepository.merge(user, dto);

    return await this.userRepository.save(user);
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id: userId })
      .getOne();

    if (!user) {
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(
        ErrorMessages.INVALID_CREDENTIALS,
        HttpStatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);
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
