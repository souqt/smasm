import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/DataContext";
import { api } from "@/lib/api";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

const normalize = (value: string) => value.toLowerCase().trim();

const ChatbotWidget = () => {
  const { data } = useData();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "أهلاً بك في تلجاوي. اسألني عن المنتجات، الدفع، التحميل أو الدعم الفني." },
  ]);

  const activeAnswers = useMemo(
    () => (data.chatbotAnswers || []).filter((item) => item.isActive),
    [data.chatbotAnswers]
  );

  const findLocalAnswer = (text: string) => {
    const clean = normalize(text);
    const matched = activeAnswers.find((item) =>
      item.keywords.some((keyword) => clean.includes(normalize(keyword))) ||
      clean.includes(normalize(item.question))
    );

    if (!matched || matched.answers.length === 0) return "";
    const index = Math.floor(Math.random() * matched.answers.length);
    return matched.answers[index];
  };

  const handleSend = async () => {
    const clean = message.trim();
    if (!clean || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: clean }]);
    setMessage("");
    setLoading(true);

    try {
      let answer = "";
      if (data.settings?.aiChatWebhookUrl) {
        const response = await api.chat(clean);
        answer = response?.answer || "";
      }
      answer = answer || findLocalAnswer(clean) || "سجلت سؤالك. لو محتاج متابعة دقيقة افتح تذكرة دعم وسنرد عليك من لوحة الدعم.";
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch {
      const fallback = findLocalAnswer(clean) || "حدث تعذر مؤقت في الشات. افتح تذكرة دعم وسنراجع طلبك.";
      setMessages((prev) => [...prev, { role: "bot", text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50" dir="rtl">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="mb-3 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-lg border border-border bg-card shadow-elevated"
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3 text-secondary-foreground">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Bot size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">مساعد تلجاوي</p>
                  <p className="text-xs text-secondary-foreground/65">دعم سريع قبل فتح التذكرة</p>
                </div>
              </div>
              <button className="rounded-md p-2 hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close chatbot">
                <X size={18} />
              </button>
            </div>

            <div className="h-80 space-y-3 overflow-y-auto bg-muted/30 p-4">
              {messages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    item.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground shadow-sm"
                  }`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {loading && <p className="text-xs text-muted-foreground">جاري تجهيز الرد...</p>}
            </div>

            <div className="flex gap-2 border-t border-border p-3">
              <Input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSend();
                }}
                placeholder="اكتب سؤالك..."
                className="text-right"
              />
              <Button size="icon" onClick={handleSend} disabled={loading}>
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button size="lg" className="h-14 w-14 rounded-full shadow-elevated" onClick={() => setOpen((value) => !value)} aria-label="Open chatbot">
        <MessageCircle size={22} />
      </Button>
    </div>
  );
};

export default ChatbotWidget;
