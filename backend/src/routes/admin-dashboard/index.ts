import express from "express";

import dashboardController from "@/modules/dashboard/dashboard.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/summary", asyncHandle(dashboardController.getSummary));
router.get("/revenue", asyncHandle(dashboardController.getRevenueByMonth));
router.get("/top-tours", asyncHandle(dashboardController.getTopTours));

export default router;
