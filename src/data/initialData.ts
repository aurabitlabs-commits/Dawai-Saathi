import { CaregiverAlert, DoseEvent, ElderProfile, FamilyMember, Medicine } from '../types';
import { getTodayDateString } from '../utils/date';

export const INITIAL_ELDER: ElderProfile = {
  id: 'elder-1',
  name: 'Ramakant Sharma',
  honorific: 'Dadaji / पापा',
  age: 68,
  language: 'hi',
  batteryLevel: 84,
  isOnline: true,
  lastSeenTime: 'अभी (Active now)',
  sharingPaused: false,
  emergencyContact: {
    name: 'Neha (बेटी)',
    relation: 'Daughter / Primary Caregiver',
    phone: '+91 98765 43210',
<<<<<<< HEAD
    avatar: '/images/caregiver_neha_avatar_1792322619528.jpg',
=======
    avatar: '/src/assets/images/caregiver_neha_avatar_1792322619528.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
  },
  pairingCode: '849 201',
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Amlodipine 5mg',
    hindiName: 'एम्लोडिपिन 5mg (बी.पी.)',
    dosage: '1 Tablet',
    form: 'tablet',
    strength: '5mg',
    time: '08:00 AM',
    mealRelation: 'after',
    stockDays: 2,
    totalStock: 2,
    important: true,
<<<<<<< HEAD
    stripImage: '/images/medicine_pill_white_round_1792323535639.jpg',
=======
    stripImage: '/src/assets/images/medicine_pill_white_round_1792323535639.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    pillAppearance: {
      shape: 'round',
      primaryColor: '#ffffff',
      colorLabelHi: 'सफेद',
      colorLabelEn: 'White',
      shapeLabelHi: 'छोटी गोल गोली (स्कोर लाइन)',
      shapeLabelEn: 'Small Round Tablet (Scored)',
      imprintText: '5',
    },
    notes: 'Khaane ke baad (After breakfast) - Blood Pressure',
  },
  {
    id: 'med-2',
    name: 'Metformin 500mg',
    hindiName: 'मेटफॉर्मिन 500mg (शुगर)',
    dosage: '1 Tablet',
    form: 'tablet',
    strength: '500mg',
    time: '09:00 AM',
    mealRelation: 'after',
    stockDays: 12,
    totalStock: 12,
    important: true,
<<<<<<< HEAD
    stripImage: '/images/medicine_strip_sample_1792322618845.jpg',
=======
    stripImage: '/src/assets/images/medicine_strip_sample_1792322618845.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    pillAppearance: {
      shape: 'oval',
      primaryColor: '#f8fafc',
      colorLabelHi: 'सफेद',
      colorLabelEn: 'White',
      shapeLabelHi: 'लंबी अंडाकार गोली',
      shapeLabelEn: 'Oblong Tablet',
      imprintText: '500',
    },
    notes: 'Naashte ke 15 min baad (Diabetes)',
  },
  {
    id: 'med-3',
    name: 'Vitamin D3 60k',
    hindiName: 'विटामिन D3 (हड्डियों के लिए)',
    dosage: '1 Capsule',
    form: 'capsule',
    strength: '60000 IU',
    time: '01:00 PM',
    mealRelation: 'after',
    stockDays: 25,
    totalStock: 25,
    important: false,
<<<<<<< HEAD
    stripImage: '/images/medicine_pill_capsule_gold_1792323535542.jpg',
=======
    stripImage: '/src/assets/images/medicine_pill_capsule_gold_1792323535542.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    pillAppearance: {
      shape: 'capsule',
      primaryColor: '#f59e0b',
      colorLabelHi: 'सुनहरा पारदर्शी',
      colorLabelEn: 'Golden Amber',
      shapeLabelHi: 'मुलायम कैप्सूल (सॉफ्टजेल)',
      shapeLabelEn: 'Softgel Capsule',
    },
    notes: 'Dopehar ke khaane ke baad (With glass of milk or water)',
  },
  {
    id: 'med-4',
    name: 'Atorvastatin 10mg',
    hindiName: 'एटोरवास्टेटिन 10mg (कोलेस्ट्रॉल)',
    dosage: '1 Tablet',
    form: 'tablet',
    strength: '10mg',
    time: '08:00 PM',
    mealRelation: 'after',
    stockDays: 18,
    totalStock: 18,
    important: true,
    pillAppearance: {
      shape: 'oval',
      primaryColor: '#fed7aa',
      colorLabelHi: 'हल्का पीच / बादामी',
      colorLabelEn: 'Light Peach',
      shapeLabelHi: 'अंडाकार गोली',
      shapeLabelEn: 'Oval Tablet',
      imprintText: '10',
    },
    notes: 'Raat ke khaane ke baad (Cholesterol)',
  },
];

