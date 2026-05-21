import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import { roleGuard } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { UserRole } from "@/modules/users/entities/user.entity";
import paymentController from "@/modules/payments/payment.controller";
import { createPaymentSchema, confirmPaymentSchema } from "@/modules/payments/schemas/payment.schema";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get(
  "/",
  asyncHandle(authGuard),
  roleGuard([UserRole.ADMIN]),
  asyncHandle(paymentController.getAll)
);
router.get(
  "/:id",
  asyncHandle(authGuard),
  asyncHandle(paymentController.getById)
);
router.post(
  "/",
  asyncHandle(authGuard),
  roleGuard([UserRole.ADMIN]),
  validateBody(createPaymentSchema),
  asyncHandle(paymentController.create)
);
router.patch(
  "/:id/confirm",
  asyncHandle(authGuard),
  roleGuard([UserRole.ADMIN]),
  validateBody(confirmPaymentSchema),
  asyncHandle(paymentController.confirm)
);
router.patch(
  "/:id/refund",
  asyncHandle(authGuard),
  roleGuard([UserRole.ADMIN]),
  asyncHandle(paymentController.refund)
);

export default router;
