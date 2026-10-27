import { Link, useLocation } from "react-router-dom";
import { Sprout, Info, MessageSquare } from "lucide-react";
import type { SupportedLanguage } from "../types";
import { t } from "../i18n";

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="glass-card sticky top-0 z-50 px-4 py-3 mb-4 flex items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-smooth">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base font-bold gradient-text leading-tight">
            {t("appName", language)}
          </h1>
          <p className="text-[10px] text-slate-400 leading-tight">
            {t("tagline", language)}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <div className="relative">
          <select
            id="language-select"
            value={language}
            onChange={(e) =>
              onLanguageChange(e.target.value as SupportedLanguage)
            }
            className="appearance-none bg-white/10 border border-white/15 rounded-lg px-3 py-1.5 text-sm text-slate-200 cursor-pointer hover:bg-white/15 transition-smooth focus:outline-none focus:ring-2 focus:ring-emerald-500/40 pr-7"
          >
            <option value="en" className="bg-slate-800 text-white">
              {t("english", language)}
            </option>
            <option value="hi" className="bg-slate-800 text-white">
              {t("hindi", language)}
            </option>
            <option value="te" className="bg-slate-800 text-white">
              {t("telugu", language)}
            </option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <svg
              className="w-3 h-3 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex gap-1">
          <Link
            to="/"
            className={`p-2 rounded-lg transition-smooth ${
              location.pathname === "/"
                ? "bg-emerald-600/30 text-emerald-300"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
            title={t("home", language)}
          >
            <MessageSquare className="w-4 h-4" />
          </Link>
          <Link
            to="/about"
            className={`p-2 rounded-lg transition-smooth ${
              location.pathname === "/about"
                ? "bg-emerald-600/30 text-emerald-300"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
            title={t("about", language)}
          >
            <Info className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