const today = getTodayDateString();
const yesterday = getTodayDateString(-1);

export const INITIAL_DOSES: DoseEvent[] = [
  // Today's doses
  {
    id: `dose-today-1`,
    medicineId: 'med-1',
    medicineName: 'Amlodipine 5mg',
    medicineHindiName: 'एम्लोडिपिन 5mg',
    dosage: '1 Tablet',
    time: '08:00 AM',
    date: today,
    status: 'taken',
    takenAt: '08:12 AM',
    markedBy: 'Papa',
<<<<<<< HEAD
    stripImage: '/images/medicine_pill_white_round_1792323535639.jpg',
=======
    stripImage: '/src/assets/images/medicine_pill_white_round_1792323535639.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    pillAppearance: {
      shape: 'round',
      primaryColor: '#ffffff',
      colorLabelHi: 'सफेद',
      colorLabelEn: 'White',
      shapeLabelHi: 'छोटी गोल गोली (स्कोर लाइन)',
      shapeLabelEn: 'Small Round Tablet (Scored)',
      imprintText: '5',
    },
    note: 'Dadaji ne samay par le li',
    auditHistory: [
      { timestamp: '08:12 AM', action: 'confirmed_taken', actor: 'Papa', details: 'Dose taken on elder device' },
    ],
  },
  {
    id: `dose-today-2`,
    medicineId: 'med-2',
    medicineName: 'Metformin 500mg',
    medicineHindiName: 'मेटफॉर्मिन 500mg',
    dosage: '1 Tablet',
    time: '09:00 AM',
    date: today,
    status: 'missed',
<<<<<<< HEAD
    stripImage: '/images/medicine_strip_sample_1792322618845.jpg',
=======
    stripImage: '/src/assets/images/medicine_strip_sample_1792322618845.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    pillAppearance: {
      shape: 'oval',
      primaryColor: '#f8fafc',
      colorLabelHi: 'सफेद',
      colorLabelEn: 'White',
      shapeLabelHi: 'लंबी अंडाकार गोली',
      shapeLabelEn: 'Oblong Tablet',
      imprintText: '500',
    },
    note: 'Grace period ended, alert sent to family',
    auditHistory: [
      { timestamp: '09:30 AM', action: 'missed', actor: 'System', details: 'No response after 30m grace period' },
    ],
  },
  {
    id: `dose-today-3`,
    medicineId: 'med-3',
    medicineName: 'Vitamin D3 60k',
    medicineHindiName: 'विटामिन D3',
    dosage: '1 Capsule',
    time: '01:00 PM',
    date: today,
    status: 'pending',
<<<<<<< HEAD
    stripImage: '/images/medicine_pill_capsule_gold_1792323535542.jpg',
=======
    stripImage: '/src/assets/images/medicine_pill_capsule_gold_1792323535542.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    pillAppearance: {
      shape: 'capsule',
      primaryColor: '#f59e0b',
      colorLabelHi: 'सुनहरा पारदर्शी',
      colorLabelEn: 'Golden Amber',
      shapeLabelHi: 'मुलायम कैप्सूल (सॉफ्टजेल)',
      shapeLabelEn: 'Softgel Capsule',
    },
  },
  {
    id: `dose-today-4`,
    medicineId: 'med-4',
    medicineName: 'Atorvastatin 10mg',
    medicineHindiName: 'एटोरवास्टेटिन 10mg',
    dosage: '1 Tablet',
    time: '08:00 PM',
    date: today,
    status: 'pending',
    pillAppearance: {
      shape: 'oval',
      primaryColor: '#fed7aa',
      colorLabelHi: 'हल्का पीच / बादामी',
      colorLabelEn: 'Light Peach',
      shapeLabelHi: 'अंडाकार गोली',
      shapeLabelEn: 'Oval Tablet',
      imprintText: '10',
    },
  },
  // Yesterday's historical doses
  {
    id: `dose-yest-1`,
    medicineId: 'med-1',
    medicineName: 'Amlodipine 5mg',
    medicineHindiName: 'एम्लोडिपिन 5mg',
    dosage: '1 Tablet',
    time: '08:00 AM',
    date: yesterday,
    status: 'taken',
    takenAt: '08:05 AM',
    markedBy: 'Papa',
  },
  {
    id: `dose-yest-2`,
    medicineId: 'med-2',
    medicineName: 'Metformin 500mg',
    medicineHindiName: 'मेटफॉर्मिन 500mg',
    dosage: '1 Tablet',
    time: '09:00 AM',
    date: yesterday,
    status: 'taken',
    takenAt: '09:15 AM',
    markedBy: 'Papa',
  },
  {
    id: `dose-yest-3`,
    medicineId: 'med-3',
    medicineName: 'Vitamin D3 60k',
    medicineHindiName: 'विटामिन D3',
    dosage: '1 Capsule',
    time: '01:00 PM',
    date: yesterday,
    status: 'taken',
    takenAt: '01:20 PM',
    markedBy: 'Papa',
  },
];

