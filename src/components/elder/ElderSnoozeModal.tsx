import React from 'react';
import { useApp } from '../../context/AppContext';
<<<<<<< HEAD
import { Clock } from 'lucide-react';
import { isDemoMode } from '../../utils/demo';
=======
import { Clock, X } from 'lucide-react';
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63

export const ElderSnoozeModal: React.FC = () => {
  const { showSnoozeModal, setShowSnoozeModal, snoozeDose, doses, language } = useApp();

  if (!showSnoozeModal) return null;

  const isHindi = language === 'hi';
  const targetDose = doses.find(d => d.status === 'pending' || d.status === 'missed') || doses[1];

  return (
<<<<<<< HEAD
    <div role="dialog" aria-modal="true" aria-labelledby="snooze-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
      <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        {/* Clock Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <Clock className="w-8 h-8" />
        </div>

<<<<<<< HEAD
        <span className="text-2xl font-extrabold text-slate-900">
          {targetDose?.time || '09:00 AM'}
        </span>

        <h2 id="snooze-title" className="text-2xl font-extrabold text-slate-900 mt-2">
          {isHindi ? 'अभी नहीं ले सकते?' : 'Cannot take right now?'}
        </h2>

        <p className="text-lg font-semibold text-slate-700 mt-1">
=======
        <span className="text-xl font-black text-slate-800">
          {targetDose?.time || '09:00 AM'}
        </span>

        <h2 className="text-2xl font-black text-slate-900 mt-2">
          {isHindi ? 'अभी नहीं ले सकते?' : 'Cannot take right now?'}
        </h2>

        <p className="text-base font-semibold text-slate-600 mt-1">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          {isHindi ? '5, 10 या 30 मिनट के लिए स्नूज़ करें।' : 'Snooze for 5, 10, or 30 minutes.'}
        </p>

        {/* Large Snooze Options matching Storyboard Screen 3 */}
        <div className="w-full space-y-3 mt-4">
          <button
            onClick={() => targetDose && snoozeDose(targetDose.id, 5, false)}
<<<<<<< HEAD
            className="w-full min-h-[64px] rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-900 font-extrabold text-xl flex items-center justify-center transition-all active:scale-[0.98]"
=======
            className="w-full h-15 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-900 font-black text-xl flex items-center justify-center transition-all active:scale-[0.98]"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          >
            {isHindi ? '5 मिनट बाद याद दिलाएं' : '5 Minutes Later'}
          </button>

          <button
            onClick={() => targetDose && snoozeDose(targetDose.id, 10, false)}
<<<<<<< HEAD
            className="w-full min-h-[64px] rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-900 font-extrabold text-xl flex items-center justify-center transition-all active:scale-[0.98]"
=======
            className="w-full h-15 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-900 font-black text-xl flex items-center justify-center transition-all active:scale-[0.98]"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          >
            {isHindi ? '10 मिनट बाद याद दिलाएं' : '10 Minutes Later'}
          </button>

          <button
            onClick={() => targetDose && snoozeDose(targetDose.id, 30, false)}
<<<<<<< HEAD
            className="w-full min-h-[64px] rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-900 font-extrabold text-xl flex items-center justify-center transition-all active:scale-[0.98]"
=======
            className="w-full h-15 rounded-2xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-900 font-black text-xl flex items-center justify-center transition-all active:scale-[0.98]"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          >
            {isHindi ? '30 मिनट बाद याद दिलाएं' : '30 Minutes Later'}
          </button>

<<<<<<< HEAD
          {/* Developer-only: hidden unless ?demo=1 */}

          {isDemoMode && (
<button
=======
          {/* Quick Demo Test Fast Forward */}
          <button
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
            onClick={() => targetDose && snoozeDose(targetDose.id, 0.1, true)}
            className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-300"
          >
            <span>⚡ 5 सेकंड टेस्ट स्नूज़ (Test Auto Re-Alarm in 5s)</span>
          </button>
<<<<<<< HEAD
)}

          <button
            onClick={() => setShowSnoozeModal(false)}
            className="w-full min-h-[56px] text-lg font-bold text-slate-800 hover:text-slate-900"
=======

          <button
            onClick={() => setShowSnoozeModal(false)}
            className="w-full py-3 text-base font-bold text-slate-600 hover:text-slate-800"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          >
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
