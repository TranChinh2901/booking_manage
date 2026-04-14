import express from "express";

import authController from "@/modules/auth/auth.controller";
import {
  LoginSchema,
  RegisterSchema,
} from "@/modules/auth/schemas/auth.schema";
import { authGuard } from "@/middlewares/auth.middleware";
import { validateBody } from "@/middlewares/validate.middleware";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.post(
  "/register",
  validateBody(RegisterSchema),
  asyncHandle(authController.register)
);
router.post("/login", validateBody(LoginSchema), asyncHandle(authController.login));
router.get("/profile", asyncHandle(authGuard), asyncHandle(authController.profile));

export default router;
