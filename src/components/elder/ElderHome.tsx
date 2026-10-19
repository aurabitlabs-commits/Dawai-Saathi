import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Menu,
  Phone,
  Shield,
  Volume2,
  X,
  Utensils,
  Sparkles,
  Heart,
  AlertCircle,
} from 'lucide-react';
import { formatScheduleDate, getTodayDateString } from '../../utils/date';
import {
  DayPeriod,
  PERIOD_LABELS,
  getDayPeriod,
  getMealLabel,
  timeToMinutes,
} from '../../utils/doseText';

const PERIOD_ORDER: DayPeriod[] = ['morning', 'afternoon', 'evening', 'night'];

// Visual theme per day-period for effortless recognition by seniors
const PERIOD_THEMES: Record<DayPeriod, {
  bg: string;
  border: string;
  badge: string;
  badgeText: string;
  headerText: string;
  accent: string;
}> = {
  morning: {
    bg: 'bg-amber-50/80',
    border: 'border-amber-300',
    badge: 'bg-amber-100 border-amber-300 text-amber-950',
    badgeText: 'text-amber-950',
    headerText: 'text-amber-950',
    accent: 'text-amber-700',
  },
  afternoon: {
    bg: 'bg-sky-50/80',
    border: 'border-sky-300',
    badge: 'bg-sky-100 border-sky-300 text-sky-950',
    badgeText: 'text-sky-950',
    headerText: 'text-sky-950',
    accent: 'text-sky-700',
  },
  evening: {
    bg: 'bg-orange-50/80',
    border: 'border-orange-300',
    badge: 'bg-orange-100 border-orange-300 text-orange-950',
    badgeText: 'text-orange-950',
    headerText: 'text-orange-950',
    accent: 'text-orange-700',
  },
  night: {
    bg: 'bg-indigo-50/80',
    border: 'border-indigo-300',
    badge: 'bg-indigo-100 border-indigo-300 text-indigo-950',
    badgeText: 'text-indigo-950',
    headerText: 'text-indigo-950',
    accent: 'text-indigo-700',
  },
};

