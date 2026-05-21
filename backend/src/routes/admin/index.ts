import express from "express";

import adminDashboardRouter from "@/routes/admin-dashboard";
import { authGuard, roleGuard } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import bookingController from "@/modules/bookings/booking.controller";
import { UpdateBookingStatusSchema } from "@/modules/bookings/schemas/booking.schema";
import categoryController from "@/modules/categories/category.controller";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/modules/categories/schemas/category.schema";
import contactRequestController from "@/modules/contact-requests/contact-request.controller";
import { UpdateContactRequestSchema } from "@/modules/contact-requests/schemas/contact-request.schema";
import destinationController from "@/modules/destinations/destination.controller";
import {
  CreateDestinationSchema,
  UpdateDestinationSchema,
} from "@/modules/destinations/schemas/destination.schema";
import reviewController from "@/modules/reviews/review.controller";
import { UpdateReviewSchema } from "@/modules/reviews/schemas/review.schema";
import postController from "@/modules/posts/post.controller";
import {
  CreatePostSchema,
  UpdatePostSchema,
} from "@/modules/posts/schemas/post.schema";
import tourController from "@/modules/tours/tour.controller";
import tourScheduleController from "@/modules/tour-schedules/tour-schedule.controller";
import {
  CreateTourScheduleSchema,
  UpdateTourScheduleSchema,
} from "@/modules/tour-schedules/schemas/tour-schedule.schema";
import {
  CreateTourSchema,
  UpdateTourSchema,
} from "@/modules/tours/schemas/tour.schema";
import userController from "@/modules/users/user.controller";
import { UserRole } from "@/modules/users/entities/user.entity";
import { UpdateUserSchema } from "@/modules/users/schemas/update-user-schema";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();
const adminRoles = [UserRole.ADMIN];

router.use(asyncHandle(authGuard), roleGuard(adminRoles));

router.use("/dashboard", adminDashboardRouter);

router.get("/users", asyncHandle(userController.getAll));
router.get("/users/:id", asyncHandle(userController.getById));
router.patch(
  "/users/:id",
  validateBody(UpdateUserSchema),
  asyncHandle(userController.update)
);
router.delete("/users/:id", asyncHandle(userController.delete));

router.get("/destinations", asyncHandle(destinationController.getAll));
router.post(
  "/destinations",
  validateBody(CreateDestinationSchema),
  asyncHandle(destinationController.create)
);
router.patch(
  "/destinations/:id",
  validateBody(UpdateDestinationSchema),
  asyncHandle(destinationController.update)
);
router.delete("/destinations/:id", asyncHandle(destinationController.delete));

router.get("/categories", asyncHandle(categoryController.getAll));
router.post(
  "/categories",
  validateBody(CreateCategorySchema),
  asyncHandle(categoryController.create)
);
router.patch(
  "/categories/:id",
  validateBody(UpdateCategorySchema),
  asyncHandle(categoryController.update)
);
router.delete("/categories/:id", asyncHandle(categoryController.delete));

router.get("/tours", asyncHandle(tourController.getAll));
router.get("/tours/:id", asyncHandle(tourController.getById));
router.post("/tours", validateBody(CreateTourSchema), asyncHandle(tourController.create));
router.patch(
  "/tours/:id",
  validateBody(UpdateTourSchema),
  asyncHandle(tourController.update)
);
router.delete("/tours/:id", asyncHandle(tourController.delete));

router.get("/tour-schedules", asyncHandle(tourScheduleController.getAll));
router.post(
  "/tour-schedules",
  validateBody(CreateTourScheduleSchema),
  asyncHandle(tourScheduleController.create)
);
router.patch(
  "/tour-schedules/:id",
  validateBody(UpdateTourScheduleSchema),
  asyncHandle(tourScheduleController.update)
);
router.delete("/tour-schedules/:id", asyncHandle(tourScheduleController.delete));

router.get("/bookings", asyncHandle(bookingController.getAll));
router.get("/bookings/:id", asyncHandle(bookingController.getById));
router.patch(
  "/bookings/:id/status",
  validateBody(UpdateBookingStatusSchema),
  asyncHandle(bookingController.updateStatus)
);
router.patch("/bookings/:id/confirm", asyncHandle(bookingController.confirm));
router.patch("/bookings/:id/complete", asyncHandle(bookingController.complete));
router.patch("/bookings/:id/cancel", asyncHandle(bookingController.cancel));

router.get("/reviews", asyncHandle(reviewController.getAll));
router.patch(
  "/reviews/:id",
  validateBody(UpdateReviewSchema),
  asyncHandle(reviewController.update)
);
router.delete("/reviews/:id", asyncHandle(reviewController.delete));

router.get("/posts", asyncHandle(postController.getAll));
router.get("/posts/:id", asyncHandle(postController.getById));
router.post(
  "/posts",
  validateBody(CreatePostSchema),
  asyncHandle(postController.create)
);
router.patch(
  "/posts/:id",
  validateBody(UpdatePostSchema),
  asyncHandle(postController.update)
);
router.delete("/posts/:id", asyncHandle(postController.delete));

router.get("/contact-requests", asyncHandle(contactRequestController.getAll));
router.get(
  "/contact-requests/:id",
  asyncHandle(contactRequestController.getById)
);
router.patch(
  "/contact-requests/:id",
  validateBody(UpdateContactRequestSchema),
  asyncHandle(contactRequestController.update)
);

export default router;
