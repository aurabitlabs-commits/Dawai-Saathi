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
  }, [showConfirmation.isOpen]);

  if (!showConfirmation.isOpen) return null;

  const isHindi = language === 'hi';
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = formatScheduleDate(getTodayDateString(), language);
  const dose = showConfirmation.dose;

  // Accidental tap? One clear way back that reconciles stock and dose status
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
            </div>
          </div>
        )}

        <div className="w-full space-y-3 mt-2">
          <button
            onClick={handleClose}
            autoFocus
            className="w-full min-h-[68px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold text-2xl flex items-center justify-center transition-transform"
          >
            {isHindi ? 'ठीक है' : 'OK'}
          </button>

          <button
            onClick={handleUndo}
            className="w-full min-h-[60px] rounded-2xl border-2 border-slate-400 text-slate-900 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            {isHindi ? 'गलती से दबा? वापस करें' : 'Pressed by mistake? Undo'}
          </button>
        </div>
      </div>
    </div>
  );
};
