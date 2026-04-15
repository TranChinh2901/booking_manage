import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import favoriteController from "@/modules/favorites/favorite.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.use(asyncHandle(authGuard));

router.get("/", asyncHandle(favoriteController.getMine));
router.post("/:tourId", asyncHandle(favoriteController.create));
router.delete("/:tourId", asyncHandle(favoriteController.delete));

export default router;
