import express from "express";

import { validateBody } from "@/middlewares/validate.middleware";
import contactRequestController from "@/modules/contact-requests/contact-request.controller";
import { CreateContactRequestSchema } from "@/modules/contact-requests/schemas/contact-request.schema";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.post(
  "/",
  validateBody(CreateContactRequestSchema),
  asyncHandle(contactRequestController.create)
);

export default router;
