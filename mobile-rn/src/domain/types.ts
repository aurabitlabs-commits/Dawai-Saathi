export type MedicineForm = 'tablet' | 'capsule' | 'syrup' | 'injection' | 'drops' | 'inhaler' | 'other';
export type ScheduleType = 'daily' | 'weekdays' | 'interval';
export type DoseStatus = 'pending' | 'taken' | 'skipped' | 'missed';

export interface Schedule {
  type: ScheduleType;
  /** Monday=bit 0 through Sunday=bit 6; required for weekdays. */
  weekdaysMask?: number;
  /** Required (>=2) for interval schedules. */
  intervalDays?: number;
  /** yyyy-MM-dd local date; required for interval schedules. */
  anchorDate?: string;
  /** Unique sorted minutes after local midnight, 0..1439. */
  timesMinutes: number[];
}
export interface Medicine {
  id: string;
  name: string;
  strength?: string;
  /** User-reviewed prescription directions; not converted into reminder times automatically. */
  frequencyText?: string;
  /** User-reviewed duration text from the prescription, if provided. */
  durationText?: string;
  /** Optional local image URI for user visual reference; not a verified pill identity. */
  photoUri?: string;
  form: MedicineForm;
  doseQuantity: number;
  doseUnit: string;
  instructions?: string;
  colorHex: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  stockCount?: number;
  refillThreshold?: number;
  createdAt: string;
  updatedAt: string;
  schedule: Schedule;
}
export interface DoseLog {
  id: string;
  medicineId: string;
  scheduledAt: string;
  localDate: string;
  status: DoseStatus;
  actedAt?: string;
  snoozeCount: number;
  responseReason?: 'forgot' | 'unavailable' | 'intentionally_skipped';
  snoozeUntil?: string;
  snoozeHistory?: string[];
}
export interface AppSettings {
  language: 'en' | 'hi';
  textScale: 1 | 1.3 | 1.6;
  snoozeMinutes: 5 | 10 | 15;
  followupEnabled: boolean;
  followupMinutes: number;
  missedGraceMinutes: number;
  onboardingDone: boolean;
}
export interface AppData {
  schemaVersion: 1;
  medicines: Medicine[];
  doseLogs: DoseLog[];
  settings: AppSettings;
}
