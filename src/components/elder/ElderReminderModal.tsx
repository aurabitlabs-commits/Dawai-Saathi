<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import { buildDoseSpeech, getMealLabel } from '../../utils/doseText';
import { CheckCircle2, Clock, Phone, Volume2 } from 'lucide-react';
=======
import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import { CheckCircle2, Clock, Phone, Volume2, X } from 'lucide-react';
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63

export const ElderReminderModal: React.FC = () => {
  const {
    activeReminder,
    setActiveReminder,
    markDoseTaken,
    setShowSnoozeModal,
    setShowCallModal,
<<<<<<< HEAD
    medicines,
=======
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    language,
    speakPrompt,
  } = useApp();

<<<<<<< HEAD
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
    // Spoken text now reflects the REAL time, dose and meal relation
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
=======
  if (!activeReminder) return null;

  const isHindi = language === 'hi';

  const handleRepeatVoice = () => {
    soundService.playBellChime();
    const visualDesc = activeReminder.pillAppearance
      ? `${activeReminder.pillAppearance.colorLabelHi} रंग की ${activeReminder.pillAppearance.shapeLabelHi}`
      : 'दवाई';
    speakPrompt(
      `नमस्ते पापा। सुबह की दवाई का समय हो गया है। ${activeReminder.medicineHindiName}, ${visualDesc}, एक गोली खाने के बाद पानी के साथ लीजिए।`,
      `Namaste Papa. Time for your morning medicine. ${activeReminder.medicineName}, ${activeReminder.pillAppearance?.colorLabelEn || ''} ${activeReminder.pillAppearance?.shapeLabelEn || 'pill'}, 1 tablet after food with water.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 flex flex-col">
        {/* Top Alarm Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 p-5 text-center text-slate-900 relative">
          <button
            onClick={() => setActiveReminder(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <p className="text-sm font-bold tracking-wide uppercase opacity-90">
            {isHindi ? 'दवाई का समय' : 'MEDICINE TIME'}
          </p>
          <h2 className="text-2xl font-black mt-1 flex items-center justify-center gap-1.5">
            <span>{isHindi ? 'नमस्ते पापा' : 'Namaste Papa'}</span>
            <span>☀️</span>
          </h2>
          <p className="text-base font-bold text-amber-950 mt-0.5">
            {isHindi ? 'आपकी दवाई का समय हो गया है' : 'It is time for your medicine'}
          </p>
        </div>

        {/* Big Clock & Voice Button */}
        <div className="p-6 text-center bg-amber-50/50 border-b border-amber-100 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl font-black text-slate-900 tracking-tight">
              {activeReminder.time}
            </span>
            <button
              onClick={handleRepeatVoice}
              className="p-3 bg-amber-200 hover:bg-amber-300 rounded-full text-amber-950 active:scale-95 transition-all shadow-xs"
              title="दोबारा सुनें (Listen again)"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-5 w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 text-left">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
            <PillVisual
              stripImage={activeReminder.stripImage}
              pillAppearance={activeReminder.pillAppearance}
              size="lg"
              language={language}
            />
            <div className="flex-1">
<<<<<<< HEAD
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
=======
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                {isHindi ? activeReminder.medicineHindiName : activeReminder.medicineName}
              </h3>
              <p className="text-base font-bold text-slate-600 mt-1">
                {activeReminder.dosage} · {isHindi ? 'खाने के बाद' : 'After Food'}
              </p>
              {activeReminder.pillAppearance && (
                <div className="mt-1.5 inline-block text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200">
                  पहचान: {isHindi ? `${activeReminder.pillAppearance.colorLabelHi} ${activeReminder.pillAppearance.shapeLabelHi}` : `${activeReminder.pillAppearance.colorLabelEn} ${activeReminder.pillAppearance.shapeLabelEn}`}
                  {activeReminder.pillAppearance.imprintText && ` (${activeReminder.pillAppearance.imprintText})`}
                </div>
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
              )}
            </div>
          </div>
        </div>

<<<<<<< HEAD
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

=======
        {/* Giant Tactile Buttons matching Storyboard Screen 3 */}
        <div className="p-6 space-y-4 bg-white">
          {/* 1. Giant Green TAKEN Button */}
          <button
            onClick={() => markDoseTaken(activeReminder.id, 'Papa')}
            className="w-full h-22 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-3xl flex flex-col items-center justify-center shadow-xl shadow-emerald-700/30 transition-transform"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              <span>{isHindi ? 'दवाई ली' : 'Taken'}</span>
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase opacity-90 mt-0.5">
              {isHindi ? '(दबाएं जब दवाई ले ली हो)' : '(Tap when taken)'}
            </span>
          </button>

          {/* 2. Large Grey LATER Button */}
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          <button
            onClick={() => {
              setActiveReminder(null);
              setShowSnoozeModal(true);
            }}
<<<<<<< HEAD
            className="w-full min-h-[68px] rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Clock className="w-6 h-6" aria-hidden="true" />
            {isHindi ? 'बाद में याद दिलाएं' : 'Remind me later'}
          </button>

=======
            className="w-full h-16 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            <Clock className="w-6 h-6 text-slate-600" />
            <span>{isHindi ? 'बाद में (स्नूज़ करें)' : 'Later (Snooze)'}</span>
          </button>

          {/* 3. Call Family link */}
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          <button
            onClick={() => {
              setActiveReminder(null);
              setShowCallModal(true);
            }}
<<<<<<< HEAD
            className="w-full min-h-[56px] text-lg font-bold text-blue-800 flex items-center justify-center gap-2"
          >
            <Phone className="w-6 h-6" aria-hidden="true" />
            {isHindi ? 'परिवार से बात करें' : 'Call family'}
=======
            className="w-full py-3 text-base font-bold text-blue-700 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 text-blue-600" />
            <span>{isHindi ? 'परिवार से बात करें' : 'Call Family'}</span>
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          </button>
        </div>
      </div>
    </div>
  );
};
