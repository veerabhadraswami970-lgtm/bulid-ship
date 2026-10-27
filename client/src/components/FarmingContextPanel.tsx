import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Droplets, Sprout } from "lucide-react";
import type { FarmingContext, SupportedLanguage } from "../types";
import { t } from "../i18n";

interface FarmingContextPanelProps {
  context: FarmingContext;
  onChange: (ctx: FarmingContext) => void;
  language: SupportedLanguage;
}

export default function FarmingContextPanel({
  context,
  onChange,
  language,
}: FarmingContextPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (field: keyof FarmingContext, value: string) => {
    onChange({ ...context, [field]: value || undefined });
  };

  const hasContext = Object.values(context).some(
    (v) => v && v !== "unknown"
  );

  return (
    <div className="glass-card-light mb-3 overflow-hidden">
      <button
        id="context-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium text-slate-300 hover:text-slate-100 transition-smooth"
      >
        <span className="flex items-center gap-2">
          {t(isOpen ? "contextHide" : "contextToggle", language)}
          {hasContext && !isOpen && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Crop Name */}
            <div className="relative">
              <Sprout className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
              <input
                id="ctx-crop"
                type="text"
                placeholder={t("cropName", language)}
                maxLength={100}
                value={context.cropName || ""}
                onChange={(e) => update("cropName", e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
              />
            </div>

            {/* Country */}
            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400" />
              <input
                id="ctx-country"
                type="text"
                placeholder={t("country", language)}
                maxLength={80}
                value={context.country || ""}
                onChange={(e) => update("country", e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
              />
            </div>

            {/* State */}
            <input
              id="ctx-state"
              type="text"
              placeholder={t("state", language)}
              maxLength={100}
              value={context.state || ""}
              onChange={(e) => update("state", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
            />

            {/* District */}
            <input
              id="ctx-district"
              type="text"
              placeholder={t("district", language)}
              maxLength={100}
              value={context.district || ""}
              onChange={(e) => update("district", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
            />

            {/* Locality */}
            <input
              id="ctx-locality"
              type="text"
              placeholder={t("locality", language)}
              maxLength={100}
              value={context.locality || ""}
              onChange={(e) => update("locality", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
            />

            {/* Soil Type */}
            <input
              id="ctx-soil"
              type="text"
              placeholder={t("soilType", language)}
              maxLength={100}
              value={context.soilType || ""}
              onChange={(e) => update("soilType", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
            />

            {/* Water Availability */}
            <div className="relative">
              <Droplets className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400" />
              <select
                id="ctx-water"
                value={context.waterAvailability || "unknown"}
                onChange={(e) => update("waterAvailability", e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
              >
                <option value="unknown" className="bg-slate-800">
                  {t("waterAvailability", language)} — {t("unknown", language)}
                </option>
                <option value="low" className="bg-slate-800">{t("low", language)}</option>
                <option value="medium" className="bg-slate-800">{t("medium", language)}</option>
                <option value="high" className="bg-slate-800">{t("high", language)}</option>
              </select>
            </div>

            {/* Growth Stage */}
            <select
              id="ctx-stage"
              value={context.growthStage || "unknown"}
              onChange={(e) => update("growthStage", e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-smooth"
            >
              <option value="unknown" className="bg-slate-800">
                {t("growthStage", language)} — {t("unknown", language)}
              </option>
              <option value="planning" className="bg-slate-800">{t("planning", language)}</option>
              <option value="sowing" className="bg-slate-800">{t("sowing", language)}</option>
              <option value="vegetative" className="bg-slate-800">{t("vegetative", language)}</option>
              <option value="flowering" className="bg-slate-800">{t("flowering", language)}</option>
              <option value="fruiting" className="bg-slate-800">{t("fruiting", language)}</option>
              <option value="harvesting" className="bg-slate-800">{t("harvesting", language)}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
