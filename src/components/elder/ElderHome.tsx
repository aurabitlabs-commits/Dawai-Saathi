import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import { Bell, CheckCircle2, Clock, Phone, Volume2, Shield } from 'lucide-react';
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

  const isHindi = language === 'hi';
  const todayDateStr = getTodayDateString();
  const contact = elder.emergencyContact;

  // Today's doses only, in clock order
  const todayDoses = doses
    .filter(d => d.date === todayDateStr)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  const completedDoses = todayDoses.filter(d => d.status === 'taken');

  // Next dose: prioritize missed or pending/snoozed (no fallback to doses[0] if all done)
  const nextDose =
    todayDoses.find(d => d.status === 'missed') ??
    todayDoses.find(d => d.status === 'pending' || d.status === 'snoozed');

  const mealFor = (medicineId: string) =>
    getMealLabel(medicines.find(m => m.id === medicineId)?.mealRelation, isHindi);

  const handleSpeakOverview = () => {
    soundService.playBellChime();
    if (nextDose) {
      speakPrompt(
        `नमस्ते पापा। आज आपकी ${completedDoses.length} दवाइयाँ ली जा चुकी हैं। अगली दवाई ${nextDose.time} पर ${nextDose.medicineHindiName} है।`,
        `Namaste Papa. You have taken ${completedDoses.length} medicines today. Your next medicine is ${nextDose.medicineName} at ${nextDose.time}.`
      );
    } else {
      speakPrompt(
        'नमस्ते पापा! आज की सभी दवाइयाँ पूरी हो चुकी हैं। बहुत बढ़िया!',
        'Namaste Papa! All medicines for today have been taken. Great job!'
      );
    }
  };

  // Group the day's doses by morning / afternoon / evening / night
  const grouped = PERIOD_ORDER.map(period => ({
    period,
    items: todayDoses.filter(d => getDayPeriod(d.time) === period),
  })).filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col min-h-full pb-8 bg-white">
      {/* Header: date, greeting, big "listen" button */}
      <div className="bg-amber-50 px-5 pt-5 pb-5 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-slate-800">
            {formatScheduleDate(todayDateStr, language)}
          </p>
          <button
            onClick={handleSpeakOverview}
            className="min-w-[56px] min-h-[56px] flex items-center justify-center bg-amber-200 hover:bg-amber-300 rounded-full text-slate-900 active:scale-95 transition-transform"
            aria-label={isHindi ? 'बोलकर बताएं' : 'Speak overview'}
          >
            <Volume2 className="w-7 h-7" aria-hidden="true" />
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          {isHindi ? 'नमस्ते पापा' : 'Namaste Papa'} <span aria-hidden="true">☀️</span>
        </h1>
        <p className="text-xl font-semibold text-slate-700 mt-1">
          {completedDoses.length === todayDoses.length && todayDoses.length > 0
            ? isHindi
              ? 'आज की सभी दवाइयाँ पूरी हो चुकी हैं।'
              : 'All medicines taken for today.'
            : isHindi
            ? `आज ${todayDoses.length} में से ${completedDoses.length} खुराक ली गईं`
            : `${completedDoses.length} of ${todayDoses.length} doses taken today`}
        </p>
      </div>

      <div className="px-5 pt-5 space-y-6 flex-1">
        {/* NEXT DOSE — one clear focus */}
        {nextDose ? (
          <section
            aria-label={isHindi ? 'अगली दवाई' : 'Next medicine'}
            className={`p-5 rounded-3xl border-2 ${
              nextDose.status === 'missed'
                ? 'bg-red-50 border-red-400'
                : 'bg-emerald-50 border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-lg font-bold px-3 py-1 rounded-full ${
                  nextDose.status === 'missed'
                    ? 'bg-red-200 text-red-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {nextDose.status === 'missed'
                  ? isHindi ? '⚠ दवाई छूट गई' : '⚠ Missed dose'
                  : isHindi ? 'अगली दवाई' : 'Next medicine'}
              </span>
              <div className="flex items-center gap-1.5 text-3xl font-extrabold text-slate-900">
                <Clock className="w-7 h-7 text-slate-700" aria-hidden="true" />
                <span>{nextDose.time}</span>
              </div>
            </div>

            <div className="my-5 flex items-center gap-4">
              <PillVisual
                stripImage={nextDose.stripImage}
                pillAppearance={nextDose.pillAppearance}
                size="lg"
                language={language}
              />
              <div className="flex-1">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {isHindi ? nextDose.medicineHindiName : nextDose.medicineName}
                </h2>
                <p className="text-lg font-semibold text-slate-800 mt-0.5">
                  {nextDose.dosage}
                  {mealFor(nextDose.medicineId) && ` · ${mealFor(nextDose.medicineId)}`}
                </p>
                {nextDose.pillAppearance && (
                  <p className="mt-1 text-base font-semibold text-slate-800">
                    {isHindi ? 'पहचान: ' : 'Looks like: '}
                    {isHindi
                      ? `${nextDose.pillAppearance.colorLabelHi} ${nextDose.pillAppearance.shapeLabelHi}`
                      : `${nextDose.pillAppearance.colorLabelEn} ${nextDose.pillAppearance.shapeLabelEn}`}
                    {nextDose.pillAppearance.imprintText && ` (${nextDose.pillAppearance.imprintText})`}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => markDoseTaken(nextDose.id, 'Papa')}
              className="w-full min-h-[80px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold text-2xl flex items-center justify-center gap-3 transition-transform"
            >
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
              <span>{isHindi ? 'दवाई ले ली' : 'I took it'}</span>
            </button>

            <button
              onClick={() => triggerSimulatedReminder(nextDose.id)}
              className="mt-3 w-full py-3 text-base font-bold text-slate-800 bg-white rounded-xl border border-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-amber-700" aria-hidden="true" />
              <span>{isHindi ? 'अलार्म और आवाज़ टेस्ट करें' : 'Test alarm & voice reminder'}</span>
            </button>
          </section>
        ) : (
          <section className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 text-center">
            <div className="text-5xl mb-2" aria-hidden="true">🎉</div>
            <h2 className="text-2xl font-extrabold text-emerald-900">
              {isHindi ? 'आज की सभी दवाइयाँ पूरी!' : 'All medicines taken today!'}
            </h2>
            <p className="text-lg text-slate-800 mt-2">
              {isHindi ? 'बहुत खूब पापा! परिवार निश्चिंत है।' : 'Well done Papa! Your family can relax.'}
            </p>
          </section>
        )}

        {/* One-tap family call, personal: photo + name */}
        <button
          onClick={() => setShowCallModal(true)}
          className="w-full min-h-[80px] px-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
        >
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <Phone className="w-7 h-7" aria-hidden="true" />
          )}
          <span>{isHindi ? `${contact.name} को कॉल करें` : `Call ${contact.name}`}</span>
        </button>

        {/* TODAY'S SCHEDULE — grouped by time of day, one large button per dose */}
        <section aria-label={isHindi ? 'आज की दवाइयाँ' : "Today's medicines"}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isHindi ? 'आज की दवाइयाँ' : "Today's medicines"}
            </h2>
            <span className="text-lg font-bold text-slate-900 bg-slate-200 px-3 py-1 rounded-full">
              {completedDoses.length} / {todayDoses.length}
            </span>
          </div>

          <div className="space-y-6">
            {grouped.map(({ period, items }) => (
              <div key={period}>
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span aria-hidden="true">{PERIOD_LABELS[period].icon}</span>
                  {isHindi ? PERIOD_LABELS[period].hi : PERIOD_LABELS[period].en}
                </h3>

                <div className="space-y-3">
                  {items.map(dose => {
                    const isTaken = dose.status === 'taken';
                    const isMissed = dose.status === 'missed';
                    const meal = mealFor(dose.medicineId);

                    return (
                      <div
                        key={dose.id}
                        className={`p-4 rounded-2xl border-2 ${
                          isTaken
                            ? 'bg-emerald-50 border-emerald-300'
                            : isMissed
                            ? 'bg-red-50 border-red-400'
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
                            <h4 className="text-xl font-bold text-slate-900">
                              {isHindi ? dose.medicineHindiName : dose.medicineName}
                            </h4>
                            <p className="text-lg font-semibold text-slate-800">
                              {dose.time} · {dose.dosage}
                            </p>
                            {meal && <p className="text-base text-slate-700">{meal}</p>}
                          </div>
                        </div>

                        {isTaken ? (
                          <p className="mt-3 flex items-center gap-2 text-lg font-bold text-emerald-900">
                            <CheckCircle2 className="w-7 h-7 text-emerald-700" aria-hidden="true" />
                            {isHindi
                              ? `ले ली${dose.takenAt ? ` · ${dose.takenAt}` : ''}`
                              : `Taken${dose.takenAt ? ` at ${dose.takenAt}` : ''}`}
                          </p>
                        ) : (
                          <button
                            onClick={() => markDoseTaken(dose.id, 'Papa')}
                            className={`mt-3 w-full min-h-[60px] rounded-xl font-extrabold text-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-white ${
                              isMissed
                                ? 'bg-red-700 hover:bg-red-800'
                                : 'bg-emerald-700 hover:bg-emerald-800'
                            }`}
                            aria-label={`${isHindi ? dose.medicineHindiName : dose.medicineName} – ${
                              isHindi ? 'ले ली' : 'mark as taken'
                            }`}
                          >
                            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                            {isHindi ? 'ले ली' : 'Taken'}
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

        {/* Quiet footer: sharing status lives here */}
        <div className="pt-2 pb-2 text-center text-base text-slate-700">
          <p>
            {elder.sharingPaused
              ? isHindi ? 'परिवार के साथ शेयरिंग रुकी है' : 'Sharing with family is paused'
              : isHindi ? `${contact.name} से जुड़े हैं` : `Connected with ${contact.name}`}
            {' · '}
            <button
              onClick={() => setShowWhoCanSeeModal(true)}
              className="font-semibold text-blue-800 underline min-h-[44px]"
            >
              {isHindi ? 'विवरण देखें' : 'Details'}
            </button>
          </p>
          <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>{isHindi ? 'आपका डेटा सुरक्षित है · कोई विज्ञापन नहीं' : 'Safe & Private · No Ads'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