export const INITIAL_ALERTS: CaregiverAlert[] = [
  {
    id: 'alert-1',
    type: 'missed_dose',
    title: 'Missed Dose Alert',
    titleHi: 'दवा छूटने का अलर्ट',
    message: 'Papa ne 9:00 AM ki dawai nahi li (Metformin 500mg).',
    messageHi: 'पापा ने सुबह 9:00 बजे की मेटफॉर्मिन नहीं ली है।',
    timestamp: '18 Oct 2026, 09:45 AM',
    medicineName: 'Metformin 500mg',
    status: 'unclaimed',
  },
  {
    id: 'alert-2',
    type: 'low_stock',
    title: 'Refill Reminder',
    titleHi: 'दवा खत्म होने वाली है',
    message: 'Amlodipine ka stock kam hai. 2 din ka bacha hai.',
    messageHi: 'एम्लोडिपिन का स्टॉक कम है। केवल 2 दिन की दवा बची है।',
    timestamp: '18 Oct 2026, 07:30 AM',
    medicineName: 'Amlodipine 5mg',
    status: 'unclaimed',
  },
  {
    id: 'alert-3',
    type: 'dose_confirmed',
    title: 'Dose Confirmed',
    titleHi: 'दवाई ले ली गई',
    message: 'Morning dose taken by Papa (Amlodipine 5mg).',
    messageHi: 'पापा ने सुबह की बीपी की दवा 8:12 AM पर ले ली।',
    timestamp: '18 Oct 2026, 08:12 AM',
    medicineName: 'Amlodipine 5mg',
    status: 'resolved',
  },
];

export const INITIAL_FAMILY: FamilyMember[] = [
  {
    id: 'fam-1',
    name: 'Neha',
    role: 'Primary Caregiver',
    relation: 'Beti (बेटी) · Admin',
    phone: '+91 98765 43210',
<<<<<<< HEAD
    avatar: '/images/caregiver_neha_avatar_1792322619528.jpg',
=======
    avatar: '/src/assets/images/caregiver_neha_avatar_1792322619528.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    isAdmin: true,
    canEdit: true,
  },
  {
    id: 'fam-2',
    name: 'Mummyji (Savitri)',
    role: 'Co-caregiver',
    relation: 'Patni (पत्नी) · Can view & mark',
    phone: '+91 87654 32109',
    avatar: '',
    isAdmin: false,
    canEdit: true,
  },
  {
    id: 'fam-3',
    name: 'Rohit',
    role: 'Co-caregiver',
    relation: 'Beta (बेटा) · Can view & mark',
    phone: '+91 91234 56789',
    avatar: '',
    isAdmin: false,
    canEdit: false,
  },
];

export const COMMON_INDIAN_MEDICINES = [
  { name: 'Amlodipine 5mg', hindi: 'एम्लोडिपिन 5mg', for: 'Blood Pressure / बीपी', form: 'tablet' as const },
  { name: 'Metformin 500mg', hindi: 'मेटफॉर्मिन 500mg', for: 'Diabetes / शुगर', form: 'tablet' as const },
  { name: 'Telmisartan 40mg', hindi: 'टेल्मिसार्टन 40mg', for: 'Blood Pressure / बीपी', form: 'tablet' as const },
  { name: 'Atorvastatin 10mg', hindi: 'एटोरवास्टेटिन 10mg', for: 'Cholesterol / कोलेस्ट्रॉल', form: 'tablet' as const },
  { name: 'Pantoprazole 40mg', hindi: 'पैंटोप्रोजोल 40mg', for: 'Acidity / गैस', form: 'tablet' as const },
  { name: 'Thyronorm 50mcg', hindi: 'थायरोनॉर्म 50mcg', for: 'Thyroid / थायरॉइड', form: 'tablet' as const },
  { name: 'Vitamin D3 60k', hindi: 'विटामिन D3', for: 'Bone Health / हड्डियां', form: 'capsule' as const },
  { name: 'Paracetamol 650mg', hindi: 'पैरासिटामोल 650mg', for: 'Fever & Pain / बुखार-दर्द', form: 'tablet' as const },
];