export const ElderHome: React.FC = () => {
  const {
    elder,
    doses,
    medicines,
    language,
    markDoseTaken,
    triggerSimulatedReminder,
    setShowCallModal,
    setShowWhoCanSeeModal,
    speakPrompt,
  } = useApp();

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const isHindi = language === 'hi';
  const todayDateStr = getTodayDateString();
  const contact = elder.emergencyContact;

  // Today's doses sorted chronologically
  const todayDoses = doses
    .filter(d => d.date === todayDateStr)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  const completedDoses = todayDoses.filter(d => d.status === 'taken');

  // Next dose: prioritize missed or pending/snoozed
  const nextDose =
    todayDoses.find(d => d.status === 'missed') ??
    todayDoses.find(d => d.status === 'pending' || d.status === 'snoozed');
  const allDone = todayDoses.length > 0 && completedDoses.length === todayDoses.length;

  const mealFor = (medicineId: string) =>
    getMealLabel(medicines.find(m => m.id === medicineId)?.mealRelation, isHindi);
  const getMedicineNotes = (medicineId: string) =>
    medicines.find(m => m.id === medicineId)?.notes;

  const handleSpeakOverview = () => {
    soundService.playBellChime();
    if (nextDose) {
      const meal = mealFor(nextDose.medicineId);
      speakPrompt(
        `नमस्ते ${elder.honorific || 'पापा'}। आज आपकी ${completedDoses.length} दवाइयाँ ली जा चुकी हैं। अगली खुराक ${nextDose.time} पर ${nextDose.medicineHindiName} है। खुराक: ${nextDose.dosage} ${meal ? `, ${meal}` : ''}।`,
        `Namaste ${elder.honorific || 'Papa'}. You have taken ${completedDoses.length} doses today. Next is ${nextDose.medicineName} at ${nextDose.time}.`
      );
    } else if (todayDoses.length === 0) {
      speakPrompt(
        'आज के लिए कोई दवाई दर्ज नहीं है। कृपया अपने परिवार से पुष्टि करें।',
        'No medicines are listed for today. Please check with your family caregiver.'
      );
    } else {
      speakPrompt(
        `नमस्ते ${elder.honorific || 'पापा'}! आज की सभी दवाइयाँ पूरी हो चुकी हैं। बहुत बढ़िया!`,
        `Namaste ${elder.honorific || 'Papa'}! All scheduled medicines for today are marked as taken. Great health!`
      );
    }
  };

  const grouped = PERIOD_ORDER.map(period => ({
    period,
    items: todayDoses.filter(d => getDayPeriod(d.time) === period),
  })).filter(group => group.items.length > 0);

  return (
    <div className="flex min-h-full flex-col bg-[#FDFBF7] text-slate-950 font-sans pb-12">
      {/* Radiant Warm Morning Greeting Banner */}
      <header className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white px-5 pt-5 pb-6 shadow-md border-b-2 border-amber-600/40">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-bold text-amber-100 flex items-center gap-1.5">
              <span>📅</span>
              <span>{formatScheduleDate(todayDateStr, language)}</span>
            </p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-black leading-tight text-white tracking-tight">
              {isHindi ? `नमस्ते, ${elder.honorific || 'पापा'}` : `Namaste, ${elder.honorific || 'Papa'}`}{' '}
              <span aria-hidden="true" className="inline-block animate-pulse">☀️</span>
            </h1>
          </div>

          <div className="flex shrink-0 gap-2.5">
            {/* Big Voice Button */}
            <button
              onClick={handleSpeakOverview}
              className="flex min-h-[58px] min-w-[58px] items-center justify-center gap-2 rounded-2xl bg-white text-amber-950 hover:bg-amber-50 active:scale-95 shadow-md border-2 border-amber-200 transition-transform"
              aria-label={isHindi ? "आज की दवाइयाँ बोलकर सुनें" : "Listen to today's medicine summary"}
              title={isHindi ? 'बोलकर सुनें' : 'Listen aloud'}
            >
              <Volume2 className="h-7 w-7 text-amber-900" aria-hidden="true" />
              <span className="hidden text-base font-black sm:inline text-amber-950">
                {isHindi ? 'सुनें' : 'Listen'}
              </span>
            </button>

            {/* Simple Menu button for secondary items */}
            <button
              onClick={() => setShowOptionsMenu(true)}
              className="flex min-h-[58px] min-w-[58px] items-center justify-center rounded-2xl bg-amber-700/60 hover:bg-amber-700 text-white border-2 border-amber-300/50 shadow-sm active:scale-95 transition-transform"
              aria-label={isHindi ? 'अन्य विकल्प खोलें' : 'Open more options'}
              title={isHindi ? 'विकल्प' : 'Options'}
            >
              <Menu className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-5 sm:px-5">
        {/* Progress & Encouragement Card */}
        <section
          className="rounded-3xl border-2 border-amber-200/90 bg-white p-5 shadow-sm"
          aria-label={isHindi ? 'आज की प्रगति' : "Today's status"}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-bold text-slate-600">
                {isHindi ? 'आज की दवाइयाँ' : "Today's medicines"}
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
                {todayDoses.length === 0
                  ? (isHindi ? 'कोई दवाई दर्ज नहीं' : 'No doses listed')
                  : isHindi
                  ? `${todayDoses.length} में से ${completedDoses.length} ली गईं`
                  : `${completedDoses.length} of ${todayDoses.length} taken`}
              </p>
            </div>

            {allDone ? (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs border-2 border-emerald-300" aria-label={isHindi ? 'पूरा हुआ' : 'Completed'}>
                <CheckCircle2 className="h-9 w-9 stroke-[2.5]" aria-hidden="true" />
              </span>
            ) : (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-900 shadow-xs border-2 border-amber-300">
                <Clock className="h-8 w-8" aria-hidden="true" />
              </span>
            )}
          </div>

          {todayDoses.length > 0 && (
            <div className="mt-4">
              <div
                className="h-3.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200"
                role="progressbar"
                aria-label={isHindi ? 'दवाइयों की प्रगति' : "Doses progress"}
                aria-valuemin={0}
                aria-valuemax={todayDoses.length}
                aria-valuenow={completedDoses.length}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${(completedDoses.length / todayDoses.length) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{completedDoses.length} {isHindi ? 'सम्पन्न' : 'Done'}</span>
                <span>{todayDoses.length - completedDoses.length} {isHindi ? 'बाकी' : 'Remaining'}</span>
              </div>
            </div>
          )}
        </section>

        {/* NEXT MEDICINE HERO CARD — Crisp, Vibrant, Life-Affirming */}
        {nextDose ? (
          <section
            className={`rounded-3xl border-4 p-6 shadow-xl bg-white transition-all ${
              nextDose.status === 'missed'
                ? 'border-rose-500 bg-rose-50/40 ring-4 ring-rose-200/60'
                : 'border-emerald-600 ring-4 ring-emerald-100/70'
            }`}
            aria-labelledby="next-dose-title"
          >
            {/* Top Badge & Big Time */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-slate-100">
              <span
                className={`rounded-xl px-3.5 py-1.5 text-base sm:text-lg font-black border-2 flex items-center gap-1.5 ${
                  nextDose.status === 'missed'
                    ? 'bg-rose-100 text-rose-950 border-rose-300'
                    : 'bg-amber-100 text-amber-950 border-amber-300'
                }`}
              >
                {nextDose.status === 'missed' ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-700" />
                    <span>{isHindi ? '⚠ खुराक छूट गई' : '⚠ Missed dose'}</span>
                  </>
                ) : (
                  <>
                    <span>⏰</span>
                    <span>{isHindi ? 'अगली दवाई' : 'Next medicine'}</span>
                  </>
                )}
              </span>

              {/* Big, High-Contrast Time */}
              <div className="flex items-center gap-2 text-4xl sm:text-5xl font-black text-slate-950 tabular-nums tracking-tight">
                <Clock className="w-9 h-9 text-blue-700 shrink-0" aria-hidden="true" />
                <span>{nextDose.time}</span>
              </div>
            </div>

            {/* Pill Visual and Prescription Info */}
            <div className="mt-5 flex items-start gap-4 sm:gap-5">
              <PillVisual
                stripImage={nextDose.stripImage}
                pillAppearance={nextDose.pillAppearance}
                size="lg"
                language={language}
              />
              <div className="min-w-0 flex-1">
                <h2
                  id="next-dose-title"
                  className="break-words text-2xl sm:text-3xl font-black leading-tight text-slate-950"
                >
                  {isHindi ? nextDose.medicineHindiName : nextDose.medicineName}
                </h2>

                {/* Dosage & Food Relation Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-xl border-2 border-blue-300 bg-blue-100 text-blue-950 px-3.5 py-1.5 text-lg font-black shadow-2xs">
                    {nextDose.dosage}
                  </span>
                  {mealFor(nextDose.medicineId) && (
                    <span className="rounded-xl border-2 border-amber-300 bg-amber-100 text-amber-950 px-3.5 py-1.5 text-lg font-bold flex items-center gap-1.5 shadow-2xs">
                      <Utensils className="w-4 h-4 text-amber-800" />
                      <span>{mealFor(nextDose.medicineId)}</span>
                    </span>
                  )}
                </div>

                {/* Pill appearance in Hindi so seniors can visually verify */}
                {nextDose.pillAppearance && (
                  <p className="mt-3 text-base font-bold text-slate-700 bg-slate-100/90 rounded-xl px-3 py-1.5 border border-slate-200">
                    <span className="text-slate-500 font-semibold">{isHindi ? 'पहचान: ' : 'Appearance: '}</span>
                    <span className="text-slate-900">
                      {isHindi
                        ? `${nextDose.pillAppearance.colorLabelHi} ${nextDose.pillAppearance.shapeLabelHi}`
                        : `${nextDose.pillAppearance.colorLabelEn} ${nextDose.pillAppearance.shapeLabelEn}`}
                    </span>
                    {nextDose.pillAppearance.imprintText && (
                      <span className="ml-1 text-slate-600 font-mono">({nextDose.pillAppearance.imprintText})</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Notes if available from prescription */}
            {getMedicineNotes(nextDose.medicineId) && (
              <details className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-3.5">
                <summary className="cursor-pointer py-1 text-base font-bold text-amber-950 flex items-center gap-2">
                  <span>💡</span>
                  <span>{isHindi ? 'डॉक्टर के निर्देश देखें' : "Doctor's instructions"}</span>
                </summary>
                <p className="mt-2 text-base leading-relaxed text-amber-950 font-medium">
                  {getMedicineNotes(nextDose.medicineId)}
                </p>
              </details>
            )}

            {/* ONE BIG PRIMARY ACTION BUTTON — Deep Emerald, Tactile, High-Contrast */}
            <button
              onClick={() => markDoseTaken(nextDose.id, elder.honorific || 'Papa')}
              className="mt-6 w-full min-h-[82px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-2xl sm:text-3xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-700/25 border-2 border-emerald-500 active:scale-[0.98] transition-all"
              aria-label={`${isHindi ? nextDose.medicineHindiName : nextDose.medicineName} — ${isHindi ? 'दवाई ले ली' : 'I took this medicine'}`}
            >
              <span className="flex items-center gap-3">
                <CheckCircle2 className="h-9 w-9 stroke-[3]" aria-hidden="true" />
                <span>{isHindi ? 'मैंने दवाई ले ली' : 'I Took My Medicine'}</span>
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-100 opacity-95">
                {isHindi ? 'दवाई खाने के बाद यहाँ दबाएँ' : 'Tap here after taking medicine'}
              </span>
            </button>
            <p className="mt-2.5 text-center text-sm sm:text-base font-semibold text-slate-500">
              {isHindi ? '✓ दवाई लेने के बाद ही यह हरा बटन दबाएँ।' : 'Tap only after you have swallowed the medicine.'}
            </p>
          </section>
        ) : (
          /* All Done Hero Card */
          <section
            className="rounded-3xl border-3 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 text-center shadow-md"
            aria-live="polite"
          >
            <div className="text-5xl mb-2" aria-hidden="true">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              {isHindi ? 'आज की सभी दवाइयाँ पूरी!' : 'All medicines completed today!'}
            </h2>
            <p className="mt-2 text-lg font-bold text-emerald-900">
              {isHindi
                ? `शाबाश ${elder.honorific || 'पापा'}! आपकी सेहत बहुत अच्छी रहेगी।`
                : `Well done ${elder.honorific || 'Papa'}! Your family is notified.`}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-emerald-300 text-base font-black text-emerald-900 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{isHindi ? 'अगली खुराक कल सुबह होगी 🌅' : 'Next dose is tomorrow morning'}</span>
            </div>
          </section>
        )}

        {/* ONE-TAP FAMILY CALL — Reassuring Sapphire Blue Card */}
        <button
          onClick={() => setShowCallModal(true)}
          className="w-full min-h-[72px] rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-xl px-5 py-3.5 flex items-center justify-between shadow-md active:scale-[0.98] border-2 border-blue-500 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ) : (
                <div className="w-13 h-13 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                  <Phone className="w-7 h-7 text-white" />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase font-extrabold text-blue-200 tracking-wider">
                {isHindi ? 'परिवार से बात करें' : 'Call Family Member'}
              </span>
              <span className="mt-0.5 block text-xl font-black text-white">
                {contact.name} · {contact.relation}
              </span>
            </div>
          </div>
          <Phone className="h-7 w-7 text-white shrink-0" aria-hidden="true" />
        </button>

        {/* TODAY'S FULL SCHEDULE — Grouped by Indian Medicine Routine Times */}
        <section className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-xs">
          <button
            type="button"
            onClick={() => setShowSchedule(value => !value)}
            aria-expanded={showSchedule}
            aria-controls="elder-todays-schedule"
            className="flex min-h-[68px] w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div>
              <span className="block text-xl font-black text-slate-950 flex items-center gap-2">
                <span>📋</span>
                <span>{isHindi ? 'आज की पूरी दवाइयों की सूची' : "Today's Full Medicine Schedule"}</span>
              </span>
              <span className="mt-1 block text-base font-bold text-slate-600">
                {isHindi
                  ? `${todayDoses.length} में से ${completedDoses.length} पूरी · बाकी देखने के लिए दबाएँ`
                  : `${completedDoses.length} of ${todayDoses.length} taken · Tap to view all`}
              </span>
            </div>
            <ChevronDown
              className={`h-7 w-7 shrink-0 text-slate-700 transition-transform ${showSchedule ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {showSchedule && (
            <div id="elder-todays-schedule" className="space-y-5 border-t-2 border-slate-200 p-5 bg-[#FAF9F5]">
              {todayDoses.length === 0 ? (
                <p className="text-base font-semibold leading-relaxed text-slate-700">
                  {isHindi
                    ? 'आज के लिए कोई खुराक दर्ज नहीं है। अपने परिवार से पूछें।'
                    : 'No doses are recorded for today. Please check with your caregiver.'}
                </p>
              ) : (
                grouped.map(({ period, items }) => {
                  const theme = PERIOD_THEMES[period];

                  return (
                    <div key={period} className={`rounded-2xl border-2 ${theme.border} ${theme.bg} p-4 shadow-2xs`}>
                      <h3 className={`mb-3 text-lg font-black ${theme.headerText} flex items-center gap-2 pb-2 border-b border-slate-200/60`}>
                        <span aria-hidden="true" className="text-2xl">{PERIOD_LABELS[period].icon}</span>
                        <span>{isHindi ? PERIOD_LABELS[period].hi : PERIOD_LABELS[period].en}</span>
                      </h3>

                      <div className="space-y-3">
                        {items.map(dose => {
                          const isTaken = dose.status === 'taken';
                          const isMissed = dose.status === 'missed';

                          return (
                            <article
                              key={dose.id}
                              className={`rounded-2xl border-2 p-4 transition-all ${
                                isTaken
                                  ? 'border-emerald-500 bg-emerald-50/90 shadow-2xs'
                                  : isMissed
                                  ? 'border-rose-400 bg-rose-50/90 shadow-2xs'
                                  : 'border-slate-300 bg-white shadow-xs'
                              }`}
                            >
                              <div className="flex items-start gap-3.5">
                                <PillVisual
                                  stripImage={dose.stripImage}
                                  pillAppearance={dose.pillAppearance}
                                  size="md"
                                  language={language}
                                />
                                <div className="min-w-0 flex-1">
                                  <h4 className="break-words text-xl font-black text-slate-950">
                                    {isHindi ? dose.medicineHindiName : dose.medicineName}
                                  </h4>
                                  <p className="mt-1 text-base font-extrabold text-slate-800 flex items-center gap-2">
                                    <span className="text-blue-800">{dose.time}</span>
                                    <span>·</span>
                                    <span>{dose.dosage}</span>
                                  </p>
                                  {mealFor(dose.medicineId) && (
                                    <p className="mt-1 text-base font-bold text-amber-900 flex items-center gap-1">
                                      <Utensils className="w-4 h-4 text-amber-800" />
                                      <span>{mealFor(dose.medicineId)}</span>
                                    </p>
                                  )}

                                  <div className="mt-2.5">
                                    {isTaken ? (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-200/90 text-emerald-950 font-black text-base border border-emerald-400">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                                        <span>{isHindi ? 'दवाई ले ली गई' : 'Taken'}</span>
                                      </span>
                                    ) : isMissed ? (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-200/90 text-rose-950 font-black text-base border border-rose-400">
                                        <AlertCircle className="w-5 h-5 text-rose-800" />
                                        <span>{isHindi ? 'समय बीत गया' : 'Missed'}</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-200 text-slate-800 font-bold text-base">
                                        <Clock className="w-4 h-4 text-slate-700" />
                                        <span>{isHindi ? 'लेने का समय' : 'Scheduled'}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {!isTaken && (
                                <button
                                  onClick={() => markDoseTaken(dose.id, elder.honorific || 'Papa')}
                                  className={`mt-4 w-full min-h-[58px] rounded-xl font-black text-lg flex items-center justify-center gap-2.5 text-white active:scale-[0.98] shadow-md transition-transform ${
                                    isMissed
                                      ? 'bg-rose-600 hover:bg-rose-700'
                                      : 'bg-emerald-600 hover:bg-emerald-700'
                                  }`}
                                  aria-label={`${isHindi ? dose.medicineHindiName : dose.medicineName} — ${isHindi ? 'दवाई ले ली' : 'I took this medicine'}`}
                                >
                                  <CheckCircle2 className="h-6 w-6 stroke-[3]" aria-hidden="true" />
                                  <span>{isHindi ? 'दवाई ले ली' : 'I took this medicine'}</span>
                                </button>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>
      </main>

      {/* OPTIONS MODAL — Clean, Warm, High-Contrast (No dark invisible text) */}
      {showOptionsMenu && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="elder-menu-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-xs sm:items-center sm:p-4 animate-in fade-in"
          onClick={event => {
            if (event.target === event.currentTarget) setShowOptionsMenu(false);
          }}
        >
          <div className="w-full max-w-lg rounded-t-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
              <h2 id="elder-menu-title" className="text-2xl font-black text-slate-900">
                {isHindi ? 'अन्य विकल्प व जानकारी' : 'Options & Information'}
              </h2>
              <button
                onClick={() => setShowOptionsMenu(false)}
                className="flex min-h-[50px] min-w-[50px] items-center justify-center rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
                aria-label={isHindi ? 'बंद करें' : 'Close'}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 py-5">
              {/* Family Connection Status Card */}
              <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/90 p-4">
                <p className="text-xs uppercase font-extrabold text-blue-900 tracking-wider">
                  {isHindi ? 'परिवार से जुड़ाव' : 'Family Connection'}
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {contact.name} ({contact.relation})
                </p>
                <p className="mt-1 text-base font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>
                    {elder.sharingPaused
                      ? (isHindi ? 'शेयरिंग रुकी हुई है' : 'Sharing is paused')
                      : (isHindi ? 'रीयल-टाइम सिंक सक्रिय' : 'Live Sync Active')}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowWhoCanSeeModal(true);
                  }}
                  className="mt-3.5 min-h-[52px] w-full rounded-xl border-2 border-blue-400 bg-white px-4 py-2.5 text-base font-extrabold text-blue-900 hover:bg-blue-50 shadow-xs"
                >
                  {isHindi ? 'देखें कौन-कौन आपकी खुराक देख सकता है' : 'See who can view my doses'}
                </button>
              </div>

              {/* Sound & Voice Test */}
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  triggerSimulatedReminder();
                }}
                className="flex min-h-[64px] w-full items-center gap-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 p-4 text-left transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-200 text-amber-950 flex items-center justify-center shrink-0">
                  <Bell className="h-6 w-6 text-amber-900" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-lg font-black text-slate-950 block">
                    {isHindi ? 'अलार्म घंटी व आवाज़ टेस्ट करें' : 'Test reminder sound & voice'}
                  </span>
                  <span className="text-xs font-bold text-slate-600 block">
                    {isHindi ? 'सुनें कि अलार्म कितना तेज बजता है' : 'Check speaker loudness'}
                  </span>
                </div>
              </button>

              {/* Health Assurance & Privacy Notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-base text-slate-800">
                <Shield className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
                <p className="font-medium">
                  {isHindi
                    ? 'आपकी सेहत की जानकारी केवल आपके परिवार तक सीमित है। कोई विज्ञापन नहीं।'
                    : 'Private & safe for your family. No commercial ads.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowOptionsMenu(false)}
              className="min-h-[60px] w-full rounded-2xl bg-slate-900 px-4 py-3 text-xl font-black text-white hover:bg-slate-800 transition-colors"
            >
              {isHindi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
