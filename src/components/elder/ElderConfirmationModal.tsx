import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, ChevronRight } from 'lucide-react';

export const ElderConfirmationModal: React.FC = () => {
  const { showConfirmation, setShowConfirmation, language } = useApp();

  if (!showConfirmation.isOpen) return null;

  const isHindi = language === 'hi';
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = '18 Oct 2026';

  const handleClose = () => {
    setShowConfirmation({ isOpen: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-7 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        {/* Big Animated Green Checkmark matching Storyboard */}
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-inner animate-in zoom-in duration-300">
          <Check className="w-14 h-14 stroke-[3.5]" />
        </div>

        <h2 className="text-3xl font-black text-slate-900 leading-snug">
          {isHindi ? 'शाबाश!' : 'Well Done!'}
        </h2>

        <p className="text-2xl font-bold text-slate-800 mt-2 leading-relaxed">
          {isHindi ? 'आपने दवाई ले ली है।' : 'You have taken your medicine.'}
        </p>

        {showConfirmation.dose && (
          <p className="text-lg font-bold text-emerald-800 mt-1">
            {isHindi ? showConfirmation.dose.medicineHindiName : showConfirmation.dose.medicineName}
          </p>
        )}

        <div className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full">
          {dateString}, {timeString}
        </div>

        <div className="w-full space-y-3 mt-8">
          {/* Big OK button */}
          <button
            onClick={handleClose}
            className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-700/25 transition-all"
          >
            {isHindi ? 'ठीक है' : 'OK'}
          </button>

          {/* Today's medicines button */}
          <button
            onClick={handleClose}
            className="w-full py-4 text-base font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{isHindi ? 'आज की सभी दवाइयाँ' : "View Today's Medicines"}</span>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
