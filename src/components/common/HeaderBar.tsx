import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Heart,
  HelpCircle,
  Languages,
} from 'lucide-react';

export const HeaderBar: React.FC<{
  onOpenWelcome: () => void;
}> = ({ onOpenWelcome }) => {
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                Dawai Saathi
              </span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                दवाई साथी
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {role === 'elder' ? 'दादू का फोन (Elder Mode)' : 'नेहा का फोन (Caregiver Mode)'}
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Alarm Trigger */}
          <button
            onClick={() => triggerSimulatedReminder()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs active:scale-95 transition-all"
            title="दादू के फोन पर अलार्म बजाकर देखें"
          >
            <Bell className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            <span className="hidden sm:inline">अलार्म चलाएं</span>
            <span className="sm:hidden">अलार्म</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setRole('elder')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                role === 'elder'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              दादू (Elder)
            </button>
            <button
              onClick={() => setRole('caregiver')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                role === 'caregiver'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>परिवार (Caregiver)</span>
              {unhandledAlerts > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="min-h-[40px] px-2.5 text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300"
            title="भाषा बदलें (Change Language)"
          >
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Welcome Intro Tour */}
          <button
            onClick={onOpenWelcome}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-800 rounded-xl hover:bg-slate-100 border border-slate-300"
            title="स्वागत व रोल स्क्रीन"
            aria-label="Help / मदद"
          >
            <HelpCircle className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
