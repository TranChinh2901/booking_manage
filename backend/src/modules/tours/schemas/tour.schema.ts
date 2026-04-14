import Joi from "joi";

import { CreateTourDto, UpdateTourDto } from "../dto/tour.dto";
import { TourStatus } from "../entities/tour.entity";

const tourImageSchema = Joi.object({
  url: Joi.string().required(),
  isThumbnail: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
});

export const CreateTourSchema = Joi.object<CreateTourDto>({
  title: Joi.string().required(),
  slug: Joi.string().optional(),
  shortDescription: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  destinationId: Joi.number().integer().positive().required(),
  categoryId: Joi.number().integer().positive().required(),
  priceAdult: Joi.number().min(0).required(),
  priceChild: Joi.number().min(0).optional(),
  durationDays: Joi.number().integer().min(1).optional(),
  durationNights: Joi.number().integer().min(0).optional(),
  departureLocation: Joi.string().allow("").optional(),
  transport: Joi.string().allow("").optional(),
  maxPeople: Joi.number().integer().min(0).optional(),
  status: Joi.string()
    .valid(...Object.values(TourStatus))
    .optional(),
  images: Joi.array().items(tourImageSchema).optional(),
});

export const UpdateTourSchema = Joi.object<UpdateTourDto>({
  title: Joi.string().optional(),
  slug: Joi.string().optional(),
  shortDescription: Joi.string().allow("").optional(),
  description: Joi.string().allow("").optional(),
  destinationId: Joi.number().integer().positive().optional(),
  categoryId: Joi.number().integer().positive().optional(),
  priceAdult: Joi.number().min(0).optional(),
  priceChild: Joi.number().min(0).optional(),
  durationDays: Joi.number().integer().min(1).optional(),
  durationNights: Joi.number().integer().min(0).optional(),
  departureLocation: Joi.string().allow("").optional(),
  transport: Joi.string().allow("").optional(),
  maxPeople: Joi.number().integer().min(0).optional(),
  status: Joi.string()
    .valid(...Object.values(TourStatus))
    .optional(),
  images: Joi.array().items(tourImageSchema).optional(),
});
