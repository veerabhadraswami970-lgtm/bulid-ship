import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  User,
  Bot,
} from "lucide-react";
import type { ChatMessage, SupportedLanguage } from "../types";
import { t } from "../i18n";

interface ChatBubbleProps {
  message: ChatMessage;
  language: SupportedLanguage;
  onRetry?: (content: string) => void;
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category || category === "general_agriculture") return null;

  const labels: Record<string, string> = {
    crop_selection: "🌱 Crop Selection",
    soil_management: "🪨 Soil Management",
    seeds_sowing: "🌾 Seeds & Sowing",
    irrigation: "💧 Irrigation",
    nutrient_management: "🧪 Nutrients",
    pest_management: "🐛 Pest Management",
    plant_diseases: "🍂 Plant Diseases",
    weather_precautions: "⛈️ Weather",
    harvesting: "🫘 Harvesting",
    sustainable_farming: "♻️ Sustainable",
    out_of_scope: "ℹ️ Info",
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
      {labels[category] || category}
    </span>
  );
}

function SafetyBadge({ level }: { level?: string }) {
  if (!level || level === "low") return null;

  const colors =
    level === "high"
      ? "bg-red-500/15 text-red-300 border-red-500/20"
      : "bg-amber-500/15 text-amber-300 border-amber-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${colors}`}
    >
      <ShieldAlert className="w-3 h-3" />
      {level === "high" ? "High Risk" : "Moderate"}
    </span>
  );
}

export default function ChatBubble({
  message,
  language,
  onRetry,
}: ChatBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="chat-bubble flex justify-end mb-3">
        <div className="max-w-[85%] sm:max-w-[75%] flex items-end gap-2">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl rounded-br-sm px-4 py-2.5 shadow-lg shadow-emerald-900/20">
            <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-emerald-300" />
          </div>
        </div>
      </div>
    );
  }

  // Error bubble
  if (message.error) {
    return (
      <div className="chat-bubble flex justify-start mb-3">
        <div className="max-w-[85%] sm:max-w-[75%] flex items-end gap-2">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600/30 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl rounded-bl-sm px-4 py-2.5">
            <p className="text-sm text-red-200 leading-relaxed">
              {message.content}
            </p>
            {onRetry && (
              <button
                onClick={() => onRetry(message.content)}
                className="mt-2 flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-smooth"
              >
                <RefreshCw className="w-3 h-3" />
                {t("retry", language)}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Assistant bubble
  return (
    <div className="chat-bubble flex justify-start mb-4">
      <div className="max-w-[85%] sm:max-w-[80%] flex items-start gap-2">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mt-0.5 shadow-md">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="glass-card-light px-4 py-3 rounded-2xl rounded-tl-sm space-y-3 shadow-lg">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <CategoryBadge category={message.category} />
            <SafetyBadge level={message.safetyLevel} />
          </div>

          {/* Main answer */}
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>

          {/* Possible Causes */}
          {message.possibleCauses && message.possibleCauses.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/15 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                {t("possibleCauses", language)}
              </p>
              <ul className="space-y-1">
                {message.possibleCauses.map((cause, i) => (
                  <li
                    key={i}
                    className="text-xs text-amber-200/80 flex items-start gap-1.5"
                  >
                    <span className="mt-0.5">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {message.recommendations && message.recommendations.length > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                {t("recommendations", language)}
              </p>
              <ul className="space-y-1">
                {message.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="text-xs text-emerald-200/80 flex items-start gap-1.5"
                  >
                    <span className="mt-0.5">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Precautions */}
          {message.precautions && message.precautions.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/15 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-red-300 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t("precautions", language)}
              </p>
              <ul className="space-y-1">
                {message.precautions.map((pre, i) => (
                  <li
                    key={i}
                    className="text-xs text-red-200/80 flex items-start gap-1.5"
                  >
                    <span className="mt-0.5">⚠</span>
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Questions */}
          {message.followUpQuestions && message.followUpQuestions.length > 0 && (
            <div className="bg-slate-500/10 border border-slate-500/15 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                {t("followUp", language)}
              </p>
              <ul className="space-y-1">
                {message.followUpQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-300/80 flex items-start gap-1.5"
                  >
                    <span className="mt-0.5">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expert recommendation */}
          {message.needsExpert && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/15 rounded-lg px-3 py-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-200">
                {t("expertAdvice", language)}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          {message.disclaimer && (
            <p className="text-[10px] text-slate-500 italic leading-relaxed pt-1 border-t border-white/5">
              {message.disclaimer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
