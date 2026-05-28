import { Request, Response } from "express";

import { generateChatReply } from "./chatbot.service";

class ChatbotController {
  async sendMessage(req: Request, res: Response) {
    const { message, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const result = await generateChatReply(message.trim(), history || []);
      return res.json(result);
    } catch (err: any) {
      const status = err?.status || err?.error?.code || 500;
      if (status === 429) {
        return res.json({ reply: "Hệ thống AI đang quá tải, vui lòng thử lại sau ít giây." });
      }
      return res.json({ reply: "Xin lỗi, trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau." });
    }
  }
}

export default new ChatbotController();
