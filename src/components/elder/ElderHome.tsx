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
  const [showSchedule, setShowSchedule] = useState(false);
  const isHindi = language === 'hi';
  const todayDateStr = getTodayDateString();
  const contact = elder.emergencyContact;

  const todayDoses = doses
    .filter(d => d.date === todayDateStr)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  const completedDoses = todayDoses.filter(d => d.status === 'taken');
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
        `नमस्ते ${elder.honorific || 'पापा'}! आज की सभी दवाइयाँ पूरी हो चुकी हैं।`,
        `Namaste ${elder.honorific || 'Papa'}! All scheduled medicines for today are marked as taken.`
      );
    }
  };

  const grouped = PERIOD_ORDER.map(period => ({
    period,
    items: todayDoses.filter(d => getDayPeriod(d.time) === period),
  })).filter(group => group.items.length > 0);

  const primaryButton =
    'w-full min-h-[64px] rounded-xl px-5 py-4 bg-teal-800 hover:bg-teal-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:bg-teal-950 text-white font-bold text-xl flex items-center justify-center gap-3 transition-colors';
  const secondaryButton =
    'w-full min-h-[60px] rounded-xl px-4 py-3 border-2 border-slate-300 bg-white hover:bg-slate-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 text-slate-900 font-bold text-lg flex items-center gap-3';

  return (
    <div className="flex min-h-full flex-col bg-[#F7F9FA] text-slate-950 font-sans">
      <header className="border-b border-slate-200 bg-white px-5 pb-5 pt-5">
        <div className="mx-auto flex w-full max-w-lg items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-700">
              {formatScheduleDate(todayDateStr, language)}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight text-slate-950">
              {isHindi ? `नमस्ते, ${elder.honorific || 'पापा'}` : `Namaste, ${elder.honorific || 'Papa'}`}
            </h1>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={handleSpeakOverview}
              className="flex min-h-[56px] min-w-[56px] items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3 text-slate-900 hover:bg-slate-100"
              aria-label={isHindi ? 'आज की दवाइयाँ सुनें' : 'Listen to today's medicine summary'}
              title={isHindi ? 'सुनें' : 'Listen'}
            >
              <Volume2 className="h-6 w-6" aria-hidden="true" />
              <span className="hidden text-base font-bold sm:inline">{isHindi ? 'सुनें' : 'Listen'}</span>
            </button>
            <button
              onClick={() => setShowOptionsMenu(true)}
              className="flex min-h-[56px] min-w-[56px] items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
              aria-label={isHindi ? 'अन्य विकल्प खोलें' : 'Open more options'}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-4 py-5 sm:px-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-label={isHindi ? 'आज की स्थिति' : "Today's status"}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-700">{isHindi ? 'आज की दवाइयाँ' : "Today's medicines"}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-950">
                {todayDoses.length === 0
                  ? (isHindi ? 'कोई दवाई दर्ज नहीं' : 'No doses listed')
                  : `${completedDoses.length} / ${todayDoses.length} ${isHindi ? 'ली गईं' : 'taken'}`}
              </p>
            </div>
            {allDone ? (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900" aria-label={isHindi ? 'पूरा हुआ' : 'Completed'}>
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </span>
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                <Clock className="h-7 w-7" aria-hidden="true" />
              </span>
            )}
          </div>
          {todayDoses.length > 0 && (
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label={isHindi ? 'आज की दवाइयों की प्रगति' : "Today's doses completed"} aria-valuemin={0} aria-valuemax={todayDoses.length} aria-valuenow={completedDoses.length}>
              <div className="h-full rounded-full bg-teal-800 transition-[width]" style={{ width: `${(completedDoses.length / todayDoses.length) * 100}%` }} />
            </div>
          )}
        </section>

        {nextDose ? (
          <section className="rounded-2xl border-2 border-teal-800 bg-white p-5" aria-labelledby="next-dose-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`rounded-lg px-3 py-2 text-base font-bold ${nextDose.status === 'missed' ? 'bg-red-100 text-red-900' : 'bg-teal-50 text-teal-950'}`}>
                {nextDose.status === 'missed'
                  ? (isHindi ? 'खुराक छूट गई' : 'Missed dose')
                  : (isHindi ? 'अगली दवाई' : 'Next medicine')}
              </p>
              <p className="text-3xl font-extrabold tabular-nums text-slate-950">{nextDose.time}</p>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <PillVisual stripImage={nextDose.stripImage} pillAppearance={nextDose.pillAppearance} size="lg" language={language} />
              <div className="min-w-0 flex-1">
                <h2 id="next-dose-title" className="break-words text-2xl font-extrabold leading-snug text-slate-950">
                  {isHindi ? nextDose.medicineHindiName : nextDose.medicineName}
                </h2>
                <p className="mt-2 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-lg font-bold text-slate-950">
                  {nextDose.dosage}
                </p>
                {mealFor(nextDose.medicineId) && (
                  <p className="mt-2 text-base font-semibold text-slate-800">
                    {isHindi ? 'खाने के संबंध में: ' : 'Food instruction: '}{mealFor(nextDose.medicineId)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => markDoseTaken(nextDose.id, elder.honorific || 'Papa')}
              className={`${primaryButton} mt-5`}
              aria-label={`${isHindi ? nextDose.medicineHindiName : nextDose.medicineName} — ${isHindi ? 'दवाई ले ली' : 'I took this medicine'}`}
            >
              <CheckCircle2 className="h-7 w-7 shrink-0" aria-hidden="true" />
              <span>{isHindi ? 'दवाई ले ली' : 'I took my medicine'}</span>
            </button>
            <p className="mt-3 text-center text-base text-slate-700">
              {isHindi ? 'दवाई लेने के बाद ही बटन दबाएँ।' : 'Tap only after you have taken the medicine.'}
            </p>
            {getMedicineNotes(nextDose.medicineId) && (
              <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer py-1 text-base font-bold text-slate-900">
                  {isHindi ? 'अतिरिक्त निर्देश देखें' : 'View additional instructions'}
                </summary>
                <p className="mt-2 text-base leading-relaxed text-slate-800">{getMedicineNotes(nextDose.medicineId)}</p>
              </details>
            )}
          </section>
        ) : (
          <section className={`rounded-2xl border-2 p-5 ${allDone ? 'border-emerald-700 bg-emerald-50' : 'border-slate-300 bg-white'}`} aria-live="polite">
            <div className="flex items-start gap-3">
              <CheckCircle2 className={`mt-1 h-7 w-7 shrink-0 ${allDone ? 'text-emerald-800' : 'text-slate-600'}`} aria-hidden="true" />
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  {allDone
                    ? (isHindi ? 'आज की सभी दवाइयाँ पूरी!' : 'All medicines marked as taken')
                    : (isHindi ? 'आज की दवाइयों की सूची उपलब्ध नहीं है' : 'No medicines are listed for today')}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-slate-800">
                  {allDone
                    ? (isHindi ? 'बहुत अच्छा! यदि कोई खुराक छूट गई हो, तो परिवार से पुष्टि करें।' : 'Well done. If you think a dose is missing, check with your caregiver.')
                    : (isHindi ? 'कृपया दवाई लेने से पहले अपने परिवार या देखभाल करने वाले से पुष्टि करें।' : 'Please confirm your medicine plan with your family caregiver before taking any medicine.')}
                </p>
              </div>
            </div>
          </section>
        )}

        <button onClick={() => setShowCallModal(true)} className={secondaryButton}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900">
            <Phone className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block">{isHindi ? 'परिवार को फोन करें' : 'Call family'}</span>
            <span className="mt-0.5 block break-words text-base font-medium text-slate-700">{contact.name} · {contact.relation}</span>
          </span>
          <Phone className="h-5 w-5 shrink-0 text-slate-600" aria-hidden="true" />
        </button>

        <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
          <button
            type="button"
            onClick={() => setShowSchedule(value => !value)}
            aria-expanded={showSchedule}
            aria-controls="elder-todays-schedule"
            className="flex min-h-[64px] w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-slate-50"
          >
            <span>
              <span className="block text-lg font-extrabold text-slate-950">{isHindi ? 'आज की पूरी सूची' : "Today's full schedule"}</span>
              <span className="mt-1 block text-base text-slate-700">{isHindi ? 'बाकी दवाइयाँ देखने के लिए दबाएँ' : 'Open to see all scheduled doses'}</span>
            </span>
            <ChevronDown className={`h-6 w-6 shrink-0 text-slate-800 transition-transform ${showSchedule ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {showSchedule && (
            <div id="elder-todays-schedule" className="space-y-4 border-t border-slate-200 p-4">
              {todayDoses.length === 0 ? (
                <p className="text-base leading-relaxed text-slate-800">{isHindi ? 'आज के लिए कोई खुराक दर्ज नहीं है। अपने देखभाल करने वाले से पूछें।' : 'No doses are recorded for today. Please check with your caregiver.'}</p>
              ) : grouped.map(({ period, items }) => (
                <div key={period}>
                  <h3 className="mb-2 text-base font-extrabold text-slate-800">
                    {isHindi ? PERIOD_LABELS[period].hi : PERIOD_LABELS[period].en}
                  </h3>
                  <div className="space-y-3">
                    {items.map(dose => {
                      const isTaken = dose.status === 'taken';
                      const isMissed = dose.status === 'missed';
                      return (
                        <article key={dose.id} className={`rounded-xl border-2 p-3 ${isTaken ? 'border-emerald-700 bg-emerald-50' : isMissed ? 'border-red-700 bg-red-50' : 'border-slate-300 bg-white'}`}>
                          <div className="flex items-start gap-3">
                            <PillVisual stripImage={dose.stripImage} pillAppearance={dose.pillAppearance} size="md" language={language} />
                            <div className="min-w-0 flex-1">
                              <h4 className="break-words text-lg font-bold text-slate-950">{isHindi ? dose.medicineHindiName : dose.medicineName}</h4>
                              <p className="mt-1 text-base font-semibold text-slate-800">{dose.time} · {dose.dosage}</p>
                              {mealFor(dose.medicineId) && <p className="mt-1 text-base text-slate-800">{mealFor(dose.medicineId)}</p>}
                              <p className={`mt-2 text-base font-bold ${isTaken ? 'text-emerald-900' : isMissed ? 'text-red-900' : 'text-slate-800'}`}>
                                {isTaken ? (isHindi ? '✓ दवाई ले ली गई' : '✓ Taken') : isMissed ? (isHindi ? 'समय बीत गया' : 'Missed') : (isHindi ? 'अभी दर्ज नहीं' : 'Not yet recorded')}
                              </p>
                            </div>
                          </div>
                          {!isTaken && (
                            <button onClick={() => markDoseTaken(dose.id, elder.honorific || 'Papa')} className={`${primaryButton} mt-3 min-h-[56px] text-lg `}>
                              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                              {isHindi ? 'दवाई ले ली' : 'I took this medicine'}
                            </button>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showOptionsMenu && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="elder-menu-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 sm:items-center sm:p-4"
          onClick={event => {
            if (event.target === event.currentTarget) setShowOptionsMenu(false);
          }}
        >
          <div className="w-full max-w-lg rounded-t-2xl border border-slate-300 bg-white p-5 shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <h2 id="elder-menu-title" className="text-xl font-extrabold text-slate-950">
                {isHindi ? 'अन्य विकल्प' : 'More options'}
              </h2>
              <button onClick={() => setShowOptionsMenu(false)} className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-slate-300 text-slate-900 hover:bg-slate-100" aria-label={isHindi ? 'बंद करें' : 'Close'}>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-3 py-4">
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                <p className="text-base font-bold text-slate-900">{isHindi ? 'परिवार से जुड़ाव' : 'Family connection'}</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{contact.name} ({contact.relation})</p>
                <p className="mt-1 text-base text-slate-700">
                  {elder.sharingPaused
                    ? (isHindi ? 'शेयरिंग रुकी हुई है' : 'Sharing is paused')
                    : (isHindi ? 'सिंक सक्रिय' : 'Sync active')}
                </p>
                <button
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowWhoCanSeeModal(true);
                  }}
                  className="mt-3 min-h-[52px] w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-950 hover:bg-slate-100"
                >
                  {isHindi ? 'कौन देख सकता है?' : 'Who can see my information?'}
                </button>
              </div>
              <button
                onClick={() => {
                  setShowOptionsMenu(false);
                  triggerSimulatedReminder();
                }}
                className="flex min-h-[64px] w-full items-center gap-3 rounded-xl border-2 border-slate-300 bg-white p-4 text-left hover:bg-slate-50"
              >
                <Bell className="h-6 w-6 shrink-0 text-slate-800" aria-hidden="true" />
                <span className="text-lg font-bold text-slate-950">{isHindi ? 'रिमाइंडर की आवाज़ जाँचें' : 'Test reminder sound'}</span>
              </button>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-base text-slate-800">
                <Shield className="mt-0.5 h-6 w-6 shrink-0 text-teal-900" aria-hidden="true" />
                <p>{isHindi ? 'अपनी दवाई के बारे में संदेह हो तो परिवार या स्वास्थ्यकर्मी से पुष्टि करें।' : 'If you are unsure about a medicine or dose, confirm with your caregiver or healthcare professional.'}</p>
              </div>
            </div>
            <button onClick={() => setShowOptionsMenu(false)} className="min-h-[60px] w-full rounded-xl bg-slate-900 px-4 py-3 text-lg font-bold text-white hover:bg-slate-800">
              {isHindi ? 'बंद करें' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
