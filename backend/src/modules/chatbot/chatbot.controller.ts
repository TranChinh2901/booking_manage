import { Request, Response } from "express";

import { generateChatReply } from "./chatbot.service";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class ChatbotController {
  async sendMessage(req: Request, res: Response) {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await generateChatReply(trimmed, Array.isArray(history) ? history : []);
        return res.json(result);
      } catch (err: any) {
        const status = err?.status || err?.error?.code || 500;
        if (status === 429 && attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        if (status === 429) {
          return res.json({ reply: "⏳ Hệ thống AI đang quá tải, vui lòng thử lại sau 30 giây." });
        }
        console.error("[Chatbot Error]", err?.message || err);
        return res.json({ reply: "Xin lỗi, trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau." });
      }
    }
  }
}

export default new ChatbotController();
