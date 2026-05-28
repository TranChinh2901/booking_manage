import { GoogleGenAI } from "@google/genai";
import { loadedEnv } from "@/config/load-env";

const TIMEOUT_MS = 60000;

const normalizeChatbotBaseUrl = (value: string | undefined): string | undefined => {
  const v = value?.trim();
  return v ? v.replace(/\/$/, "") : undefined;
};

export const geminiClient = new GoogleGenAI({
  apiKey: loadedEnv.gemini.apiKey,
  httpOptions: {
    timeout: TIMEOUT_MS,
    ...(normalizeChatbotBaseUrl(loadedEnv.gemini.baseUrl)
      ? { baseUrl: normalizeChatbotBaseUrl(loadedEnv.gemini.baseUrl) }
      : {}),
  },
});

export const geminiModel = loadedEnv.gemini.model;
