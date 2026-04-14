import Joi from "joi";

import {
  CreateTourScheduleDto,
  UpdateTourScheduleDto,
} from "../dto/tour-schedule.dto";
import { TourScheduleStatus } from "../entities/tour-schedule.entity";

export const CreateTourScheduleSchema = Joi.object<CreateTourScheduleDto>({
  tourId: Joi.number().integer().positive().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
  availableSeats: Joi.number().integer().min(1).required(),
  priceAdult: Joi.number().min(0).required(),
  priceChild: Joi.number().min(0).optional(),
  status: Joi.string()
    .valid(...Object.values(TourScheduleStatus))
    .optional(),
});

export const UpdateTourScheduleSchema = Joi.object<UpdateTourScheduleDto>({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  availableSeats: Joi.number().integer().min(1).optional(),
  bookedSeats: Joi.number().integer().min(0).optional(),
  priceAdult: Joi.number().min(0).optional(),
  priceChild: Joi.number().min(0).optional(),
  status: Joi.string()
    .valid(...Object.values(TourScheduleStatus))
    .optional(),
});
