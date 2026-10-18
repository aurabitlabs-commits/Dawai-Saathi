import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import { buildDoseSpeech, getMealLabel } from '../../utils/doseText';
import { CheckCircle2, Clock, Phone, Volume2 } from 'lucide-react';

export const ElderReminderModal: React.FC = () => {
  const {
    activeReminder,
    setActiveReminder,
    markDoseTaken,
    setShowSnoozeModal,
    setShowCallModal,
    medicines,
    language,
    speakPrompt,
  } = useApp();

  // Escape = "later" (never a silent dismissal that loses the reminder)
  useEffect(() => {
    if (!activeReminder) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveReminder(null);
        setShowSnoozeModal(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeReminder, setActiveReminder, setShowSnoozeModal]);

  if (!activeReminder) return null;

  const isHindi = language === 'hi';
  const meal = medicines.find(m => m.id === activeReminder.medicineId)?.mealRelation;
  const mealText = getMealLabel(meal, isHindi);

  const handleRepeatVoice = () => {
    soundService.playBellChime();
    // Spoken text reflects the REAL time, dose and meal relation
    const speech = buildDoseSpeech(activeReminder, meal);
    speakPrompt(speech.hi, speech.en);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md max-h-[96vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-amber-500 flex flex-col">
        {/* Top banner — no close "X": the reminder must be answered (taken / later) */}
        <div className="bg-amber-400 p-5 text-center text-slate-900">
          <p className="text-lg font-bold">{isHindi ? 'दवाई का समय' : 'Medicine time'}</p>
          <h2 id="reminder-title" className="text-3xl font-extrabold mt-1">
            {isHindi ? 'नमस्ते पापा' : 'Namaste Papa'} <span aria-hidden="true">☀️</span>
          </h2>
        </div>

        {/* Clock + listen again */}
        <div className="p-5 text-center bg-amber-50 border-b border-amber-200 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-extrabold text-slate-900">{activeReminder.time}</span>
            <button
              onClick={handleRepeatVoice}
              className="min-w-[56px] min-h-[56px] flex items-center justify-center bg-amber-200 hover:bg-amber-300 rounded-full text-slate-900 active:scale-95 transition-transform"
              aria-label={isHindi ? 'दोबारा सुनें' : 'Listen again'}
            >
              <Volume2 className="w-7 h-7" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 w-full bg-white rounded-2xl p-4 border-2 border-slate-300 flex items-center gap-4 text-left">
            <PillVisual
              stripImage={activeReminder.stripImage}
              pillAppearance={activeReminder.pillAppearance}
              size="lg"
              language={language}
            />
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-slate-900">
                {isHindi ? activeReminder.medicineHindiName : activeReminder.medicineName}
              </h3>
              <p className="text-lg font-semibold text-slate-800 mt-1">
                {activeReminder.dosage}
                {mealText && ` · ${mealText}`}
              </p>
              {activeReminder.pillAppearance && (
                <p className="mt-1 text-base font-semibold text-slate-800">
                  {isHindi ? 'पहचान: ' : 'Looks like: '}
                  {isHindi
                    ? `${activeReminder.pillAppearance.colorLabelHi} ${activeReminder.pillAppearance.shapeLabelHi}`
                    : `${activeReminder.pillAppearance.colorLabelEn} ${activeReminder.pillAppearance.shapeLabelEn}`}
                  {activeReminder.pillAppearance.imprintText &&
                    ` (${activeReminder.pillAppearance.imprintText})`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Three clear choices */}
        <div className="p-5 space-y-4 bg-white">
          <button
            onClick={() => markDoseTaken(activeReminder.id, 'Papa')}
            autoFocus
            className="w-full min-h-[96px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold text-3xl flex flex-col items-center justify-center transition-transform"
          >
            <span className="flex items-center gap-3">
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
              {isHindi ? 'दवाई ली' : 'I took it'}
            </span>
            <span className="text-lg font-semibold mt-0.5">
              {isHindi ? 'दवाई लेने के बाद दबाएं' : 'Press after taking the medicine'}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveReminder(null);
              setShowSnoozeModal(true);
            }}
            className="w-full min-h-[68px] rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Clock className="w-6 h-6" aria-hidden="true" />
            {isHindi ? 'बाद में याद दिलाएं' : 'Remind me later'}
          </button>

          <button
            onClick={() => {
              setActiveReminder(null);
              setShowCallModal(true);
            }}
            className="w-full min-h-[56px] text-lg font-bold text-blue-800 flex items-center justify-center gap-2"
          >
            <Phone className="w-6 h-6" aria-hidden="true" />
            {isHindi ? 'परिवार से बात करें' : 'Call family'}
          </button>
        </div>
      </div>
    </div>
  );
};
