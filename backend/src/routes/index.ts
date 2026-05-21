import express from "express";

import adminRouter from "@/routes/admin";
import authRouter from "@/routes/auth";
import bookingRouter from "@/routes/booking";
import bookingTravelerRouter from "@/routes/booking-traveler";
import categoryRouter from "@/routes/category";
import contactRequestRouter from "@/routes/contact-request";
import destinationRouter from "@/routes/destination";
import favoriteRouter from "@/routes/favorite";
import paymentRouter from "@/routes/payment";
import postRouter from "@/routes/post";
import reviewRouter from "@/routes/review";
import tourScheduleRouter from "@/routes/tour-schedule";
import tourRouter from "@/routes/tour";
import uploadRouter from "@/routes/upload";
import userRouter from "@/routes/user";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/destinations`, destinationRouter);
router.use(`${API_V1}/categories`, categoryRouter);
router.use(`${API_V1}/tours`, tourRouter);
router.use(`${API_V1}/tour-schedules`, tourScheduleRouter);
router.use(`${API_V1}/bookings`, bookingRouter);
router.use(`${API_V1}/booking-travelers`, bookingTravelerRouter);
router.use(`${API_V1}/payments`, paymentRouter);
router.use(`${API_V1}/reviews`, reviewRouter);
router.use(`${API_V1}/favorites`, favoriteRouter);
router.use(`${API_V1}/posts`, postRouter);
router.use(`${API_V1}/contact-requests`, contactRequestRouter);
router.use(`${API_V1}/uploads`, uploadRouter);
router.use(`${API_V1}/admin`, adminRouter);

export default router;
