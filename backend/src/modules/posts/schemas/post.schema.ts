import Joi from "joi";

import { CreatePostDto, UpdatePostDto } from "../dto/post.dto";
import { PostStatus } from "../entities/post.entity";

export const CreatePostSchema = Joi.object<CreatePostDto>({
  title: Joi.string().required(),
  slug: Joi.string().optional(),
  excerpt: Joi.string().allow("").optional(),
  content: Joi.string().required(),
  thumbnail: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(PostStatus))
    .optional(),
});

export const UpdatePostSchema = Joi.object<UpdatePostDto>({
  title: Joi.string().optional(),
  slug: Joi.string().optional(),
  excerpt: Joi.string().allow("").optional(),
  content: Joi.string().optional(),
  thumbnail: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(PostStatus))
    .optional(),
});
