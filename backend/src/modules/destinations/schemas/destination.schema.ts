import Joi from "joi";

import {
  CreateDestinationDto,
  UpdateDestinationDto,
} from "../dto/destination.dto";
import { DestinationStatus } from "../entities/destination.entity";

export const CreateDestinationSchema = Joi.object<CreateDestinationDto>({
  name: Joi.string().required(),
  slug: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(DestinationStatus))
    .optional(),
});

export const UpdateDestinationSchema = Joi.object<UpdateDestinationDto>({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional(),
  status: Joi.string()
    .valid(...Object.values(DestinationStatus))
    .optional(),
});
