import Joi from "joi";

import {
  CreateBookingDto,
  UpdateBookingStatusDto,
} from "../dto/booking.dto";
import { BookingStatus, PaymentStatus } from "../entities/booking.entity";

export const CreateBookingSchema = Joi.object<CreateBookingDto>({
  tourScheduleId: Joi.number().integer().positive().required(),
  adultCount: Joi.number().integer().min(1).required(),
  childCount: Joi.number().integer().min(0).optional(),
  contactName: Joi.string().required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().required(),
  note: Joi.string().allow("").optional(),
});

export const UpdateBookingStatusSchema = Joi.object<UpdateBookingStatusDto>({
  status: Joi.string()
    .valid(...Object.values(BookingStatus))
    .optional(),
  paymentStatus: Joi.string()
    .valid(...Object.values(PaymentStatus))
    .optional(),
});
