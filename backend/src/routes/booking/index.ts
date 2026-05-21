import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import bookingController from "@/modules/bookings/booking.controller";
import { CreateBookingSchema } from "@/modules/bookings/schemas/booking.schema";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.use(asyncHandle(authGuard));

router.get("/my", asyncHandle(bookingController.getMine));
router.post(
  "/",
  validateBody(CreateBookingSchema),
  asyncHandle(bookingController.create)
);
router.patch("/:id/cancel", asyncHandle(bookingController.cancelMine));
router.delete("/:id", asyncHandle(bookingController.deleteMine));

export default router;
