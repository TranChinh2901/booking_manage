import express from "express";

import tourController from "@/modules/tours/tour.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/", asyncHandle(tourController.getAll));
router.get("/:slug", asyncHandle(tourController.getBySlug));

export default router;
