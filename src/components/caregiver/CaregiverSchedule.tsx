import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PillVisual } from '../common/PillVisual';
import {
  formatScheduleDate,
  getTodayDateString,
  getWeekDaysStrip,
} from '../../utils/date';
import {
  DayPeriod,
  PERIOD_LABELS,
  getDayPeriod,
  getMealLabel,
  timeToMinutes,
} from '../../utils/doseText';
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RotateCcw,
  Filter,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { DoseEvent } from '../../types';

const PERIOD_ORDER: DayPeriod[] = ['morning', 'afternoon', 'evening', 'night'];

type FilterStatus = 'all' | 'pending' | 'taken' | 'missed';

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

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [doseToUndo, setDoseToUndo] = useState<DoseEvent | null>(null);

  const isHindi = language === 'hi';
  const todayStr = getTodayDateString();
  const isToday = selectedDate === todayStr;
  const weekStrip = getWeekDaysStrip(selectedDate);
  const rawDosesForDate = getDosesForDate(selectedDate);

  // Sort chronologically
  const sortedDoses = [...rawDosesForDate].sort(
    (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
  );

  // Filter doses based on statusFilter
  const filteredDoses = sortedDoses.filter(d => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'taken') return d.status === 'taken';
    if (statusFilter === 'missed') return d.status === 'missed';
    if (statusFilter === 'pending') return d.status === 'pending' || d.status === 'snoozed';
    return true;
  });

  // Group filtered doses into morning, afternoon, evening, night
  const grouped = PERIOD_ORDER.map(period => ({
    period,
    items: filteredDoses.filter(d => getDayPeriod(d.time) === period),
  })).filter(g => g.items.length > 0);

  // Count summaries
  const totalCount = sortedDoses.length;
  const takenCount = sortedDoses.filter(d => d.status === 'taken').length;
  const missedCount = sortedDoses.filter(d => d.status === 'missed').length;
  const pendingCount = sortedDoses.filter(d => d.status === 'pending' || d.status === 'snoozed').length;

  const mealFor = (medicineId: string) =>
    getMealLabel(medicines.find(m => m.id === medicineId)?.mealRelation, isHindi);

  const handleConfirmUndo = () => {
    if (doseToUndo) {
      undoTaken(doseToUndo.id, 'Caregiver');
      setDoseToUndo(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-28 bg-[#FAF7F2]">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-amber-200/80 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'दवाइयों का शेड्यूल' : 'Caregiver Schedule'}
            </h1>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {formatScheduleDate(selectedDate, language)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Calendar Date Picker Input */}
            <div className="relative">
              <label
                htmlFor="caregiver-date-picker"
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                title={isHindi ? 'कैलेंडर से तारीख चुनें' : 'Pick date from calendar'}
              >
                <CalendarIcon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">{isHindi ? 'कैलेंडर' : 'Pick Date'}</span>
              </label>
              <input
                id="caregiver-date-picker"
                type="date"
                value={selectedDate}
                onChange={e => e.target.value && setSelectedDate(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                aria-label={isHindi ? 'तारीख चुनें' : 'Select date'}
              />
            </div>

            {/* Jump to Today button if looking at other dates */}
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
              >
                {isHindi ? 'आज' : 'Today'}
              </button>
            )}

            {/* Add Medicine Secondary Action */}
            <button
              onClick={() => {
                setEditingMedicine(null);
                setShowAddMedicine(true);
              }}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? 'दवा जोड़ें' : 'Add'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Rolling Week Strip */}
        <div className="mt-3.5 flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {weekStrip.map(item => {
            const isSelected = item.fullDate === selectedDate;
            return (
              <button
                key={item.fullDate}
                onClick={() => setSelectedDate(item.fullDate)}
                className={`flex flex-col items-center justify-center min-w-[46px] py-2 px-1 rounded-xl text-xs font-semibold transition-all relative ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200/70'
                }`}
              >
                <span className={`text-[10px] uppercase ${isSelected ? 'text-blue-100 font-bold' : 'text-slate-500'}`}>
                  {item.dayName}
                </span>
                <span className="text-sm font-extrabold mt-0.5 tabular-nums">{item.dayNum}</span>
                {item.isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-amber-300' : 'bg-emerald-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Tabs: All, Pending, Taken, Missed */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'सभी' : 'All'}</span>
            <span className="text-[10px] px-1 bg-slate-200 rounded-full">{totalCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              statusFilter === 'pending'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'बाकी' : 'Pending'}</span>
            <span className="text-[10px] px-1 bg-blue-100 text-blue-900 rounded-full">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('taken')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              statusFilter === 'taken'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'ले ली' : 'Taken'}</span>
            <span className="text-[10px] px-1 bg-emerald-100 text-emerald-900 rounded-full">
              {takenCount}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('missed')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              statusFilter === 'missed'
                ? 'bg-white text-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'छूटी' : 'Missed'}</span>
            <span className="text-[10px] px-1 bg-red-100 text-red-900 rounded-full">
              {missedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Medicines Schedule List — Grouped into Morning, Afternoon, Evening, Night */}
      <div className="p-5 space-y-5">
        {filteredDoses.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
            <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">
              {isHindi ? 'इस फ़िल्टर में कोई खुराक नहीं है' : 'No doses found in this filter'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi ? 'अन्य फ़िल्टर या तारीख चुनकर देखें।' : 'Try selecting All or a different date.'}
            </p>
          </div>
        ) : (
          grouped.map(({ period, items }) => (
            <div key={period} className="space-y-2.5">
              {/* Period Header */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <span>{PERIOD_LABELS[period].icon}</span>
                  <span>{isHindi ? PERIOD_LABELS[period].hi : PERIOD_LABELS[period].en}</span>
                </span>
                <span className="text-slate-500 font-semibold">{items.length} दवा</span>
              </div>

              {/* Dose Cards */}
              <div className="space-y-3">
                {items.map(dose => {
                  const isTaken = dose.status === 'taken';
                  const isMissed = dose.status === 'missed';
                  const isSnoozed = dose.status === 'snoozed';
                  const med = medicines.find(m => m.id === dose.medicineId);
                  const meal = mealFor(dose.medicineId);

                  return (
                    <div
                      key={dose.id}
                      className={`p-4 rounded-2xl border shadow-xs transition-all ${
                        isTaken
                          ? 'bg-white border-emerald-200 ring-1 ring-emerald-50'
                          : isMissed
                          ? 'bg-red-50/70 border-red-300'
                          : isSnoozed
                          ? 'bg-amber-50/80 border-amber-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <PillVisual
                            stripImage={dose.stripImage || med?.stripImage}
                            pillAppearance={dose.pillAppearance || med?.pillAppearance}
                            size="md"
                            language={language}
                          />

                          <div>
                            {/* Time & Urgent Tag */}
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-blue-900 tabular-nums">
                                {dose.time}
                              </span>
                              {med?.important && (
                                <span className="text-[10px] font-bold text-red-800 bg-red-100 border border-red-200 px-1.5 py-0.2 rounded">
                                  ज़रूरी
                                </span>
                              )}
                            </div>

                            {/* Medicine Name */}
                            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                              {dose.medicineName}
                            </h3>
                            <p className="text-xs text-slate-600">
                              {dose.medicineHindiName}
                            </p>

                            {/* Dose & Meal */}
                            <p className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-2">
                              <span>खुराक: {dose.dosage}</span>
                              {meal && <span>· {meal}</span>}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-right shrink-0">
                          {isTaken ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'ले ली' : 'Taken'}</span>
                            </span>
                          ) : isMissed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'छूट गई' : 'Missed'}</span>
                            </span>
                          ) : isSnoozed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'स्नूज़' : 'Snoozed'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'बाकी' : 'Due'}</span>
                            </span>
                          )}

                          {isTaken && dose.takenAt && (
                            <p className="text-[10px] text-slate-500 font-semibold mt-1">
                              {dose.takenAt} पर
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Explicit Action Footer */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {isTaken ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-emerald-800 font-medium">
                              {dose.markedBy ? `${dose.markedBy} द्वारा दर्ज` : 'दर्ज किया गया'}
                            </span>

                            {/* Explicit Undo Button with confirmation */}
                            <button
                              onClick={() => setDoseToUndo(dose)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'वापस करें (Undo)' : 'Undo'}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs text-slate-500">
                              {isMissed
                                ? isHindi ? 'तुरंत डॉक्टर या पर्ची की सलाह देखें' : 'Consult prescription guidance'
                                : isHindi ? 'समय पर याद दिलाएं' : 'Reminder will sound'}
                            </span>

                            <button
                              onClick={() => markTakenByCaregiver(dose.id)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isHindi ? 'ले ली (Mark Taken)' : 'Mark Taken'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Explicit Undo Confirmation Dialog */}
      {doseToUndo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {isHindi ? 'खुराक की स्थिति वापस करें?' : 'Undo Taken Status?'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {doseToUndo.medicineName} · {doseToUndo.time}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 my-4">
              <p className="font-bold text-slate-900">
                {isHindi ? 'क्या बदलाव होगा:' : 'What will happen:'}
              </p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  {isHindi
                    ? 'खुराक फिर से "लंबित" (Pending) स्थिति में आ जाएगी।'
                    : 'Dose will be reverted back to "Pending".'}
                </li>
                <li>
                  <span className="font-bold text-emerald-800">
                    {isHindi
                      ? 'स्टॉक में 1 गोली (+1) वापस जुड़ जाएगी।'
                      : 'Medicine stock will be restored by 1 tablet (+1).'}
                  </span>
                </li>
                <li>
                  {isHindi
                    ? 'पुष्टि अलर्ट रिकॉर्ड हटा दिया जाएगा।'
                    : 'The dose-confirmation alert will be reconciled.'}
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmUndo}
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-extrabold text-sm rounded-xl transition-colors"
              >
                {isHindi ? 'हाँ, वापस करें और स्टॉक जोड़ें' : 'Yes, Undo & Restore Stock'}
              </button>
              <button
                onClick={() => setDoseToUndo(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
