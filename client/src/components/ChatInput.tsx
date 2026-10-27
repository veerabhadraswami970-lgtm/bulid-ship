import { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import type { SupportedLanguage } from "../types";
import { t } from "../i18n";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  language: SupportedLanguage;
  maxLength: number;
}

export default function ChatInput({
  onSend,
  disabled,
  language,
  maxLength,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const trimmed = input.trim();
  const canSend = trimmed.length > 0 && trimmed.length <= maxLength && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (value: string) => {
    setInput(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  const overLimit = trimmed.length > maxLength;

  return (
    <div className="glass-card p-3 mt-auto">
      <div className="flex items-end gap-2 input-glow rounded-xl p-1">
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder", language)}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none px-3 py-2.5 max-h-40 leading-relaxed disabled:opacity-50"
          style={{ minHeight: "40px" }}
        />
        <button
          id="send-button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg btn-glow disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
          title={t("send", language)}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between mt-1.5 px-2">
        <p className="text-[10px] text-slate-600">
          Shift+Enter for new line
        </p>
        {input.length > 0 && (
          <p
            className={`text-[10px] ${
              overLimit ? "text-red-400" : "text-slate-600"
            }`}
          >
            {trimmed.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
