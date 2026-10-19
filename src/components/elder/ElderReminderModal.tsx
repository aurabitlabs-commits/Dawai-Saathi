import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import { buildDoseSpeech, getMealLabel } from '../../utils/doseText';
import {
  CheckCircle2,
  Clock,
  Phone,
  Volume2,
  AlertCircle,
  Utensils,
  X,
  BellRing,
} from 'lucide-react';

export const ElderReminderModal: React.FC = () => {
  const {
    activeReminder,
    setActiveReminder,
    markDoseTaken,
    setShowSnoozeModal,
    setShowCallModal,
    medicines,
    elder,
    language,
    speakPrompt,
    snoozeDose,
  } = useApp();

  const [showDismissWarning, setShowDismissWarning] = useState(false);
  const isHindi = language === 'hi';

  // Speak prompt on open
  useEffect(() => {
    if (activeReminder) {
      const med = medicines.find(m => m.id === activeReminder.medicineId);
      const speech = buildDoseSpeech(activeReminder, med?.mealRelation);
      speakPrompt(speech.hi, speech.en);
    }
  }, [activeReminder]);

  // Safe Escape handler: never silently discard dose
  useEffect(() => {
    if (!activeReminder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDismissWarning(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeReminder]);

  if (!activeReminder) return null;

  const targetMed = medicines.find(m => m.id === activeReminder.medicineId);
  const mealRelation = targetMed?.mealRelation;
  const mealText = getMealLabel(mealRelation, isHindi);

  const handleRepeatVoice = () => {
    soundService.playBellChime();
    const speech = buildDoseSpeech(activeReminder, mealRelation);
    speakPrompt(speech.hi, speech.en);
  };

  const handleTakeDose = () => {
    markDoseTaken(activeReminder.id, elder.honorific || 'Papa');
  };

  const handleSnooze = () => {
    setActiveReminder(null);
    setShowSnoozeModal(true);
  };

  const handleCall = () => {
    setActiveReminder(null);
    setShowCallModal(true);
  };

  // If user tries to close without taking or snoozing
  const handleAttemptClose = () => {
    setShowDismissWarning(true);
  };

  const handleConfirmSnooze10 = () => {
    snoozeDose(activeReminder.id, 10);
    setShowDismissWarning(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
      aria-describedby="reminder-instructions"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md max-h-[94vh] bg-white rounded-3xl shadow-2xl border-4 border-amber-400 flex flex-col overflow-hidden">
        {/* Top Header Banner — Cheerful, Warm, Respectful */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-5 py-4 text-slate-950 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-xs flex items-center justify-center border-2 border-white/50 text-slate-950">
              <BellRing className="w-7 h-7 text-slate-950 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-white/40 px-2.5 py-0.5 rounded-md text-slate-950 inline-block">
                {isHindi ? 'दवाई का समय हो गया' : 'Medicine Reminder'}
              </span>
              <h2 id="reminder-title" className="text-2xl sm:text-3xl font-black mt-0.5 leading-tight text-slate-950">
                {isHindi ? `नमस्ते, ${elder.honorific || 'पापा'}` : `Namaste, ${elder.honorific || 'Papa'}`}
              </h2>
            </div>
          </div>

          <button
            onClick={handleAttemptClose}
            className="w-11 h-11 rounded-2xl bg-white/25 hover:bg-white/40 text-slate-950 flex items-center justify-center transition-colors border border-white/40"
            aria-label={isHindi ? 'बंद करें' : 'Close'}
            title={isHindi ? 'बंद करें' : 'Close'}
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Scrollable Center Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1 bg-[#FDFBF7]">
          {/* Scheduled Time Banner + Voice button */}
          <div className="bg-amber-100/80 p-4 rounded-2xl border-2 border-amber-300 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <Clock className="w-9 h-9 text-blue-800" aria-hidden="true" />
              <div>
                <p className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  {isHindi ? 'शेड्यूल समय' : 'Scheduled Time'}
                </p>
                <span className="text-3xl sm:text-4xl font-black text-slate-950 tabular-nums">
                  {activeReminder.time}
                </span>
              </div>
            </div>

            <button
              onClick={handleRepeatVoice}
              className="min-w-[58px] min-h-[58px] px-3.5 bg-amber-300 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-2xl flex items-center justify-center gap-1.5 transition-transform shadow-xs border-2 border-amber-400 font-black text-base"
              aria-label={isHindi ? 'दोबारा बोलकर सुनें' : 'Listen again'}
              title={isHindi ? 'दोबारा सुनें' : 'Listen again'}
            >
              <Volume2 className="w-7 h-7 text-amber-950" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isHindi ? 'सुनें' : 'Listen'}
              </span>
            </button>
          </div>

          {/* Medicine Card with Real Prescription Data */}
          <div
            id="reminder-instructions"
            className="p-5 bg-white rounded-3xl border-2 border-slate-300 shadow-sm flex items-start gap-4 text-left"
          >
            <PillVisual
              stripImage={activeReminder.stripImage}
              pillAppearance={activeReminder.pillAppearance}
              size="lg"
              language={language}
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                {isHindi ? activeReminder.medicineHindiName : activeReminder.medicineName}
              </h3>

              {/* Exact Configured Dosage and Meal Relation */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-lg font-black bg-blue-100 text-blue-950 border-2 border-blue-300 px-3.5 py-1.5 rounded-xl shadow-2xs">
                  {activeReminder.dosage}
                </span>
                {mealText && (
                  <span className="text-lg font-bold bg-amber-100 text-amber-950 border-2 border-amber-300 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                    <Utensils className="w-4 h-4 text-amber-800" />
                    <span>{mealText}</span>
                  </span>
                )}
              </div>

              {/* Pill Appearance Description in Hindi */}
              {activeReminder.pillAppearance && (
                <p className="mt-3 text-base font-bold text-slate-700 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-semibold">{isHindi ? 'पहचान: ' : 'Appearance: '}</span>
                  <span className="text-slate-950">
                    {isHindi
                      ? `${activeReminder.pillAppearance.colorLabelHi} ${activeReminder.pillAppearance.shapeLabelHi}`
                      : `${activeReminder.pillAppearance.colorLabelEn} ${activeReminder.pillAppearance.shapeLabelEn}`}
                  </span>
                  {activeReminder.pillAppearance.imprintText && (
                    <span className="ml-1 text-slate-600 font-mono">({activeReminder.pillAppearance.imprintText})</span>
                  )}
                </p>
              )}

              {targetMed?.notes && (
                <p className="mt-2.5 text-base font-medium text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  💡 {targetMed.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons — Sticky at bottom */}
        <div className="p-4 bg-white border-t-2 border-slate-200 space-y-3 shrink-0">
          {/* Action 1: TAKEN (Primary Huge Vibrant Green Button) */}
          <button
            onClick={handleTakeDose}
            autoFocus
            className="w-full min-h-[82px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] text-white font-black text-2xl sm:text-3xl flex items-center justify-center gap-3.5 shadow-lg shadow-emerald-700/25 border-2 border-emerald-500 transition-all"
          >
            <CheckCircle2 className="w-9 h-9 stroke-[3]" aria-hidden="true" />
            <span>{isHindi ? 'मैंने दवाई ले ली' : 'I Took It'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Action 2: SNOOZE */}
            <button
              onClick={handleSnooze}
              className="min-h-[58px] rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border-2 border-amber-300"
            >
              <Clock className="w-5 h-5 text-amber-900" aria-hidden="true" />
              <span>{isHindi ? 'बाद में याद दिलाएं' : 'Remind later'}</span>
            </button>

            {/* Action 3: CALL FAMILY */}
            <button
              onClick={handleCall}
              className="min-h-[58px] rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border-2 border-blue-300"
            >
              <Phone className="w-5 h-5 text-blue-800" aria-hidden="true" />
              <span>{isHindi ? 'परिवार को फोन' : 'Call family'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation guard to prevent accidental dismissal without action */}
      {showDismissWarning && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border-4 border-amber-400">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-950">
              {isHindi ? 'अलार्म बंद करना चाहते हैं?' : 'Close reminder?'}
            </h3>
            <p className="text-base font-semibold text-slate-700 mt-2">
              {isHindi
                ? 'यदि आपने अभी दवाई नहीं ली है, तो हम 10 मिनट बाद आपको फिर से याद दिला देंगे।'
                : 'If you have not taken it yet, we can remind you again in 10 minutes.'}
            </p>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={handleConfirmSnooze10}
                className="w-full min-h-[58px] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-md border-2 border-blue-500"
              >
                {isHindi ? '10 मिनट बाद याद दिलाएं' : 'Remind in 10 mins'}
              </button>
              <button
                onClick={() => {
                  setShowDismissWarning(false);
                  setActiveReminder(null);
                }}
                className="w-full min-h-[48px] text-slate-600 hover:text-slate-900 font-bold text-base"
              >
                {isHindi ? 'सीधे बंद करें' : 'Dismiss anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
