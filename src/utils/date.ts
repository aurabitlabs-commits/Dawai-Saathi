/**
 * Date utilities for Dawai Saathi
 * Provides dynamic current local dates, Hindi/English localized calendar formats,
 * and multi-day schedule expansion.
 */

export function getTodayDateString(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatScheduleDate(dateStr: string, lang: 'hi' | 'en' = 'hi'): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const todayStr = getTodayDateString();

    const isToday = dateStr === todayStr;

    const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const monthsHi = [
      'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
    ];
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayName = lang === 'hi' ? daysHi[date.getDay()] : daysEn[date.getDay()];
    const monthName = lang === 'hi' ? monthsHi[date.getMonth()] : monthsEn[date.getMonth()];

    if (lang === 'hi') {
      return `${dayName}, ${day} ${monthName} ${year}${isToday ? ' (आज)' : ''}`;
    }
    return `${dayName}, ${day} ${monthName} ${year}${isToday ? ' (Today)' : ''}`;
  } catch (e) {
    return dateStr;
  }
}

export function getWeekDaysStrip(centerDateStr: string = getTodayDateString()) {
  const [year, month, day] = centerDateStr.split('-').map(Number);
  const base = new Date(year, month - 1, day);
  const todayStr = getTodayDateString();

  const days: Array<{
    dayName: string;
    dayNum: string;
    fullDate: string;
    isToday: boolean;
  }> = [];

  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 3 days before, today, 3 days after
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dt}`;

    days.push({
      dayName: shortDays[d.getDay()],
      dayNum: String(d.getDate()),
      fullDate: dateStr,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}
