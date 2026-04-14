import Joi from "joi";

import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { CategoryStatus } from "../entities/category.entity";

export const CreateCategorySchema = Joi.object<CreateCategoryDto>({
  name: Joi.string().required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(CategoryStatus))
    .optional(),
});

export const UpdateCategorySchema = Joi.object<UpdateCategoryDto>({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(CategoryStatus))
    .optional(),
});
