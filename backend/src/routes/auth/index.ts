import express from "express";

import authController from "@/modules/auth/auth.controller";
import {
  ChangePasswordSchema,
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
  UpdateProfileSchema,
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
router.post(
  "/refresh-token",
  validateBody(RefreshTokenSchema),
  asyncHandle(authController.refreshToken)
);
router.post("/logout", asyncHandle(authGuard), asyncHandle(authController.logout));
router.get("/profile", asyncHandle(authGuard), asyncHandle(authController.profile));
router.patch(
  "/profile",
  asyncHandle(authGuard),
  validateBody(UpdateProfileSchema),
  asyncHandle(authController.updateProfile)
);
router.patch(
  "/change-password",
  asyncHandle(authGuard),
  validateBody(ChangePasswordSchema),
  asyncHandle(authController.changePassword)
);

export default router;
