import Joi from "joi";

import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  UpdateProfileDto,
} from "@/modules/auth/dto/auth.dto";

export const RegisterSchema = Joi.object<RegisterDto>({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name must be not empty",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  phone: Joi.string().allow("").optional().messages({
    "string.base": "Phone must be a string",
  }),
});

export const LoginSchema = Joi.object<LoginDto>({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const RefreshTokenSchema = Joi.object<RefreshTokenDto>({
  refreshToken: Joi.string().required(),
});

export const UpdateProfileSchema = Joi.object<UpdateProfileDto>({
  name: Joi.string().optional(),
  phone: Joi.string().allow("").optional(),
  avatar: Joi.string().allow("").optional(),
});

export const ChangePasswordSchema = Joi.object<ChangePasswordDto>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});
