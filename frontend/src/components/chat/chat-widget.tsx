"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1").replace(/\/$/, "");
const HISTORY_LIMIT = 8; // Chỉ gửi tối đa 8 tin nhắn gần nhất lên server

interface TourCard {
  id: number;
  title: string;
  slug: string;
  image?: string | null;
  priceAdult: string;
  durationDays: number;
  durationNights: number;
  destination?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  tours?: TourCard[];
}

function formatPrice(price: string | number) {
  return Number(price).toLocaleString("vi-VN") + " ₫";
}

/** Simple markdown renderer cho chatbot - hỗ trợ bold, italic, bullet list */
function ChatMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        // Bullet list
        if (/^[-•*]\s/.test(trimmed)) {
          const content = trimmed.replace(/^[-•*]\s/, "");
          return (
            <div key={i} className="flex gap-1.5 ml-1">
              <span className="text-[#0ea5e9] shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(content) }} />
            </div>
          );
        }
        // Empty line
        if (!trimmed) return <div key={i} className="h-1" />;
        // Normal paragraph
        return <p key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />;
      })}
    </div>
  );
}

/** Format inline markdown: **bold**, *italic*, `code` */
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-[#e0f2fe] px-1 rounded text-[#0c4a6e] text-xs">$1</code>');
}

function TourCardItem({ tour }: { tour: TourCard }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="flex gap-2 p-2 rounded-lg border border-[#d7edf4] hover:border-[#0ea5e9] hover:shadow-md transition-all bg-white"
    >
      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-[#f0f9ff]">
        {tour.image ? (
          <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#496779] text-xs">No img</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#073449] truncate">{tour.title}</p>
        <p className="text-[11px] text-[#496779]">{tour.durationDays}N{tour.durationNights}Đ {tour.destination ? `• ${tour.destination}` : ""}</p>
        <p className="text-xs font-bold text-[#0ea5e9] mt-0.5">{formatPrice(tour.priceAdult)}</p>
      </div>
    </Link>
  );
}

const GREETING: Message = {
  role: "assistant",
  content: "Xin chào! 👋 Tôi là trợ lý du lịch AI của Travel Booking.\n\nTôi có thể giúp bạn:\n- Tìm kiếm tour du lịch theo điểm đến, giá cả\n- Xem chi tiết và lịch khởi hành tour\n- Tư vấn tour phù hợp với nhu cầu của bạn\n\nBạn muốn tìm tour ở đâu?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      // Chỉ gửi HISTORY_LIMIT tin nhắn gần nhất (không tính greeting)
      const recentMessages = messages.filter((m) => m !== GREETING).slice(-HISTORY_LIMIT);
      const history = recentMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(`${API_URL}/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.reply || "Có lỗi xảy ra.",
        tours: data.tours,
      }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Không thể kết nối đến server. Vui lòng thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0ea5e9] hover:bg-[#0c4a6e] text-white rounded-full shadow-[0_12px_28px_rgba(14,165,233,0.35)] flex items-center justify-center transition-all hover:scale-110"
        aria-label="Mở chatbot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-[#f8fdff] rounded-2xl shadow-[0_22px_60px_rgba(12,74,110,0.18)] flex flex-col overflow-hidden border border-[#d7edf4]">
      {/* Header */}
      <div className="bg-[#0ea5e9] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">Trợ lý Du lịch AI</span>
            <span className="text-[10px] text-white/70">Luôn sẵn sàng hỗ trợ</span>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition-colors" aria-label="Đóng">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${msg.role === "user" ? "" : "w-full"}`}>
              <div
                className={`px-3 py-2 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-[#0ea5e9] text-white rounded-br-md shadow-[0_4px_12px_rgba(14,165,233,0.25)]"
                    : "bg-white text-[#073449] rounded-bl-md border border-[#dff3fa] shadow-sm"
                }`}
              >
                {msg.role === "assistant" ? <ChatMarkdown text={msg.content} /> : msg.content}
              </div>
              {msg.tours && msg.tours.length > 0 && (
                <div className="mt-2 space-y-2">
                  {msg.tours.map((tour) => (
                    <TourCardItem key={tour.id} tour={tour} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#dff3fa] px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce opacity-60" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce opacity-60" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce opacity-60" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#d7edf4] bg-white p-3 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-[#d7edf4] rounded-full px-4 py-2 text-sm text-[#073449] placeholder-[#496779] focus:outline-none focus:border-[#0ea5e9] bg-[#f8fdff]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#0ea5e9] hover:bg-[#0c4a6e] disabled:opacity-50 text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(14,165,233,0.3)] transition-colors"
            aria-label="Gửi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
