import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { formatScheduleDate, getTodayDateString } from '../../utils/date';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import type { DoseEvent } from '../../types';

type DayStatus = 'complete' | 'partial' | 'missed' | 'pending' | 'empty';

const monthLabel = (date: Date, language: 'hi' | 'en') =>
  date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    month: 'long',
    year: 'numeric',
  });

const localDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getDayStatus = (events: DoseEvent[]): DayStatus => {
  if (!events.length) return 'empty';
  const taken = events.filter(event => event.status === 'taken').length;
  const decided = events.filter(event =>
    event.status === 'taken' || event.status === 'missed' || event.status === 'skipped'
  ).length;
  if (taken === events.length) return 'complete';
  if (decided === events.length && taken === 0) return 'missed';
  if (taken > 0) return 'partial';
  return 'pending';
};

export const CaregiverHistory: React.FC = () => {
  const { language, elder, doses } = useApp();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const isHindi = language === 'hi';
  const todayKey = getTodayDateString();

  const monthDays = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const numberOfDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const leadingBlanks = firstDay.getDay();
    return [
      ...Array.from({ length: leadingBlanks }, (_, index) => ({ key: `blank-${index}`, day: null as number | null })),
      ...Array.from({ length: numberOfDays }, (_, index) => ({ key: `day-${index + 1}`, day: index + 1 })),
    ];
  }, [month]);

  const monthEvents = useMemo(
    () => doses.filter(dose => dose.date.startsWith(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-`)),
    [doses, month],
  );

  const stats = useMemo(() => {
    const taken = monthEvents.filter(dose => dose.status === 'taken').length;
    const missed = monthEvents.filter(dose => dose.status === 'missed').length;
    const skipped = monthEvents.filter(dose => dose.status === 'skipped').length;
    const decided = taken + missed + skipped;
    return { taken, missed, skipped, decided, adherence: decided ? Math.round((taken / decided) * 100) : null };
  }, [monthEvents]);

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, DoseEvent[]>();
    for (const event of monthEvents) {
      const current = grouped.get(event.date) || [];
      current.push(event);
      grouped.set(event.date, current);
    }
    return grouped;
  }, [monthEvents]);

  const selectedDayEvents = useMemo(() => {
    const todayEvents = doses.filter(dose => dose.date === todayKey);
    return todayEvents.sort((a, b) => a.time.localeCompare(b.time));
  }, [doses, todayKey]);

  const handleShareReport = async () => {
    const reportLines = [
      isHindi ? 'दवाई साथी — दवा इतिहास रिपोर्ट' : 'Dawai Saathi — Medication History Report',
      `${isHindi ? 'मरीज़' : 'Patient'}: ${elder.name}`,
      `${isHindi ? 'अवधि' : 'Period'}: ${monthLabel(month, language)}`,
      `${isHindi ? 'ली गई खुराकें' : 'Taken doses'}: ${stats.taken}`,
      `${isHindi ? 'छूटी खुराकें' : 'Missed doses'}: ${stats.missed}`,
      `${isHindi ? 'स्किप की गई खुराकें' : 'Skipped doses'}: ${stats.skipped}`,
      `${isHindi ? 'अनुपालन' : 'Adherence'}: ${stats.adherence === null ? (isHindi ? 'पर्याप्त डेटा नहीं' : 'Insufficient data') : `${stats.adherence}%`}`,
      '',
      isHindi ? 'यह रिपोर्ट ऐप में दर्ज खुराकों पर आधारित है। यह डॉक्टर की सलाह का विकल्प नहीं है।' : 'This report reflects dose events recorded in the app and is not a substitute for medical advice.',
    ];
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard is unavailable');
      await navigator.clipboard.writeText(reportLines.join('\n'));
      soundService.playSuccessChime();
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  const dayNames = isHindi ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex min-h-full flex-col pb-20">
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'दवाइयों का इतिहास व रिपोर्ट' : 'Medicine History & Reports'}
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {isHindi ? 'केवल ऐप में दर्ज खुराकों का रिकॉर्ड' : 'Based only on dose records saved in this app'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleShareReport}
            className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'रिपोर्ट कॉपी करें' : 'Copy report')}</span>
          </button>
        </div>
        {copyError && <p role="alert" className="mt-2 text-xs text-red-700">{isHindi ? 'कॉपी नहीं हो सका। ब्राउज़र अनुमति जाँचें।' : 'Could not copy. Check browser permissions and try again.'}</p>}
      </div>

      <div className="space-y-5 p-5">
        <section aria-labelledby="adherence-heading" className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white shadow-sm">
          <div>
            <h2 id="adherence-heading" className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
              {isHindi ? 'मासिक अनुपालन' : 'Monthly adherence'}
            </h2>
            <div className="mt-1 text-3xl font-black tabular-nums">
              {stats.adherence === null ? '—' : `${stats.adherence}%`}
            </div>
            <p className="mt-1 text-xs text-emerald-100">
              {isHindi ? `${stats.taken} ली गईं · ${stats.missed} छूटीं · ${stats.skipped} स्किप` : `${stats.taken} taken · ${stats.missed} missed · ${stats.skipped} skipped`}
            </p>
            <p className="mt-1 text-[11px] text-emerald-100">
              {isHindi ? 'लंबित खुराकें प्रतिशत में शामिल नहीं हैं।' : 'Pending doses are excluded from the percentage.'}
            </p>
          </div>
          <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl">✓</div>
        </section>

        <section aria-label={isHindi ? 'मासिक कैलेंडर' : 'Monthly calendar'} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <button type="button" aria-label={isHindi ? 'पिछला महीना' : 'Previous month'} onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="min-h-11 min-w-11 rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
              <ChevronLeft className="mx-auto h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900">{monthLabel(month, language)}</h2>
            <button type="button" aria-label={isHindi ? 'अगला महीना' : 'Next month'} onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="min-h-11 min-w-11 rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
              <ChevronRight className="mx-auto h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500">
            {dayNames.map((name, index) => <span key={`${name}-${index}`}>{name}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {monthDays.map(item => {
              if (item.day === null) return <div key={item.key} aria-hidden="true" className="h-10" />;
              const date = new Date(month.getFullYear(), month.getMonth(), item.day);
              const dateKey = localDateKey(date);
              const dayEvents = eventsByDate.get(dateKey) || [];
              const status = getDayStatus(dayEvents);
              const isToday = dateKey === todayKey;
              const color = status === 'complete'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : status === 'partial'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : status === 'missed'
                    ? 'border-red-200 bg-red-50 text-red-900'
                    : status === 'pending'
                      ? 'border-slate-200 bg-slate-50 text-slate-600'
                      : 'border-transparent bg-white text-slate-400';
              return (
                <div key={item.key} title={dayEvents.length ? `${dayEvents.length} ${isHindi ? 'खुराकें दर्ज' : 'dose records'}` : (isHindi ? 'कोई रिकॉर्ड नहीं' : 'No records')} className={`flex h-10 flex-col items-center justify-center rounded-lg border text-xs font-bold ${color} ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>
                  <span>{item.day}</span>
                  {dayEvents.length > 0 && <span className="text-[9px] font-medium">{dayEvents.filter(event => event.status === 'taken').length}/{dayEvents.length}</span>}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 pt-1 text-[11px] text-slate-600">
            <span>🟢 {isHindi ? 'सभी ली गईं' : 'All taken'}</span>
            <span>🟡 {isHindi ? 'कुछ ली गईं' : 'Partial'}</span>
            <span>🔴 {isHindi ? 'कोई नहीं ली गई' : 'None taken'}</span>
            <span>⚪ {isHindi ? 'कोई रिकॉर्ड नहीं' : 'No records'}</span>
          </div>
          <p className="text-center text-[11px] text-slate-500">{isHindi ? 'रिकॉर्ड न होने का अर्थ यह नहीं है कि दवा छूट गई।' : 'No record does not mean a dose was missed.'}</p>
        </section>

        <section aria-labelledby="daily-log-heading" className="space-y-3">
          <h2 id="daily-log-heading" className="text-sm font-bold uppercase tracking-wide text-slate-700">
            {isHindi ? 'आज का दैनिक रिकॉर्ड' : "Today's dose log"}
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs font-bold text-slate-900">
              <span>{formatScheduleDate(todayKey, language)}</span>
              <span className="text-slate-500">{selectedDayEvents.length} {isHindi ? 'रिकॉर्ड' : 'records'}</span>
            </div>
            {selectedDayEvents.length === 0 ? (
              <p className="py-3 text-sm text-slate-500">{isHindi ? 'आज के लिए कोई खुराक रिकॉर्ड नहीं है। यह अपने आप में छूटी हुई खुराक का प्रमाण नहीं है।' : 'No dose records are saved for today. This alone does not indicate a missed dose.'}</p>
            ) : (
              <ul className="space-y-3">
                {selectedDayEvents.map(event => {
                  const statusLabel = event.status === 'taken'
                    ? (isHindi ? 'ली गई' : 'Taken')
                    : event.status === 'missed'
                      ? (isHindi ? 'छूटी' : 'Missed')
                      : event.status === 'skipped'
                        ? (isHindi ? 'स्किप' : 'Skipped')
                        : event.status === 'snoozed'
                          ? (isHindi ? 'स्नूज़' : 'Snoozed')
                          : (isHindi ? 'लंबित' : 'Pending');
                  const statusClass = event.status === 'taken'
                    ? 'bg-emerald-50 text-emerald-800'
                    : event.status === 'missed'
                      ? 'bg-red-50 text-red-800'
                      : event.status === 'skipped'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-50 text-amber-800';
                  return (
                    <li key={event.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{event.time} · {isHindi ? event.medicineHindiName : event.medicineName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{event.dosage}{event.takenAt ? ` · ${isHindi ? 'ली गई' : 'Taken at'} ${event.takenAt}` : ''}</p>
                      </div>
                      <span className={`shrink-0 rounded px-2 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
