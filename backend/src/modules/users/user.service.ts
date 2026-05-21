import { Not, Repository } from "typeorm";
import bcrypt from "bcryptjs";

import { AppDataSource } from "@/config/config-database";
import { User, UserStatus } from "@/modules/users/entities/user.entity";

import { AppError } from "@/common/error.response";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getAll(query: { page?: number; limit?: number } = {}, includeInactive = false) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 20;

    const [items, total] = await this.userRepository.findAndCount({
      where: includeInactive ? {} : { status: Not(UserStatus.INACTIVE) },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { id },
    });
    if (!userExists) {
      throw new AppError(
        ErrorMessages.USER_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }
    return userExists;
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    const user = await this.getById(id);
    this.userRepository.merge(user, userDto);
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.getById(id);
    user.status = UserStatus.INACTIVE;
    await this.userRepository.save(user);
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const findUserExists: number = await this.userRepository.count({
      where: { email: userDto.email },
    });
    if (findUserExists > 0) {
      throw new AppError(
        ErrorMessages.EMAIL_EXISTS,
        HttpStatusCode.CONFLICT,
        ErrorCode.EMAIL_ALREADY_EXISTS
      );
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser: User = this.userRepository.create({
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
      phone: userDto.phone,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}

export default new UserService();
