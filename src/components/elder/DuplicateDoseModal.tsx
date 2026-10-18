import React from 'react';
import { useApp } from '../../context/AppContext';
import { PillVisual } from '../common/PillVisual';
import { AlertCircle, CheckCircle2, RotateCcw, X } from 'lucide-react';

export const DuplicateDoseModal: React.FC = () => {
  const { duplicateWarning, setDuplicateWarning, undoTaken, markDoseTaken, language } = useApp();

  if (!duplicateWarning?.isOpen || !duplicateWarning.dose) return null;

  const isHindi = language === 'hi';
  const dose = duplicateWarning.dose;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <AlertCircle className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 leading-tight">
          {isHindi ? 'दवाई पहले ही ली जा चुकी है!' : 'Dose Already Confirmed!'}
        </h2>

        <p className="text-base font-semibold text-slate-700 mt-2 leading-relaxed">
          {isHindi
            ? `आपने ${dose.medicineHindiName} पहले ही ${dose.takenAt || 'आज'} ले ली है। दोबारा लेने से दवा की मात्रा दोगुनी हो सकती है।`
            : `You already confirmed taking ${dose.medicineName} at ${dose.takenAt || 'today'}. Taking it again may cause double-dosing.`}
        </p>

        {/* Pill preview */}
        <div className="my-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 w-full text-left">
          <PillVisual
            stripImage={dose.stripImage}
            pillAppearance={dose.pillAppearance}
            size="md"
            language={language}
          />
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {isHindi ? dose.medicineHindiName : dose.medicineName}
            </h4>
            <p className="text-xs font-semibold text-emerald-700 mt-0.5">
              ✓ {isHindi ? `समय: ${dose.takenAt || 'आज'} (दर्ज है)` : `Taken at ${dose.takenAt || 'Today'}`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => setDuplicateWarning(null)}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-lg shadow-md transition-all"
          >
            {isHindi ? 'समझ आ गया, दोबारा नहीं लेनी' : 'Understood, keep as taken'}
          </button>

          <button
            onClick={() => {
              undoTaken(dose.id, 'Papa');
              setDuplicateWarning(null);
            }}
            className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{isHindi ? 'गलती से मार्क हुआ था? वापस करें (Undo)' : 'Marked by mistake? Undo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
