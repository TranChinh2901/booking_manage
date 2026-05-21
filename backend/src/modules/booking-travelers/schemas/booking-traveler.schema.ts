import Joi from "joi";

export const createTravelerSchema = Joi.object({
  bookingId: Joi.number().required(),
  fullName: Joi.string().required(),
  dateOfBirth: Joi.string().optional().allow("", null),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional().allow(null),
  travelerType: Joi.string().valid("ADULT", "CHILD").required(),
  identityNumber: Joi.string().optional().allow("", null),
  nationality: Joi.string().optional().allow("", null),
});

export const createTravelersSchema = Joi.object({
  bookingId: Joi.number().required(),
  travelers: Joi.array().items(
    Joi.object({
      fullName: Joi.string().required(),
      dateOfBirth: Joi.string().optional().allow("", null),
      gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional().allow(null),
      travelerType: Joi.string().valid("ADULT", "CHILD").required(),
      identityNumber: Joi.string().optional().allow("", null),
      nationality: Joi.string().optional().allow("", null),
    })
  ).min(1).required(),
});
