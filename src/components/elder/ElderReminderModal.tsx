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
      <div className="w-full max-w-md max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-amber-500 flex flex-col overflow-hidden">
        {/* Top Header Banner — shows patient greeting and configured scheduled time */}
        <div className="bg-amber-400 px-5 py-4 text-slate-900 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/80 px-2 py-0.5 rounded-md">
              {isHindi ? 'दवाई का समय' : 'Medicine Reminder'}
            </span>
            <h2 id="reminder-title" className="text-2xl sm:text-3xl font-black mt-0.5">
              {isHindi ? `नमस्ते ${elder.honorific || 'पापा'}` : `Namaste ${elder.honorific || 'Papa'}`}{' '}
              <span aria-hidden="true">☀️</span>
            </h2>
          </div>

          <button
            onClick={handleAttemptClose}
            className="w-10 h-10 rounded-full bg-amber-500/50 hover:bg-amber-500 text-slate-900 flex items-center justify-center transition-colors"
            aria-label={isHindi ? 'बंद करें' : 'Close'}
            title={isHindi ? 'बंद करें' : 'Close'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Center Content */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {/* Clock & Listen Aloud Button */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-8 h-8 text-blue-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">
                  {isHindi ? 'शेड्यूल समय' : 'Scheduled Time'}
                </p>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                  {activeReminder.time}
                </span>
              </div>
            </div>

            <button
              onClick={handleRepeatVoice}
              className="min-w-[56px] min-h-[56px] px-3 bg-amber-200 hover:bg-amber-300 active:scale-95 text-slate-900 rounded-2xl flex items-center justify-center gap-1.5 transition-transform shadow-xs"
              aria-label={isHindi ? 'दोबारा सुनें' : 'Listen again'}
            >
              <Volume2 className="w-7 h-7" aria-hidden="true" />
              <span className="text-sm font-bold hidden sm:inline">
                {isHindi ? 'सुनें' : 'Listen'}
              </span>
            </button>
          </div>

          {/* Medicine Card with Real Configured Prescription Data */}
          <div
            id="reminder-instructions"
            className="p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-xs flex items-center gap-4 text-left"
          >
            <PillVisual
              stripImage={activeReminder.stripImage}
              pillAppearance={activeReminder.pillAppearance}
              size="lg"
              language={language}
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {isHindi ? activeReminder.medicineHindiName : activeReminder.medicineName}
              </h3>

              {/* Exact Configured Dosage and Meal Relation */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-base font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-xl">
                  {activeReminder.dosage}
                </span>
                {mealText && (
                  <span className="text-base font-bold bg-amber-100 text-amber-950 px-3 py-1 rounded-xl flex items-center gap-1">
                    <Utensils className="w-4 h-4 text-amber-800" />
                    <span>{mealText}</span>
                  </span>
                )}
              </div>

              {/* Pill Appearance Description */}
              {activeReminder.pillAppearance && (
                <p className="mt-2 text-base font-semibold text-slate-700">
                  {isHindi ? 'पहचान: ' : 'Appearance: '}
                  <span className="text-slate-900 font-bold">
                    {isHindi
                      ? `${activeReminder.pillAppearance.colorLabelHi} ${activeReminder.pillAppearance.shapeLabelHi}`
                      : `${activeReminder.pillAppearance.colorLabelEn} ${activeReminder.pillAppearance.shapeLabelEn}`}
                  </span>
                  {activeReminder.pillAppearance.imprintText && (
                    <span> ({activeReminder.pillAppearance.imprintText})</span>
                  )}
                </p>
              )}

              {targetMed?.notes && (
                <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  💡 {targetMed.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons — Sticky at bottom, minimum 56px touch target */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5 shrink-0">
          {/* Action 1: TAKEN (Primary Big Green Button) */}
          <button
            onClick={handleTakeDose}
            autoFocus
            className="w-full min-h-[76px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-black text-2xl sm:text-3xl flex items-center justify-center gap-3 shadow-md transition-transform"
          >
            <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
            <span>{isHindi ? 'दवाई ले ली' : 'I took it'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Action 2: REMIND ME LATER (Snooze) */}
            <button
              onClick={handleSnooze}
              className="min-h-[56px] rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Clock className="w-5 h-5 text-slate-700" aria-hidden="true" />
              <span>{isHindi ? 'बाद में याद दिलाएं' : 'Remind later'}</span>
            </button>

            {/* Action 3: CALL FAMILY */}
            <button
              onClick={handleCall}
              className="min-h-[56px] rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-blue-300"
            >
              <Phone className="w-5 h-5 text-blue-700" aria-hidden="true" />
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
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border-2 border-amber-400">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {isHindi ? 'रिमाइंडर बंद करना चाहते हैं?' : 'Close reminder?'}
            </h3>
            <p className="text-base text-slate-700 mt-2">
              {isHindi
                ? 'यदि आपने अभी दवाई नहीं ली है, तो हम 10 मिनट बाद आपको फिर से याद दिला देंगे।'
                : 'If you have not taken it yet, we can remind you again in 10 minutes.'}
            </p>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleConfirmSnooze10}
                className="w-full min-h-[56px] bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-lg rounded-2xl"
              >
                {isHindi ? '10 मिनट बाद याद दिलाएं' : 'Remind in 10 mins'}
              </button>
              <button
                onClick={() => {
                  setShowDismissWarning(false);
                  setActiveReminder(null);
                }}
                className="w-full min-h-[48px] text-slate-600 hover:text-slate-900 font-bold text-sm"
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
