export type Role = 'elder' | 'caregiver' | 'co_caregiver' | 'attendant';

export type Language = 'hi' | 'en';

export type MealRelation = 'after' | 'before' | 'with' | 'empty_stomach';

export type MedicineForm = 'tablet' | 'syrup' | 'injection' | 'drops' | 'capsule';

export interface Medicine {
  id: string;
  name: string;
  hindiName: string;
  dosage: string;
  form: MedicineForm;
  strength: string;
  time: string; // "08:00 AM"
  mealRelation: MealRelation;
  stockDays: number;
  totalStock: number;
  important: boolean;
  stripImage?: string;
  notes?: string;
}

export type DoseStatus = 'taken' | 'pending' | 'missed' | 'snoozed' | 'skipped';

export interface DoseEvent {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineHindiName: string;
  dosage: string;
  time: string;
  date: string; // YYYY-MM-DD
  status: DoseStatus;
  takenAt?: string;
  markedBy?: string; // e.g. "Papa", "Neha (Beti)"
  note?: string;
}

export interface CaregiverAlert {
  id: string;
  type: 'missed_dose' | 'low_stock' | 'dose_confirmed' | 'phone_offline';
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  medicineName?: string;
  status: 'unclaimed' | 'handled' | 'resolved';
  handledBy?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Primary Caregiver' | 'Co-caregiver' | 'Attendant';
  relation: string;
  phone: string;
  avatar: string;
  isAdmin: boolean;
  canEdit: boolean;
}

export interface ElderProfile {
  id: string;
  name: string;
  honorific: string;
  age: number;
  language: Language;
  batteryLevel: number;
  isOnline: boolean;
  lastSeenTime: string;
  sharingPaused: boolean;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
    avatar: string;
  };
  pairingCode: string;
}
