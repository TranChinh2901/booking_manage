import { UserResponseDto } from "@/modules/users/dto/user.dto";

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
  role: string;
}
