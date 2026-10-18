import { DoseEvent, MealRelation } from '../types';

export const MEAL_LABELS: Record<MealRelation, { hi: string; en: string }> = {
  after: { hi: 'खाने के बाद', en: 'After food' },
  before: { hi: 'खाने से पहले', en: 'Before food' },
  with: { hi: 'खाने के साथ', en: 'With food' },
  empty_stomach: { hi: 'खाली पेट', en: 'On an empty stomach' },
};

export type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export const PERIOD_LABELS: Record<DayPeriod, { hi: string; en: string; icon: string }> = {
  morning: { hi: 'सुबह', en: 'Morning', icon: '🌅' },
  afternoon: { hi: 'दोपहर', en: 'Afternoon', icon: '☀️' },
  evening: { hi: 'शाम', en: 'Evening', icon: '🌇' },
  night: { hi: 'रात', en: 'Night', icon: '🌙' },
};

/** "08:00 AM" / "8:30 pm" -> minutes since midnight (24h). Unparseable -> 0. */
export function timeToMinutes(time: string): number {
  const m = /^\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(time || '');
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (m[3] && m[3].toUpperCase() === 'PM') h += 12;
  if (!m[3]) h = parseInt(m[1], 10);
  return h * 60 + parseInt(m[2], 10);
}

export function getDayPeriod(time: string): DayPeriod {
  const hour = Math.floor(timeToMinutes(time) / 60);
  if (hour < 12) return 'morning';
  if (hour < 16) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

export function getMealLabel(rel: MealRelation | undefined, isHindi: boolean): string {
  if (!rel) return '';
  return isHindi ? MEAL_LABELS[rel].hi : MEAL_LABELS[rel].en;
}

/**
 * Builds the spoken reminder from the dose's REAL time, dosage and meal relation
 * (previously hard-coded to "morning / one tablet / after food" for every dose).
 */
export function buildDoseSpeech(
  dose: DoseEvent,
  meal?: MealRelation
): { hi: string; en: string } {
  const period = PERIOD_LABELS[getDayPeriod(dose.time)];
  const visualHi = dose.pillAppearance
    ? `, ${dose.pillAppearance.colorLabelHi} ${dose.pillAppearance.shapeLabelHi}`
    : '';
  const visualEn = dose.pillAppearance
    ? `, ${dose.pillAppearance.colorLabelEn} ${dose.pillAppearance.shapeLabelEn}`
    : '';
  const mealHi = meal ? `, ${MEAL_LABELS[meal].hi}` : '';
  const mealEn = meal ? `, ${MEAL_LABELS[meal].en.toLowerCase()}` : '';

  return {
    hi: `नमस्ते पापा। ${period.hi} की दवाई का समय हो गया है। ${dose.medicineHindiName}${visualHi}, ${dose.dosage}${mealHi}।`,
    en: `Namaste Papa. It is time for your ${period.en.toLowerCase()} medicine. ${dose.medicineName}${visualEn}, ${dose.dosage}${mealEn}.`,
  };
}
