import express from "express";

import adminRouter from "@/routes/admin";
import authRouter from "@/routes/auth";
import categoryRouter from "@/routes/category";
import destinationRouter from "@/routes/destination";
import tourRouter from "@/routes/tour";
import userRouter from "@/routes/user";

const router = express.Router();
const API_V1 = "/api/v1";

router.use(`${API_V1}/auth`, authRouter);
router.use(`${API_V1}/users`, userRouter);
router.use(`${API_V1}/destinations`, destinationRouter);
router.use(`${API_V1}/categories`, categoryRouter);
router.use(`${API_V1}/tours`, tourRouter);
router.use(`${API_V1}/admin`, adminRouter);

export default router;
