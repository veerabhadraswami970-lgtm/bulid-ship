import {
  Sprout,
  Globe,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Heart,
} from "lucide-react";
import type { SupportedLanguage } from "../types";
import { t } from "../i18n";

interface AboutPageProps {
  language: SupportedLanguage;
}

export default function AboutPage({ language }: AboutPageProps) {
  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-8">
      <div className="glass-card p-6 sm:p-8 animate-fade-in-up">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-900/30">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">
            {t("aboutTitle", language)}
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            {t("aboutDesc", language)}
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {/* Purpose */}
          <div className="glass-card-light p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-300 mb-1">
                  Our Mission
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t("aboutPurpose", language)}
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card-light p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-amber-300 mb-1">
                  Advisory Categories
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t("aboutCategories", language)}
                </p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="glass-card-light p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-blue-300 mb-1">
                  Supported Languages
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t("aboutLanguages", language)}
                </p>
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div className="glass-card-light p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-red-300 mb-1">
                  Limitations
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t("aboutLimitations", language)}
                </p>
              </div>
            </div>
          </div>

          {/* Expert Reminder */}
          <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/15 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-amber-300 mb-1">
                  Important Reminder
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t("aboutExpertReminder", language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
