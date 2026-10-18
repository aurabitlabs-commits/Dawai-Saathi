import { buildDoseSpeech } from '../utils/doseText';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  CaregiverAlert,
  DoseAuditEntry,
  DoseEvent,
  ElderProfile,
  FamilyMember,
  Language,
  Medicine,
  Role,
} from '../types';
import {
  INITIAL_ALERTS,
  INITIAL_DOSES,
  INITIAL_ELDER,
  INITIAL_FAMILY,
  INITIAL_MEDICINES,
} from '../data/initialData';
import { soundService } from '../utils/audio';
import { getTodayDateString } from '../utils/date';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  elder: ElderProfile;
  medicines: Medicine[];
  doses: DoseEvent[];
  alerts: CaregiverAlert[];
  familyMembers: FamilyMember[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getDosesForDate: (dateStr: string) => DoseEvent[];

  // Modals & Active states
  activeReminder: DoseEvent | null;
  setActiveReminder: (dose: DoseEvent | null) => void;
  showSnoozeModal: boolean;
  setShowSnoozeModal: (show: boolean) => void;
  showCallModal: boolean;
  setShowCallModal: (show: boolean) => void;
  showConfirmation: { isOpen: boolean; dose?: DoseEvent };
  setShowConfirmation: (conf: { isOpen: boolean; dose?: DoseEvent }) => void;
  showAddMedicine: boolean;
  setShowAddMedicine: (show: boolean) => void;
  editingMedicine: Medicine | null;
  setEditingMedicine: (med: Medicine | null) => void;
  showPairingModal: boolean;
  setShowPairingModal: (show: boolean) => void;
  showWhoCanSeeModal: boolean;
  setShowWhoCanSeeModal: (show: boolean) => void;
  showRefillWhatsAppModal: boolean;
  setShowRefillWhatsAppModal: (show: boolean) => void;
  showAdherenceReportModal: boolean;
  setShowAdherenceReportModal: (show: boolean) => void;

  // Duplicate dose protection (PRD FR-16)
  duplicateWarning: { isOpen: boolean; dose?: DoseEvent; message?: string } | null;
  setDuplicateWarning: (warn: { isOpen: boolean; dose?: DoseEvent; message?: string } | null) => void;

  // Actions
  markDoseTaken: (doseId: string, by?: string, forceConfirm?: boolean) => void;
  snoozeDose: (doseId: string, minutes: number, isFastForward?: boolean) => void;
  triggerSimulatedReminder: (doseId?: string) => void;
  claimAlert: (alertId: string, caregiverName: string) => void;
  markTakenByCaregiver: (doseId: string, alertId?: string) => void;
  addNewMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateExistingMedicine: (med: Medicine) => void;
  updateStock: (medId: string, addedDays: number) => void;
  toggleSharing: (paused: boolean) => void;
  undoTaken: (doseId: string, by?: string) => void;
  speakPrompt: (textHi: string, textEn: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('elder');
  const [language, setLanguage] = useState<Language>('hi');
  const [elder, setElder] = useState<ElderProfile>(() => {
    const saved = localStorage.getItem('ds_elder');
    return saved ? JSON.parse(saved) : INITIAL_ELDER;
  });
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('ds_meds');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });
  const [doses, setDoses] = useState<DoseEvent[]>(() => {
    const saved = localStorage.getItem('ds_doses');
    return saved ? JSON.parse(saved) : INITIAL_DOSES;
  });
  const [alerts, setAlerts] = useState<CaregiverAlert[]>(() => {
    const saved = localStorage.getItem('ds_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY);
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());

  // Interactive flow states
  const [activeReminder, setActiveReminder] = useState<DoseEvent | null>(null);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{ isOpen: boolean; dose?: DoseEvent }>({
    isOpen: false,
  });
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showWhoCanSeeModal, setShowWhoCanSeeModal] = useState(false);
  const [showRefillWhatsAppModal, setShowRefillWhatsAppModal] = useState(false);
  const [showAdherenceReportModal, setShowAdherenceReportModal] = useState(false);

  // Duplicate warning modal state
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isOpen: boolean;
    dose?: DoseEvent;
    message?: string;
  } | null>(null);

  // Multi-tab / Multi-window real-time Broadcast Channel simulation
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('dawai_saathi_channel');
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_STATE') {
          if (event.data.doses) setDoses(event.data.doses);
          if (event.data.medicines) setMedicines(event.data.medicines);
          if (event.data.alerts) setAlerts(event.data.alerts);
          if (event.data.elder) setElder(event.data.elder);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  const broadcastState = (newState: {
    doses?: DoseEvent[];
    medicines?: Medicine[];
    alerts?: CaregiverAlert[];
    elder?: ElderProfile;
  }) => {
    try {
      broadcastRef.current?.postMessage({
        type: 'SYNC_STATE',
        ...newState,
      });
    } catch (e) {
      // Ignore broadcast errors
    }
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ds_elder', JSON.stringify(elder));
  }, [elder]);

  useEffect(() => {
    localStorage.setItem('ds_meds', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('ds_doses', JSON.stringify(doses));
  }, [doses]);

  useEffect(() => {
    localStorage.setItem('ds_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Make sure every new day has its dose records (doses are persisted per date;
  // without this, tomorrow would show an empty schedule / "all done").
  useEffect(() => {
    const ensureToday = () => {
      const today = getTodayDateString();
      setDoses(prev => {
        if (prev.some(d => d.date === today)) return prev;
        const generated: DoseEvent[] = medicines.map(med => ({
          id: `dose-${today}-${med.id}`,
          medicineId: med.id,
          medicineName: med.name,
          medicineHindiName: med.hindiName,
          dosage: med.dosage,
          time: med.time,
          date: today,
          status: 'pending',
          stripImage: med.stripImage,
          pillAppearance: med.pillAppearance,
        }));
        return generated.length ? [...prev, ...generated] : prev;
      });
    };
    ensureToday();
    const t = setInterval(ensureToday, 60 * 1000); // also covers midnight rollover
    return () => clearInterval(t);
  }, [medicines]);
  // Periodic snoozed reminder worker check
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const dueSnoozed = doses.find(
        d => d.status === 'snoozed' && d.snoozedUntil && now >= d.snoozedUntil
      );

      if (dueSnoozed) {
        // Wake up snooze: move to pending and open full reminder
        setDoses(prev =>
          prev.map(d =>
            d.id === dueSnoozed.id
              ? {
                  ...d,
                  status: 'pending',
                  snoozedUntil: undefined,
                  note: 'स्नूज़ का समय पूरा हुआ (Snooze expired)',
                }
              : d
          )
        );

        setActiveReminder(dueSnoozed);
        soundService.playBellChime();
        speakPrompt(
          `नमस्ते पापा, स्नूज़ का समय पूरा हो गया है। कृपया अपनी ${dueSnoozed.medicineHindiName} ले लीजिए।`,
          `Namaste Papa, your snooze time is up. Please take your ${dueSnoozed.medicineName}.`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [doses]);

  // Derive schedule dynamically for any date
  // Historical dates must reflect saved events only. Reconstructing an old day
  // from today's prescription would fabricate medical history.
  const getDosesForDate = (dateStr: string): DoseEvent[] => {
    const existing = doses.filter(d => d.date === dateStr);
    if (existing.length > 0) return existing;

    // Today is persisted by ensureToday. Do not invent past events; only preview
    // a future schedule when no saved dose events exist for that date.
    if (dateStr <= getTodayDateString()) return [];

    return medicines.map(med => ({
      id: `dose-${dateStr}-${med.id}`,
      medicineId: med.id,
      medicineName: med.name,
      medicineHindiName: med.hindiName,
      dosage: med.dosage,
      time: med.time,
      date: dateStr,
      status: 'pending',
      stripImage: med.stripImage,
      pillAppearance: med.pillAppearance,
    }));
  };

  const speakPrompt = (textHi: string, textEn: string) => {
    if (language === 'hi') {
      soundService.speakText(textHi, 'hi');
    } else {
      soundService.speakText(textEn, 'en');
    }
  };

  /**
   * P1 Fix: Idempotent markDoseTaken with duplicate check (PRD FR-16)
   * Stock is only deducted once upon first successful transition from untaken -> taken.
   */
  const markDoseTaken = (doseId: string, by: string = 'Papa', forceConfirm: boolean = false) => {
    const targetDose = doses.find(d => d.id === doseId);
    if (!targetDose) return;

    // Idempotency & Duplicate Check
    if (targetDose.status === 'taken' && !forceConfirm) {
      setDuplicateWarning({
        isOpen: true,
        dose: targetDose,
        message: `आपने यह दवाई पहले ही ${targetDose.takenAt || 'आज'} ले ली है।`,
      });
      speakPrompt(
        'आपने यह दवाई पहले ही ले ली है। क्या आप समय अपडेट करना चाहते हैं?',
        'You already marked this medicine as taken.'
      );
      return;
    }

    soundService.playSuccessChime();
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const auditEntry: DoseAuditEntry = {
      timestamp: nowTime,
      action: targetDose.status === 'taken' ? 're-confirmed' : 'confirmed_taken',
      actor: by,
      details: `Dose confirmed by ${by}`,
    };

    const updatedDoses = doses.map(d =>
      d.id === doseId
        ? {
            ...d,
            status: 'taken' as const,
            takenAt: nowTime,
            markedBy: by,
            snoozedUntil: undefined,
            auditHistory: [...(d.auditHistory || []), auditEntry],
          }
        : d
    );

    setDoses(updatedDoses);

    // Deduct stock strictly once (only if previously untaken)
    let updatedMeds = medicines;
    if (targetDose.status !== 'taken') {
      updatedMeds = medicines.map(m =>
        m.id === targetDose.medicineId
          ? {
              ...m,
              stockDays: Math.max(0, m.stockDays - 1),
              totalStock: Math.max(0, m.totalStock - 1),
            }
          : m
      );
      setMedicines(updatedMeds);
    }

    // Reconcile and add confirmation alert
    const newAlert: CaregiverAlert = {
      id: `alert-${Date.now()}`,
      type: 'dose_confirmed',
      title: 'Dose Confirmed',
      titleHi: 'दवाई ले ली गई',
      message: `${targetDose.medicineName} was taken by ${by} at ${nowTime}.`,
      messageHi: `${targetDose.medicineHindiName} पापा द्वारा ${nowTime} पर ले ली गई है।`,
      timestamp: `Today, ${nowTime}`,
      medicineName: targetDose.medicineName,
      status: 'resolved',
    };

    // Mark existing missed dose alert for this medicine as resolved
    const updatedAlerts = [
      newAlert,
      ...alerts.map(a =>
        a.medicineName === targetDose.medicineName && a.type === 'missed_dose'
          ? { ...a, status: 'resolved' as const, handledBy: `${by} (Confirmed Taken)` }
          : a
      ),
    ];
    setAlerts(updatedAlerts);

    // Broadcast change to other open devices/tabs
    broadcastState({
      doses: updatedDoses,
      medicines: updatedMeds,
      alerts: updatedAlerts,
    });

    setActiveReminder(null);
    setShowConfirmation({ isOpen: true, dose: targetDose });
    setDuplicateWarning(null);

    speakPrompt(
      'शाबाश! आपने दवाई ले ली है। परिवार को सूचित कर दिया गया है।',
      'Great job! You have taken your medicine. Your family has been notified.'
    );
  };

  /**
   * P1 Fix: Reconciled undoTaken
   * Restores deducted stock (+1) and reconciles alerts & audit trail.
   */
  const undoTaken = (doseId: string, by: string = 'Caregiver') => {
    const targetDose = doses.find(d => d.id === doseId);
    if (!targetDose || targetDose.status !== 'taken') return;

    soundService.playAlertTone();
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // 1. Restore stock
    const updatedMeds = medicines.map(m =>
      m.id === targetDose.medicineId
        ? {
            ...m,
            stockDays: m.stockDays + 1,
            totalStock: m.totalStock + 1,
          }
        : m
    );
    setMedicines(updatedMeds);

    // 2. Revert dose status and log audit entry
    const auditEntry: DoseAuditEntry = {
      timestamp: nowTime,
      action: 'undone',
      actor: by,
      details: `Taken status undone by ${by}; stock restored (+1)`,
    };

    const updatedDoses = doses.map(d =>
      d.id === doseId
        ? {
            ...d,
            status: 'pending' as const,
            takenAt: undefined,
            markedBy: undefined,
            auditHistory: [...(d.auditHistory || []), auditEntry],
          }
        : d
    );
    setDoses(updatedDoses);

    // 3. Reconcile alerts: remove the confirmed alert for this dose
    const updatedAlerts = alerts.filter(
      a => !(a.type === 'dose_confirmed' && a.medicineName === targetDose.medicineName)
    );
    setAlerts(updatedAlerts);

    broadcastState({
      doses: updatedDoses,
      medicines: updatedMeds,
      alerts: updatedAlerts,
    });

    speakPrompt(
      'दवाई की स्थिति वापस कर दी गई है और स्टॉक पुनः जोड़ दिया गया है।',
      'Dose status reversed and stock restored.'
    );
  };

  /**
   * P1 Fix: Reliable snooze scheduling with persisted snoozedUntil timestamp
   */
  const snoozeDose = (doseId: string, minutes: number, isFastForward: boolean = false) => {
    soundService.playBellChime();
    const targetDose = doses.find(d => d.id === doseId);
    if (!targetDose) return;

    const snoozeDurationMs = isFastForward ? 5000 : minutes * 60 * 1000;
    const snoozedUntil = Date.now() + snoozeDurationMs;
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const auditEntry: DoseAuditEntry = {
      timestamp: nowTime,
      action: 'snoozed',
      actor: 'Elder',
      details: isFastForward
        ? `Fast-forward test snooze (5 seconds)`
        : `Snoozed for ${minutes} minutes until ${new Date(snoozedUntil).toLocaleTimeString()}`,
    };

    const updatedDoses = doses.map(d =>
      d.id === doseId
        ? {
            ...d,
            status: 'snoozed' as const,
            snoozedUntil,
            note: isFastForward ? '5 सेकंड बाद पुनः अलार्म बजेगा' : `${minutes} मिनट बाद पुनः अलार्म बजेगा`,
            auditHistory: [...(d.auditHistory || []), auditEntry],
          }
        : d
    );

    setDoses(updatedDoses);
    setActiveReminder(null);
    setShowSnoozeModal(false);

    broadcastState({ doses: updatedDoses });

    speakPrompt(
      isFastForward
        ? 'दवाई 5 सेकंड के लिए स्नूज़ कर दी गई है। तुरंत रिमाइंडर आएगा।'
        : `दवाई ${minutes} मिनट के लिए स्नूज़ कर दी गई है। समय होते ही हम आपको फिर से याद दिलाएंगे।`,
      `Medicine snoozed. We will remind you again.`
    );
  };

  const triggerSimulatedReminder = (doseId?: string) => {
    const target = doseId
      ? doses.find(d => d.id === doseId)
      : doses.find(d => d.status !== 'taken') || doses[0];

    if (target) {
      setActiveReminder(target);
      soundService.playBellChime();
      const speech = buildDoseSpeech(target, medicines.find(m => m.id === target.medicineId)?.mealRelation);
      speakPrompt(speech.hi, speech.en);
    }
  };

  const claimAlert = (alertId: string, caregiverName: string = 'Neha') => {
    soundService.playSuccessChime();
    const updatedAlerts = alerts.map(a =>
      a.id === alertId
        ? {
            ...a,
            status: 'handled' as const,
            handledBy: caregiverName,
          }
        : a
    );
    setAlerts(updatedAlerts);
    broadcastState({ alerts: updatedAlerts });

    speakPrompt(
      `${caregiverName} ने यह अलर्ट संभाल लिया है।`,
      `${caregiverName} has claimed this alert.`
    );
  };

  const markTakenByCaregiver = (doseId: string, alertId?: string) => {
    markDoseTaken(doseId, 'Neha (Caregiver Call)', true);
    if (alertId) {
      claimAlert(alertId, 'Neha (Confirmed on Call)');
    }
  };

  const addNewMedicine = (med: Omit<Medicine, 'id'>) => {
    const newId = `med-${Date.now()}`;
    const newMed: Medicine = {
      ...med,
      id: newId,
    };
    const updatedMeds = [...medicines, newMed];
    setMedicines(updatedMeds);

    const todayDate = getTodayDateString();
    const newDose: DoseEvent = {
      id: `dose-${todayDate}-${newId}`,
      medicineId: newId,
      medicineName: newMed.name,
      medicineHindiName: newMed.hindiName,
      dosage: newMed.dosage,
      time: newMed.time,
      date: todayDate,
      status: 'pending',
      stripImage: newMed.stripImage,
      pillAppearance: newMed.pillAppearance,
    };
    const updatedDoses = [...doses, newDose];
    setDoses(updatedDoses);

    setShowAddMedicine(false);
    broadcastState({ medicines: updatedMeds, doses: updatedDoses });

    soundService.playSuccessChime();
    speakPrompt('नई दवाई सफलतापूर्वक जोड़ दी गई है।', 'New medicine added successfully.');
  };

  const updateExistingMedicine = (updatedMed: Medicine) => {
    const updatedMeds = medicines.map(m => (m.id === updatedMed.id ? updatedMed : m));
    setMedicines(updatedMeds);

    // Preserve completed dose snapshots. Prescription edits should not rewrite
    // a dose already recorded as taken or any event from a past date.
    const today = getTodayDateString();
    const updatedDoses = doses.map(d =>
      d.medicineId === updatedMed.id && d.status !== 'taken' && d.date >= today
        ? {
            ...d,
            medicineName: updatedMed.name,
            medicineHindiName: updatedMed.hindiName,
            dosage: updatedMed.dosage,
            time: updatedMed.time,
            stripImage: updatedMed.stripImage,
            pillAppearance: updatedMed.pillAppearance,
          }
        : d
    );
    setDoses(updatedDoses);

    setEditingMedicine(null);
    setShowAddMedicine(false);
    broadcastState({ medicines: updatedMeds, doses: updatedDoses });

    soundService.playSuccessChime();
    speakPrompt('दवाई का विवरण व फ़ोटो अपडेट कर दी गई है।', 'Medicine details and visual updated.');
  };

  const updateStock = (medId: string, addedDays: number) => {
    const updatedMeds = medicines.map(m =>
      m.id === medId
        ? {
            ...m,
            stockDays: m.stockDays + addedDays,
            totalStock: m.totalStock + addedDays,
          }
        : m
    );
    setMedicines(updatedMeds);
    broadcastState({ medicines: updatedMeds });
    soundService.playSuccessChime();
  };

  const toggleSharing = (paused: boolean) => {
    const updatedElder = { ...elder, sharingPaused: paused };
    setElder(updatedElder);
    broadcastState({ elder: updatedElder });

    if (paused) {
      speakPrompt('परिवार के साथ शेयरिंग रोक दी गई है।', 'Sharing with family has been paused.');
    } else {
      speakPrompt('शेयरिंग चालू है। परिवार को अपडेट मिलते रहेंगे।', 'Sharing is active. Family will receive updates.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        elder,
        medicines,
        doses,
        alerts,
        familyMembers,
        selectedDate,
        setSelectedDate,
        getDosesForDate,
        activeReminder,
        setActiveReminder,
        showSnoozeModal,
        setShowSnoozeModal,
        showCallModal,
        setShowCallModal,
        showConfirmation,
        setShowConfirmation,
        showAddMedicine,
        setShowAddMedicine,
        editingMedicine,
        setEditingMedicine,
        showPairingModal,
        setShowPairingModal,
        showWhoCanSeeModal,
        setShowWhoCanSeeModal,
        showRefillWhatsAppModal,
        setShowRefillWhatsAppModal,
        showAdherenceReportModal,
        setShowAdherenceReportModal,
        duplicateWarning,
        setDuplicateWarning,
        markDoseTaken,
        snoozeDose,
        triggerSimulatedReminder,
        claimAlert,
        markTakenByCaregiver,
        addNewMedicine,
        updateExistingMedicine,
        updateStock,
        toggleSharing,
        undoTaken,
        speakPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
