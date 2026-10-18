import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Bell,
  Heart,
  HelpCircle,
  Languages,
  Sparkles,
  Smartphone,
  User,
  Volume2,
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
              <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                Dawai Saathi
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                दवाई साथी
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 leading-none mt-0.5">
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
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-200"
            title="भाषा बदलें (Change Language)"
          >
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Welcome Intro Tour */}
          <button
            onClick={onOpenWelcome}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            title="स्वागत व रोल स्क्रीन"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
