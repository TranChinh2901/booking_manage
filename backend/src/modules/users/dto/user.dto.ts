
import { UserRole, UserStatus } from "../entities/user.entity";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}
