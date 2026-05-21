import Joi from "joi";

export const createPaymentSchema = Joi.object({
  bookingId: Joi.number().required(),
  method: Joi.string().valid("CASH", "BANK_TRANSFER", "MOMO", "VNPAY").required(),
  amount: Joi.number().positive().required(),
  transactionRef: Joi.string().optional(),
  note: Joi.string().optional().allow(""),
});

export const confirmPaymentSchema = Joi.object({
  transactionRef: Joi.string().optional(),
  note: Joi.string().optional().allow(""),
});
