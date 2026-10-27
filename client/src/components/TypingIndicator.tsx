import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="chat-bubble flex justify-start mb-3">
      <div className="flex items-end gap-2">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="glass-card-light rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="typing-dot w-2 h-2 rounded-full bg-emerald-400" />
            <span className="typing-dot w-2 h-2 rounded-full bg-emerald-400" />
            <span className="typing-dot w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
