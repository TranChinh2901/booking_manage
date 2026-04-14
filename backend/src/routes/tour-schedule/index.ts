import express from "express";

import tourScheduleController from "@/modules/tour-schedules/tour-schedule.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/", asyncHandle(tourScheduleController.getAll));

export default router;
