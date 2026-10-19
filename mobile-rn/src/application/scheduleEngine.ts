import type { Medicine } from '../domain/types';
const dayString = (d: Date) => [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
const localDate = (s: string) => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); };
export function occurrences(m: Medicine, fromLocal: Date, toLocal: Date): Date[] {
  if (!m.isActive || !m.schedule.timesMinutes.length) return [];
  const start = new Date(fromLocal.getFullYear(), fromLocal.getMonth(), fromLocal.getDate());
  const end = new Date(toLocal.getFullYear(), toLocal.getMonth(), toLocal.getDate());
  const medicineStart = localDate(m.startDate); const medicineEnd = m.endDate ? localDate(m.endDate) : undefined;
  const anchor = m.schedule.anchorDate ? localDate(m.schedule.anchorDate) : undefined;
  const times = [...new Set(m.schedule.timesMinutes)].filter(n => Number.isInteger(n) && n >= 0 && n <= 1439).sort((a,b)=>a-b);
  const out: Date[] = [];
  for (const day = new Date(start); day <= end; day.setDate(day.getDate()+1)) {
    if (day < medicineStart || (medicineEnd && day > medicineEnd)) continue;
    let include = m.schedule.type === 'daily';
    if (m.schedule.type === 'weekdays') { const bit = (day.getDay()+6)%7; include = !!((m.schedule.weekdaysMask ?? 0) & (1 << bit)); }
    if (m.schedule.type === 'interval') {
      const interval = m.schedule.intervalDays ?? 0;
      const diff = anchor ? Math.round((new Date(day.getFullYear(),day.getMonth(),day.getDate()).getTime()-anchor.getTime())/86400000) : -1;
      include = !!anchor && interval >= 2 && diff >= 0 && diff % interval === 0;
    }
    if (!include) continue;
    for (const mins of times) { const occurrence = new Date(day.getFullYear(),day.getMonth(),day.getDate(),Math.floor(mins/60),mins%60,0,0); if (occurrence >= fromLocal && occurrence <= toLocal) out.push(occurrence); }
  }
  return out.sort((a,b)=>a.getTime()-b.getTime());
}
export function validateMedicine(m: Medicine): string[] {
 const errors: string[] = [];
 if (!m.name.trim() || m.name.trim().length > 60) errors.push('Medicine name must be between 1 and 60 characters.');
 if (!(m.doseQuantity > 0)) errors.push('Dose quantity must be greater than zero.');
 if (!m.schedule.timesMinutes.length || m.schedule.timesMinutes.length > 8) errors.push('Add between 1 and 8 reminder times.');
 if (m.schedule.type === 'weekdays' && !(m.schedule.weekdaysMask && m.schedule.weekdaysMask > 0 && m.schedule.weekdaysMask < 128)) errors.push('Choose at least one weekday.');
 if (m.schedule.type === 'interval' && (!(m.schedule.intervalDays && m.schedule.intervalDays >= 2) || !m.schedule.anchorDate)) errors.push('An interval of at least 2 days and a start-cycle date are required.');
 if (m.endDate && m.endDate < m.startDate) errors.push('End date cannot be before start date.');
 return errors;
}
