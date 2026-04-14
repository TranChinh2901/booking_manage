import { User } from "./entities/user.entity";
import { UserResponseDto } from "./dto/user.dto";

export const toUserResponseDto = (user: User): UserResponseDto => {
  const { id, name, email, phone, avatar, role, status, createdAt, updatedAt } =
    user;

  return {
    id,
    name,
    email,
    phone,
    avatar,
    role,
    status,
    createdAt,
    updatedAt,
  };
};
