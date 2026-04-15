import Joi from "joi";

import { UpdateUserDto } from "@/modules/users/dto/user.dto";
import {
  UserRole,
  UserStatus,
} from "@/modules/users/entities/user.entity";

export const UpdateUserSchema = Joi.object<UpdateUserDto>({
  name: Joi.string().optional(),
  phone: Joi.string().allow("").optional(),
  avatar: Joi.string().allow("").optional(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
});
