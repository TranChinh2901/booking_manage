import express from "express";

import destinationController from "@/modules/destinations/destination.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/", asyncHandle(destinationController.getAll));

export default router;
