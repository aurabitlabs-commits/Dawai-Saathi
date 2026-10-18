import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, X } from 'lucide-react';

export const ElderSnoozeModal: React.FC = () => {
  const { showSnoozeModal, setShowSnoozeModal, snoozeDose, doses, language } = useApp();

  if (!showSnoozeModal) return null;

  const isHindi = language === 'hi';
  const targetDose = doses.find(d => d.status === 'pending' || d.status === 'missed') || doses[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        {/* Clock Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <Clock className="w-8 h-8" />
        </div>

        <span className="text-xl font-black text-slate-800">
          {targetDose?.time || '09:00 AM'}
        </span>

        <h2 className="text-2xl font-black text-slate-900 mt-2">
          {isHindi ? 'अभी नहीं ले सकते?' : 'Cannot take right now?'}
        </h2>

        <p className="text-base font-semibold text-slate-600 mt-1">
          {isHindi ? '5, 10 या 30 मिनट के लिए स्नूज़ करें।' : 'Snooze for 5, 10, or 30 minutes.'}
        </p>

        {/* Large Snooze Options matching Storyboard Screen 3 */}
        <div className="w-full space-y-3.5 mt-6">
          <button
            onClick={() => targetDose && snoozeDose(targetDose.id, 5)}
            className="w-full h-16 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-900 font-black text-2xl flex items-center justify-center transition-all active:scale-[0.98]"
          >
            {isHindi ? '5 मिनट' : '5 Minutes'}
          </button>

          <button
            onClick={() => targetDose && snoozeDose(targetDose.id, 10)}
            className="w-full h-16 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-900 font-black text-2xl flex items-center justify-center transition-all active:scale-[0.98]"
          >
            {isHindi ? '10 मिनट' : '10 Minutes'}
          </button>

          <button
            onClick={() => targetDose && snoozeDose(targetDose.id, 30)}
            className="w-full h-16 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-900 font-black text-2xl flex items-center justify-center transition-all active:scale-[0.98]"
          >
            {isHindi ? '30 मिनट' : '30 Minutes'}
          </button>

          <button
            onClick={() => setShowSnoozeModal(false)}
            className="w-full py-4 text-base font-bold text-slate-600 hover:text-slate-800"
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
