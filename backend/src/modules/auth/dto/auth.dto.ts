import { UserResponseDto } from "@/modules/users/dto/user.dto";
import { UserRole } from "@/modules/users/entities/user.entity";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto extends AuthTokensDto {
  user: UserResponseDto;
}

export interface JwtPayloadDto {
  sub: number;
  email: string;
  role: UserRole;
}
