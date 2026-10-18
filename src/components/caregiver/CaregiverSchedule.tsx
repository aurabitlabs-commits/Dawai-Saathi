import React from 'react';
import { useApp } from '../../context/AppContext';
import { PillVisual } from '../common/PillVisual';
import { formatScheduleDate, getTodayDateString, getWeekDaysStrip } from '../../utils/date';
import { Check, CheckCircle2, Clock, Edit3, Plus, RotateCcw, Trash2 } from 'lucide-react';

export const CaregiverSchedule: React.FC = () => {
  const {
    medicines,
    selectedDate,
    setSelectedDate,
    getDosesForDate,
    setShowAddMedicine,
    setEditingMedicine,
    markTakenByCaregiver,
    undoTaken,
    language,
  } = useApp();
  const isHindi = language === 'hi';

  const weekStrip = getWeekDaysStrip();
  const dosesForDate = getDosesForDate(selectedDate);
  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'दवाइयों का शेड्यूल' : 'Medicine Schedule'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {formatScheduleDate(selectedDate, language)}
            </p>
          </div>

          <button
            onClick={() => {
              setEditingMedicine(null);
              setShowAddMedicine(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'दवा जोड़ें' : 'Add Medicine'}</span>
          </button>
        </div>

        {/* Dynamic Rolling Week Strip */}
        <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {weekStrip.map(item => {
            const isSelected = item.fullDate === selectedDate;
            return (
              <button
                key={item.fullDate}
                onClick={() => setSelectedDate(item.fullDate)}
                className={`flex flex-col items-center justify-center min-w-[44px] py-2 px-1 rounded-xl text-xs font-semibold transition-all relative ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
                }`}
              >
                <span className="text-[10px] opacity-80">{item.dayName}</span>
                <span className="text-sm font-bold mt-0.5">{item.dayNum}</span>
                {item.isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-amber-300' : 'bg-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Medicines Schedule List */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>{dosesForDate.length} दवाइयाँ शेड्यूल में हैं</span>
          <span>समय अनुसार क्रमित</span>
        </div>

        {dosesForDate.map(dose => {
          const isTaken = dose.status === 'taken';
          const isMissed = dose.status === 'missed';
          const med = medicines.find(m => m.id === dose.medicineId);

          return (
            <div
              key={dose.id}
              className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between gap-3 transition-all ${
                isTaken
                  ? 'bg-white border-slate-200'
                  : isMissed
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <PillVisual
                  stripImage={dose.stripImage || med?.stripImage}
                  pillAppearance={dose.pillAppearance || med?.pillAppearance}
                  size="md"
                  language={language}
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                      {dose.time}
                    </span>
                    {med?.important && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        ज़रूरी
                      </span>
                    )}
                    {isTaken && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        ✓ {dose.takenAt || 'Taken'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                    {dose.medicineName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {dose.dosage} · {med?.notes || 'खाने के बाद'}
                  </p>
                  {dose.pillAppearance && (
                    <p className="text-[10px] font-bold text-slate-600 mt-0.5">
                      पहचान: {isHindi ? `${dose.pillAppearance.colorLabelHi} ${dose.pillAppearance.shapeLabelHi}` : `${dose.pillAppearance.colorLabelEn} ${dose.pillAppearance.shapeLabelEn}`}
                      {dose.pillAppearance.imprintText && ` (${dose.pillAppearance.imprintText})`}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons: Edit medicine + Mark status / Undo */}
              <div className="flex items-center gap-2">
                {med && (
                  <button
                    onClick={() => {
                      setEditingMedicine(med);
                      setShowAddMedicine(true);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="दवा व फ़ोटो एडिट करें"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}

                {isTaken ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <button
                      onClick={() => undoTaken(dose.id, 'Neha (Caregiver)')}
                      className="p-1.5 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Undo / स्थिति वापस करें"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => markTakenByCaregiver(dose.id)}
                    className="w-8 h-8 rounded-full border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                    title="मार्क करें (Mark as taken)"
                  >
                    <Check className="w-4 h-4 opacity-0 hover:opacity-100" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Prescription Reference Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
          <p className="font-bold text-slate-900 text-sm mb-1">
            डॉक्टर की पर्ची (Prescription Reference)
          </p>
          <p className="text-slate-600">
            डॉ. राजीव वर्मा (MD Med) · अगली विज़िट: 12 नवंबर 2026. सभी दवाइयाँ डॉक्टर की सलाह अनुसार ही दी जा रही हैं।
          </p>
        </div>
      </div>
    </div>
  );
};
