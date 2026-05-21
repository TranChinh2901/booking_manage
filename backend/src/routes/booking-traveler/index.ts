import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import bookingTravelerController from "@/modules/booking-travelers/booking-traveler.controller";
import { createTravelersSchema } from "@/modules/booking-travelers/schemas/booking-traveler.schema";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get(
  "/booking/:bookingId",
  asyncHandle(authGuard),
  asyncHandle(bookingTravelerController.getByBookingId)
);
router.post(
  "/",
  asyncHandle(authGuard),
  validateBody(createTravelersSchema),
  asyncHandle(bookingTravelerController.createMany)
);
router.delete(
  "/:id",
  asyncHandle(authGuard),
  asyncHandle(bookingTravelerController.delete)
);

export default router;
