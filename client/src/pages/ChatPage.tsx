import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Trash2, Sprout } from "lucide-react";
import type { ChatMessage, FarmingContext, SupportedLanguage } from "../types";
import { t, exampleQuestions } from "../i18n";
import { sendChatMessage, buildHistoryFromMessages, clearSession } from "../api";
import ChatBubble from "../components/ChatBubble";
import ChatInput from "../components/ChatInput";
import TypingIndicator from "../components/TypingIndicator";
import FarmingContextPanel from "../components/FarmingContextPanel";

interface ChatPageProps {
  language: SupportedLanguage;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function ChatPage({ language }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<FarmingContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async (content: string) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const history = buildHistoryFromMessages(messages);

    const response = await sendChatMessage(content, language, context, history);

    if (response.success) {
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response.data.answer,
        timestamp: Date.now(),
        category: response.data.category,
        possibleCauses: response.data.possibleCauses,
        recommendations: response.data.recommendations,
        precautions: response.data.precautions,
        followUpQuestions: response.data.followUpQuestions,
        safetyLevel: response.data.safetyLevel,
        needsExpert: response.data.needsExpert,
        disclaimer: response.data.disclaimer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: response.error.message || t("errorGeneric", language),
        timestamp: Date.now(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleRetry = () => {
    // Find the last user message
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMsg) {
      // Remove the error message
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.error) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      // Retry with the same message
      setTimeout(() => handleSend(lastUserMsg.content), 100);
    }
  };

  const handleNewChat = async () => {
    setMessages([]);
    setContext({});
    await clearSession();
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExampleClick = (question: string) => {
    if (!isLoading) {
      handleSend(question);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-3 pb-4">
      {/* Top controls */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <button
            id="new-chat-btn"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/20 text-xs font-medium text-emerald-300 hover:bg-emerald-600/30 transition-smooth btn-glow"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("newChat", language)}
          </button>
          {messages.length > 0 && (
            <button
              id="clear-chat-btn"
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-500/15 text-xs font-medium text-red-300 hover:bg-red-600/20 transition-smooth"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("clearChat", language)}
            </button>
          )}
        </div>
      </div>

      {/* Farming Context */}
      <FarmingContextPanel
        context={context}
        onChange={setContext}
        language={language}
      />

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 glass-card overflow-y-auto px-4 py-4 mb-3 relative"
        style={{ minHeight: "300px", maxHeight: "calc(100vh - 380px)" }}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 flex items-center justify-center mb-5 shadow-xl">
              <Sprout className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold gradient-text mb-2">
              {t("emptyChat", language)}
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md">
              {t("emptyChatSub", language)}
            </p>

            {/* Example Questions */}
            <div className="w-full max-w-lg">
              <p className="text-xs text-slate-500 mb-3 font-medium">
                {t("exampleQuestions", language)}
              </p>
              <div className="space-y-2">
                {exampleQuestions[language].map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleExampleClick(question)}
                    className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 hover:border-emerald-500/20 hover:text-emerald-200 transition-smooth"
                  >
                    💬 {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                language={language}
                onRetry={msg.error ? handleRetry : undefined}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-slate-600 text-center mb-2 px-4">
        {t("disclaimer", language)}
      </p>

      {/* Chat Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        language={language}
        maxLength={2000}
      />
    </div>
  );
}
