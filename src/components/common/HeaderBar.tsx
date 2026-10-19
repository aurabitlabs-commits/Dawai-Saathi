import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
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
    <header className="sticky top-0 z-40 bg-[#0B1D33] text-white backdrop-blur-md border-b border-[#1B3652] px-4 py-2.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-500 text-white flex items-center justify-center shadow-xs">
            <span className="text-sm font-black tracking-tight">SP</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-white">
                SehatParivaar
              </span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                सेहत परिवार
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {role === 'elder' ? 'दादू का फोन (Elder Mode)' : 'नेहा का फोन (Caregiver Mode)'}
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Keep demo-only alarm controls off the elder home screen; available in More options. */}
          {role !== 'elder' && <button
            onClick={() => triggerSimulatedReminder()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-300 hover:bg-teal-200 text-[#071629] font-black text-xs shadow-xs active:scale-95 transition-all"
            title="दादू के फोन पर अलार्म बजाकर देखें"
          >
            <Bell className="w-3.5 h-3.5 text-[#071629] animate-bounce" />
            <span className="hidden sm:inline">अलार्म चलाएं</span>
            <span className="sm:hidden">अलार्म</span>
          </button>}

          {/* Role Switcher Pill */}
          <div className="flex items-center p-0.5 bg-[#132A43] rounded-xl border border-[#29435E] text-xs font-bold">
            <button
              onClick={() => setRole('elder')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                role === 'elder'
                  ? 'bg-teal-400 text-[#071629] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              दादू (Elder)
            </button>
            <button
              onClick={() => setRole('caregiver')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                role === 'caregiver'
                  ? 'bg-cyan-300 text-[#071629] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>परिवार (Caregiver)</span>
              {unhandledAlerts > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              )}
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="min-h-[40px] px-2.5 text-slate-900 hover:bg-[#18334F] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#34506D]"
            title="भाषा बदलें (Change Language)"
          >
            <Languages className="w-3.5 h-3.5 text-slate-300" />
            <span>{language === 'hi' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Welcome Intro Tour */}
          <button
            onClick={onOpenWelcome}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-800 rounded-xl hover:bg-[#18334F] border border-[#34506D]"
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
