import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import { uploadImage } from "@/middlewares/upload.middleware";
import uploadController from "@/modules/uploads/upload.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.use(asyncHandle(authGuard));

router.post(
  "/image",
  uploadImage.single("image"),
  asyncHandle(uploadController.uploadImage)
);
router.post(
  "/images",
  uploadImage.array("images", 10),
  asyncHandle(uploadController.uploadImages)
);

export default router;
