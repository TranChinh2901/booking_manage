import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import reviewController from "@/modules/reviews/review.controller";
import {
  CreateReviewSchema,
  UpdateReviewSchema,
} from "@/modules/reviews/schemas/review.schema";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/", asyncHandle(reviewController.getAll));
router.post(
  "/",
  asyncHandle(authGuard),
  validateBody(CreateReviewSchema),
  asyncHandle(reviewController.create)
);
router.patch(
  "/:id",
  asyncHandle(authGuard),
  validateBody(UpdateReviewSchema),
  asyncHandle(reviewController.updateMine)
);
router.delete(
  "/:id",
  asyncHandle(authGuard),
  asyncHandle(reviewController.deleteMine)
);

export default router;
