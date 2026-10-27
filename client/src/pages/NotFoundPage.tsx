import { Link } from "react-router-dom";
import { Home, Sprout } from "lucide-react";
import type { SupportedLanguage } from "../types";
import { t } from "../i18n";

interface NotFoundPageProps {
  language: SupportedLanguage;
}

export default function NotFoundPage({ language }: NotFoundPageProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="glass-card p-8 text-center max-w-md animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-slate-500/15 flex items-center justify-center mx-auto mb-5">
          <Sprout className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-300 mb-2">404</h1>
        <h2 className="text-lg font-semibold text-slate-400 mb-2">
          {t("notFound", language)}
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {t("notFoundDesc", language)}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-sm font-medium text-white shadow-lg btn-glow"
        >
          <Home className="w-4 h-4" />
          {t("goHome", language)}
        </Link>
      </div>
    </div>
  );
}
