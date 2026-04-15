import express from "express";

import postController from "@/modules/posts/post.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.get("/", asyncHandle(postController.getAll));
router.get("/:slug", asyncHandle(postController.getBySlug));

export default router;
