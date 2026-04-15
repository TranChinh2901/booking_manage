import Joi from "joi";

import {
  CreateContactRequestDto,
  UpdateContactRequestDto,
} from "../dto/contact-request.dto";
import { ContactRequestStatus } from "../entities/contact-request.entity";

export const CreateContactRequestSchema =
  Joi.object<CreateContactRequestDto>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow("").optional(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
  });

export const UpdateContactRequestSchema =
  Joi.object<UpdateContactRequestDto>({
    status: Joi.string()
      .valid(...Object.values(ContactRequestStatus))
      .required(),
  });
