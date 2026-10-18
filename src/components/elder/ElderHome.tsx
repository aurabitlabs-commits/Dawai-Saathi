import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import {
  Bell,
  CheckCircle2,
  Clock,
  Menu,
  Phone,
  Shield,
  Volume2,
  X,
  Sparkles,
  Utensils,
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
  const isHindi = language === 'hi';
  const todayDateStr = getTodayDateString();
  const contact = elder.emergencyContact;

  // Today's doses only, ordered chronologically
  const todayDoses = doses
    .filter(d => d.date === todayDateStr)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  const completedDoses = todayDoses.filter(d => d.status === 'taken');

  // Next dose: prioritize missed or pending/snoozed
  const nextDose =
    todayDoses.find(d => d.status === 'missed') ??
    todayDoses.find(d => d.status === 'pending' || d.status === 'snoozed');

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
        `Namaste ${elder.honorific || 'Papa'}. You have taken ${completedDoses.length} medicines today. Next dose is ${nextDose.medicineName} at ${nextDose.time}.`
      );
    } else {
      speakPrompt(
        `नमस्ते ${elder.honorific || 'पापा'}! आज की सभी दवाइयाँ पूरी हो चुकी हैं। बहुत बढ़िया!`,
        `Namaste ${elder.honorific || 'Papa'}! All medicines for today have been taken. Great job!`
      );
    }
  };

  // Group today's doses by morning, afternoon, evening, night
  const grouped = PERIOD_ORDER.map(period => ({
    period,
    items: todayDoses.filter(d => getDayPeriod(d.time) === period),
  })).filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col min-h-full pb-12 bg-slate-50 text-slate-900 font-sans">
      {/* Elder Top Header — uncluttered, high contrast */}
      <header className="bg-amber-100/80 px-5 pt-5 pb-5 border-b border-amber-200">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-slate-800">
              {formatScheduleDate(todayDateStr, language)}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-0.5">
              {isHindi ? `नमस्ते ${elder.honorific || 'पापा'}` : `Namaste ${elder.honorific || 'Papa'}`}{' '}
              <span aria-hidden="true">☀️</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Big Voice Button */}
            <button
              onClick={handleSpeakOverview}
              className="min-w-[56px] min-h-[56px] px-3 bg-amber-300 hover:bg-amber-400 active:scale-95 text-slate-900 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-transform"
              aria-label={isHindi ? 'बोलकर सुनें' : 'Listen aloud'}
              title={isHindi ? 'बोलकर सुनें' : 'Listen aloud'}
            >
              <Volume2 className="w-7 h-7 text-slate-900" aria-hidden="true" />
              <span className="text-sm font-bold hidden sm:inline">
                {isHindi ? 'सुनें' : 'Listen'}
              </span>
            </button>

            {/* Simple Menu button for secondary items */}
            <button
              onClick={() => setShowOptionsMenu(true)}
              className="min-w-[56px] min-h-[56px] bg-white hover:bg-slate-100 active:scale-95 text-slate-800 rounded-2xl border border-slate-300 flex items-center justify-center transition-transform"
              aria-label={isHindi ? 'अन्य विकल्प' : 'More options'}
            >
              <Menu className="w-7 h-7" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Calm progress indication */}
        <div className="mt-3 flex items-center justify-between bg-white/70 py-2 px-3.5 rounded-xl border border-amber-200/80">
          <span className="text-base font-bold text-slate-800">
            {completedDoses.length === todayDoses.length && todayDoses.length > 0
              ? isHindi
                ? 'आज की सभी दवाइयाँ पूरी!'
                : 'All medicines completed!'
              : isHindi
              ? `आज ${todayDoses.length} में से ${completedDoses.length} ली गईं`
              : `${completedDoses.length} of ${todayDoses.length} doses taken`}
          </span>
          <span className="text-base font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
            {todayDoses.length > 0
              ? `${Math.round((completedDoses.length / todayDoses.length) * 100)}%`
              : '100%'}
          </span>
        </div>
      </header>

      <div className="px-5 pt-5 space-y-6 flex-1 max-w-lg mx-auto w-full">
        {/* 1. NEXT MEDICINE AT THE TOP — Calm, clear single focus */}
        {nextDose ? (
          <section
            aria-label={isHindi ? 'अगली दवाई की जानकारी' : 'Next medicine details'}
            className={`p-6 rounded-3xl border-3 shadow-md bg-white transition-all ${
              nextDose.status === 'missed'
                ? 'border-red-400 bg-red-50/50 ring-2 ring-red-200'
                : 'border-emerald-500 ring-2 ring-emerald-100'
            }`}
          >
            {/* Time & Period Badge */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <span
                className={`text-base font-bold px-3 py-1 rounded-xl ${
                  nextDose.status === 'missed'
                    ? 'bg-red-200 text-red-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {nextDose.status === 'missed'
                  ? isHindi ? '⚠ समय बीत गया (Missed)' : '⚠ Missed dose'
                  : isHindi ? 'अगली दवाई' : 'Next Medicine'}
              </span>

              <div className="flex items-center gap-2 text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                <Clock className="w-8 h-8 text-blue-700" aria-hidden="true" />
                <span>{nextDose.time}</span>
              </div>
            </div>

            {/* Pill Visual and Prescription Info */}
            <div className="my-5 flex items-center gap-4">
              <PillVisual
                stripImage={nextDose.stripImage}
                pillAppearance={nextDose.pillAppearance}
                size="lg"
                language={language}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {isHindi ? nextDose.medicineHindiName : nextDose.medicineName}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-lg font-bold text-slate-800">
                  <span className="bg-blue-50 text-blue-900 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {nextDose.dosage}
                  </span>
                  {mealFor(nextDose.medicineId) && (
                    <span className="bg-amber-50 text-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                      <Utensils className="w-4 h-4 text-amber-700" />
                      <span>{mealFor(nextDose.medicineId)}</span>
                    </span>
                  )}
                </div>

                {nextDose.pillAppearance && (
                  <p className="mt-2 text-base font-semibold text-slate-700">
                    {isHindi ? 'पहचान: ' : 'Appearance: '}
                    <span className="text-slate-900 font-bold">
                      {isHindi
                        ? `${nextDose.pillAppearance.colorLabelHi} ${nextDose.pillAppearance.shapeLabelHi}`
                        : `${nextDose.pillAppearance.colorLabelEn} ${nextDose.pillAppearance.shapeLabelEn}`}
                    </span>
                    {nextDose.pillAppearance.imprintText && (
                      <span> ({nextDose.pillAppearance.imprintText})</span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Notes if available from prescription */}
            {getMedicineNotes(nextDose.medicineId) && (
              <div className="mb-5 p-3 rounded-xl bg-slate-100 text-sm font-medium text-slate-700 border border-slate-200">
                💡 {getMedicineNotes(nextDose.medicineId)}
              </div>
            )}

            {/* ONE PRIMARY ACTION: Big prominent Taken Button */}
            <button
              onClick={() => markDoseTaken(nextDose.id, elder.honorific || 'Papa')}
              className="w-full min-h-[84px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-black text-2xl sm:text-3xl flex flex-col items-center justify-center shadow-lg transition-transform"
              aria-label={`${isHindi ? nextDose.medicineHindiName : nextDose.medicineName} – ${
                isHindi ? 'दवाई ले ली' : 'I have taken my medicine'
              }`}
            >
              <span className="flex items-center gap-3">
                <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
                <span>{isHindi ? 'दवाई ले ली' : 'I took my medicine'}</span>
              </span>
              <span className="text-sm font-semibold opacity-90 mt-0.5">
                {isHindi ? 'दवाई खाने के बाद यहाँ दबाएं' : 'Tap here after taking medicine'}
              </span>
            </button>
          </section>
        ) : (
          /* All Done Hero Card */
          <section className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 text-center shadow-sm">
            <div className="text-5xl mb-3" aria-hidden="true">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              {isHindi ? 'आज की सभी दवाइयाँ पूरी!' : 'All medicines taken today!'}
            </h2>
            <p className="text-lg text-slate-800 mt-2 font-medium">
              {isHindi
                ? `बहुत खूब ${elder.honorific || 'पापा'}! आपका परिवार निश्चिंत है।`
                : `Great job ${elder.honorific || 'Papa'}! Your family is notified.`}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-emerald-300 text-base font-bold text-emerald-900 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{isHindi ? 'अगली खुराक कल सुबह होगी' : 'Next dose is tomorrow morning'}</span>
            </div>
          </section>
        )}

        {/* 2. ONE-TAP FAMILY CALL — clear, calm contact button */}
        <button
          onClick={() => setShowCallModal(true)}
          className="w-full min-h-[72px] px-5 rounded-2xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-extrabold text-xl flex items-center justify-between gap-3 shadow-md transition-transform"
        >
          <div className="flex items-center gap-3.5">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt=""
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="text-left">
              <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">
                {isHindi ? 'परिवार से बात करें' : 'Call Family Member'}
              </p>
              <p className="text-xl font-bold leading-tight">
                {contact.name} ({contact.relation})
              </p>
            </div>
          </div>
          <Phone className="w-7 h-7 text-white" aria-hidden="true" />
        </button>

        {/* 3. TODAY'S SCHEDULE — grouped clearly by time of day */}
        <section aria-label={isHindi ? 'आज की पूरी दिनचर्या' : "Today's Full Schedule"}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isHindi ? 'आज की दवाइयाँ' : "Today's Medicines"}
            </h2>
            <span className="text-base font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
              {completedDoses.length} / {todayDoses.length} {isHindi ? 'पूरी' : 'done'}
            </span>
          </div>

          <div className="space-y-6">
            {grouped.map(({ period, items }) => (
              <div key={period} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span aria-hidden="true">{PERIOD_LABELS[period].icon}</span>
                  <span>{isHindi ? PERIOD_LABELS[period].hi : PERIOD_LABELS[period].en}</span>
                </h3>

                <div className="space-y-3">
                  {items.map(dose => {
                    const isTaken = dose.status === 'taken';
                    const isMissed = dose.status === 'missed';
                    const meal = mealFor(dose.medicineId);

                    return (
                      <div
                        key={dose.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          isTaken
                            ? 'bg-emerald-50/60 border-emerald-300'
                            : isMissed
                            ? 'bg-red-50/70 border-red-300'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <PillVisual
                            stripImage={dose.stripImage}
                            pillAppearance={dose.pillAppearance}
                            size="md"
                            language={language}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-bold text-slate-900 truncate">
                              {isHindi ? dose.medicineHindiName : dose.medicineName}
                            </h4>
                            <p className="text-base font-bold text-slate-700 mt-0.5">
                              <span className="text-blue-800">{dose.time}</span> · {dose.dosage}
                            </p>
                            {meal && (
                              <p className="text-sm font-semibold text-amber-900 mt-0.5">
                                {meal}
                              </p>
                            )}
                          </div>
                        </div>

                        {isTaken ? (
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-emerald-200 text-emerald-900">
                            <span className="flex items-center gap-2 text-base font-bold">
                              <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />
                              <span>{isHindi ? 'ले ली गई' : 'Taken'}</span>
                            </span>
                            {dose.takenAt && (
                              <span className="text-sm font-semibold text-emerald-800">
                                {isHindi ? `समय: ${dose.takenAt}` : `at ${dose.takenAt}`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => markDoseTaken(dose.id, elder.honorific || 'Papa')}
                            className={`mt-3 w-full min-h-[56px] rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-white ${
                              isMissed
                                ? 'bg-red-700 hover:bg-red-800'
                                : 'bg-emerald-700 hover:bg-emerald-800'
                            }`}
                            aria-label={`${isHindi ? dose.medicineHindiName : dose.medicineName} – ${
                              isHindi ? 'दवाई ले ली' : 'Taken'
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                            <span>{isHindi ? 'दवाई ले ली' : 'Taken'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Simplified Options Modal for secondary actions */}
      {showOptionsMenu && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="elder-menu-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 id="elder-menu-title" className="text-xl font-extrabold text-slate-900">
                {isHindi ? 'अन्य विकल्प व सेटिंग्स' : 'Options & Settings'}
              </h3>
              <button
                onClick={() => setShowOptionsMenu(false)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                aria-label={isHindi ? 'बंद करें' : 'Close'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {/* Family Connection Status */}
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase">
                    {isHindi ? 'परिवार से जुड़ाव' : 'Family Connection'}
                  </p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {contact.name} ({contact.relation})
                  </p>
                  <p className="text-xs text-slate-600">
                    {elder.sharingPaused
                      ? isHindi ? 'शेयरिंग रुकी है' : 'Sharing is paused'
                      : isHindi ? 'रीयल-टाइम सिंक सक्रिय' : 'Live Sync Active'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowWhoCanSeeModal(true);
                  }}
                  className="px-3 py-1.5 bg-white text-blue-800 rounded-xl border border-blue-300 font-bold text-xs"
                >
                  {isHindi ? 'विवरण' : 'Details'}
                </button>
              </div>

              {/* Optional Test Alarm */}
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  triggerSimulatedReminder();
                }}
                className="w-full p-3.5 bg-amber-50 hover:bg-amber-100 rounded-2xl border border-amber-200 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {isHindi ? 'अलार्म घंटी व आवाज़ टेस्ट करें' : 'Test Reminder Sound & Voice'}
                  </p>
                  <p className="text-xs text-slate-600">
                    {isHindi ? 'जांचें कि आवाज़ पर्याप्त तेज है' : 'Verify sound volume and clarity'}
                  </p>
                </div>
              </button>

              {/* Privacy Notice */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
                <Shield className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  {isHindi
                    ? 'आपका डेटा सुरक्षित है। कोई विज्ञापन नहीं और कोई ट्रैकिंग नहीं।'
                    : 'Safe & private. No ads, no commercial trackers.'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowOptionsMenu(false)}
              className="w-full py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-900 font-extrabold text-lg rounded-2xl mt-2 transition-colors"
            >
              {isHindi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
