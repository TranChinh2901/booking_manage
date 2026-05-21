import express from "express";

import { authGuard } from "@/middlewares/auth.middleware";
import paymentController from "@/modules/payments/payment.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

// User creates MoMo payment (requires auth)
router.post("/momo", asyncHandle(authGuard), asyncHandle(paymentController.createMoMoPayment));

// MoMo IPN callback (no auth - called by MoMo server)
router.post("/momo/callback", asyncHandle(paymentController.momoCallback));

export default router;
