import express from "express";

import chatbotController from "@/modules/chatbot/chatbot.controller";
import { asyncHandle } from "@/utils/handle-error";

const router = express.Router();

router.post("/message", asyncHandle(chatbotController.sendMessage));

export default router;
