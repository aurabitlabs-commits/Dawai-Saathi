import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Heart,
  HelpCircle,
  Languages,
  Smartphone,
} from 'lucide-react';

export const HeaderBar: React.FC<{
  onOpenWelcome: () => void;
  onOpenInstall?: () => void;
}> = ({ onOpenWelcome, onOpenInstall }) => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    triggerSimulatedReminder,
    alerts,
  } = useApp();

  const isHindi = language === 'hi';
  const unhandledAlerts = alerts.filter(a => a.status === 'unclaimed').length;

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-4 pb-2.5 shadow-xs"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.875rem)' }}
    >
      <div className="max-w-4xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3">
        {/* Brand Zone */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">
                SehatParivaar
              </span>
              <span className="hidden sm:inline-flex text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                सेहत परिवार
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
              {role === 'elder' ? 'दादू का फोन (Elder Mode)' : 'नेहा का फोन (Caregiver Mode)'}
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex w-full items-center justify-between gap-1.5 sm:w-auto sm:justify-end sm:gap-2">
          {/* Quick Demo Alarm Trigger (available in caregiver mode) */}
          {role !== 'elder' && (
            <button
              onClick={() => triggerSimulatedReminder()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xs active:scale-95 transition-all"
              title="दादू के फोन पर अलार्म बजाकर देखें"
            >
              <Bell className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
              <span className="hidden sm:inline">अलार्म चलाएं</span>
              <span className="sm:hidden">अलार्म</span>
            </button>
          )}

          {/* Role Switcher Pill */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-bold">
            <button
              onClick={() => setRole('elder')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg transition-all ${
                role === 'elder'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="sm:hidden">दादू</span>
              <span className="hidden sm:inline">दादू (Elder)</span>
            </button>
            <button
              onClick={() => setRole('caregiver')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                role === 'caregiver'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="sm:hidden">परिवार</span>
              <span className="hidden sm:inline">परिवार (Caregiver)</span>
              {unhandledAlerts > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="min-h-[40px] px-2 sm:px-2.5 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
            title="भाषा बदलें (Change Language)"
          >
            <Languages className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Install on Phone Modal Trigger */}
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="min-h-[40px] px-2 sm:px-3 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-xs font-black flex items-center gap-1.5 border border-emerald-300 transition-colors shadow-2xs"
              title="अपने फोन में ऐप इंस्टॉल करें (Install on Phone)"
              aria-label="Install on Phone / फोन में इंस्टॉल करें"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">{isHindi ? 'फोन में लगाएं' : 'Phone App'}</span>
            </button>
          )}

          {/* Welcome Intro Tour */}
          <button
            onClick={onOpenWelcome}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-700 rounded-xl hover:bg-slate-100 border border-slate-300 transition-colors"
            title="स्वागत व रोल स्क्रीन"
            aria-label="Help / मदद"
          >
            <HelpCircle className="w-5 h-5 text-slate-600" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
