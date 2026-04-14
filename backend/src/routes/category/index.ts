import express from "express";

import categoryController from "@/modules/categories/category.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/", asyncHandle(categoryController.getAll));

export default router;
