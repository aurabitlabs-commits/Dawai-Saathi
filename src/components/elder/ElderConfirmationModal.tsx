<<<<<<< HEAD
import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PillVisual } from '../common/PillVisual';
import { formatScheduleDate, getTodayDateString } from '../../utils/date';
import { Check, RotateCcw } from 'lucide-react';

export const ElderConfirmationModal: React.FC = () => {
  const { showConfirmation, setShowConfirmation, language, undoTaken } = useApp();

  const handleClose = () => setShowConfirmation({ isOpen: false });

  useEffect(() => {
    if (!showConfirmation.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfirmation.isOpen]);
=======
import { useApp } from '../../context/AppContext';
import { PillVisual } from '../common/PillVisual';
import { Check, ChevronRight } from 'lucide-react';

export const ElderConfirmationModal: React.FC = () => {
  const { showConfirmation, setShowConfirmation, language } = useApp();
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63

  if (!showConfirmation.isOpen) return null;

  const isHindi = language === 'hi';
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
<<<<<<< HEAD
  const dateString = formatScheduleDate(getTodayDateString(), language); // was hard-coded "18 Oct 2026"
  const dose = showConfirmation.dose;

  // Accidental tap? One clear way back.
  const handleUndo = () => {
    if (dose) undoTaken(dose.id, 'Papa');
    handleClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
          <Check className="w-14 h-14 stroke-[3.5]" aria-hidden="true" />
        </div>

        <h2 id="confirm-title" className="text-3xl font-extrabold text-slate-900">
          {isHindi ? 'शाबाश!' : 'Well done!'}
        </h2>
        <p className="text-xl font-semibold text-slate-800 mt-1">
          {isHindi ? 'आपने दवाई ले ली है।' : 'You have taken your medicine.'}
        </p>

        {dose && (
          <div className="my-4 p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center gap-3 w-full text-left">
            <PillVisual
              stripImage={dose.stripImage}
              pillAppearance={dose.pillAppearance}
              size="md"
              language={language}
            />
            <div>
              <p className="text-xl font-bold text-slate-900">
                {isHindi ? dose.medicineHindiName : dose.medicineName}
              </p>
              <p className="text-base font-semibold text-slate-700">
                {dose.dosage} · {timeString}
              </p>
              <p className="text-base text-slate-700">{dateString}</p>
=======
  const dateString = '18 Oct 2026';

  const handleClose = () => {
    setShowConfirmation({ isOpen: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-7 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        {/* Big Animated Green Checkmark matching Storyboard */}
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner animate-in zoom-in duration-300">
          <Check className="w-14 h-14 stroke-[3.5]" />
        </div>

        <h2 className="text-3xl font-black text-slate-900 leading-snug">
          {isHindi ? 'शाबाश!' : 'Well Done!'}
        </h2>

        <p className="text-xl font-bold text-slate-800 mt-1 leading-relaxed">
          {isHindi ? 'आपने दवाई ले ली है।' : 'You have taken your medicine.'}
        </p>

        {showConfirmation.dose && (
          <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 w-full text-left">
            <PillVisual
              stripImage={showConfirmation.dose.stripImage}
              pillAppearance={showConfirmation.dose.pillAppearance}
              size="sm"
              language={language}
            />
            <div>
              <p className="text-base font-extrabold text-slate-900 leading-tight">
                {isHindi ? showConfirmation.dose.medicineHindiName : showConfirmation.dose.medicineName}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                {showConfirmation.dose.dosage} · {dateString}, {timeString}
              </p>
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
            </div>
          </div>
        )}

<<<<<<< HEAD
        <div className="w-full space-y-3 mt-2">
          <button
            onClick={handleClose}
            autoFocus
            className="w-full min-h-[68px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold text-2xl flex items-center justify-center transition-transform"
=======
        <div className="w-full space-y-3 mt-8">
          {/* Big OK button */}
          <button
            onClick={handleClose}
            className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-700/25 transition-all"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          >
            {isHindi ? 'ठीक है' : 'OK'}
          </button>

<<<<<<< HEAD
          <button
            onClick={handleUndo}
            className="w-full min-h-[60px] rounded-2xl border-2 border-slate-400 text-slate-900 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            {isHindi ? 'गलती से दबा? वापस करें' : 'Pressed by mistake? Undo'}
=======
          {/* Today's medicines button */}
          <button
            onClick={handleClose}
            className="w-full py-4 text-base font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{isHindi ? 'आज की सभी दवाइयाँ' : "View Today's Medicines"}</span>
            <ChevronRight className="w-5 h-5 text-slate-500" />
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          </button>
        </div>
      </div>
    </div>
  );
};
