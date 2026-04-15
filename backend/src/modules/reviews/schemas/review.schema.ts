import Joi from "joi";

import { CreateReviewDto, UpdateReviewDto } from "../dto/review.dto";
import { ReviewStatus } from "../entities/review.entity";

export const CreateReviewSchema = Joi.object<CreateReviewDto>({
  tourId: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow("").optional(),
});

export const UpdateReviewSchema = Joi.object<UpdateReviewDto>({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(ReviewStatus))
    .optional(),
});
