
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email?: string;
  createdAt?: Date;
}
