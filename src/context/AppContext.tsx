import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CaregiverAlert,
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
  showPairingModal: boolean;
  setShowPairingModal: (show: boolean) => void;
  showWhoCanSeeModal: boolean;
  setShowWhoCanSeeModal: (show: boolean) => void;
  showRefillWhatsAppModal: boolean;
  setShowRefillWhatsAppModal: (show: boolean) => void;
  showAdherenceReportModal: boolean;
  setShowAdherenceReportModal: (show: boolean) => void;

  // Actions
  markDoseTaken: (doseId: string, by: string) => void;
  snoozeDose: (doseId: string, minutes: number) => void;
  triggerSimulatedReminder: (doseId?: string) => void;
  claimAlert: (alertId: string, caregiverName: string) => void;
  markTakenByCaregiver: (doseId: string, alertId?: string) => void;
  addNewMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateStock: (medId: string, addedDays: number) => void;
  toggleSharing: (paused: boolean) => void;
  undoTaken: (doseId: string) => void;
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
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-18');

  // Interactive flow states
  const [activeReminder, setActiveReminder] = useState<DoseEvent | null>(null);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<{ isOpen: boolean; dose?: DoseEvent }>({
    isOpen: false,
  });
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showWhoCanSeeModal, setShowWhoCanSeeModal] = useState(false);
  const [showRefillWhatsAppModal, setShowRefillWhatsAppModal] = useState(false);
  const [showAdherenceReportModal, setShowAdherenceReportModal] = useState(false);

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

  const speakPrompt = (textHi: string, textEn: string) => {
    if (language === 'hi') {
      soundService.speakText(textHi, 'hi');
    } else {
      soundService.speakText(textEn, 'en');
    }
  };

  // Elder marks dose as taken
  const markDoseTaken = (doseId: string, by: string = 'Papa') => {
    soundService.playSuccessChime();

    const targetDose = doses.find(d => d.id === doseId);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setDoses(prev =>
      prev.map(d =>
        d.id === doseId
          ? {
              ...d,
              status: 'taken',
              takenAt: nowTime,
              markedBy: by,
            }
          : d
      )
    );

    // Deduct stock
    if (targetDose) {
      setMedicines(prev =>
        prev.map(m =>
          m.id === targetDose.medicineId
            ? { ...m, stockDays: Math.max(0, m.stockDays - 1), totalStock: Math.max(0, m.totalStock - 1) }
            : m
        )
      );

      // Create confirmation notification for caregivers
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

      // Also mark any existing missed dose alert for this medicine as resolved
      setAlerts(prev => [
        newAlert,
        ...prev.map(a =>
          a.medicineName === targetDose.medicineName && a.type === 'missed_dose'
            ? { ...a, status: 'resolved' as const, handledBy: `${by} (Confirmed Taken)` }
            : a
        ),
      ]);
    }

    // Close reminder and show big success confirmation
    setActiveReminder(null);
    setShowConfirmation({ isOpen: true, dose: targetDose });

    // Voice announcement
    speakPrompt(
      'शाबाश! आपने दवाई ले ली है। परिवार को सूचित कर दिया गया है।',
      'Great job! You have taken your medicine. Your family has been notified.'
    );
  };

  const undoTaken = (doseId: string) => {
    setDoses(prev =>
      prev.map(d =>
        d.id === doseId
          ? {
              ...d,
              status: 'pending',
              takenAt: undefined,
              markedBy: undefined,
            }
          : d
      )
    );
    speakPrompt('दवाई की स्थिति वापस बदल दी गई है।', 'Dose status has been reset.');
  };

  const snoozeDose = (doseId: string, minutes: number) => {
    soundService.playBellChime();
    setDoses(prev =>
      prev.map(d =>
        d.id === doseId
          ? {
              ...d,
              status: 'snoozed',
              note: `Snoozed for ${minutes} mins`,
            }
          : d
      )
    );
    setActiveReminder(null);
    setShowSnoozeModal(false);

    speakPrompt(
      `दवाई ${minutes} मिनट के लिए स्नूज़ कर दी गई है। हम आपको फिर से याद दिलाएंगे।`,
      `Medicine snoozed for ${minutes} minutes. We will remind you again.`
    );
  };

  const triggerSimulatedReminder = (doseId?: string) => {
    const target = doseId ? doses.find(d => d.id === doseId) : doses.find(d => d.status !== 'taken') || doses[1];
    if (target) {
      setActiveReminder(target);
      soundService.playBellChime();
      speakPrompt(
        `नमस्ते पापा, आपकी ${target.medicineHindiName} लेने का समय हो गया है। एक गोली खाने के बाद।`,
        `Namaste Papa, it is time for your ${target.medicineName}. 1 tablet after food.`
      );
    }
  };

  const claimAlert = (alertId: string, caregiverName: string = 'Neha') => {
    soundService.playSuccessChime();
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: 'handled',
              handledBy: caregiverName,
            }
          : a
      )
    );
    speakPrompt(
      `${caregiverName} ने यह अलर्ट संभाल लिया है।`,
      `${caregiverName} has claimed this alert.`
    );
  };

  const markTakenByCaregiver = (doseId: string, alertId?: string) => {
    markDoseTaken(doseId, 'Neha (Caregiver Call)');
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
    setMedicines(prev => [...prev, newMed]);

    // Create dose item for today
    const newDose: DoseEvent = {
      id: `dose-${Date.now()}`,
      medicineId: newId,
      medicineName: newMed.name,
      medicineHindiName: newMed.hindiName,
      dosage: newMed.dosage,
      time: newMed.time,
      date: '2026-10-18',
      status: 'pending',
    };
    setDoses(prev => [...prev, newDose]);
    setShowAddMedicine(false);
    soundService.playSuccessChime();
    speakPrompt('नई दवाई सफलतापूर्वक जोड़ दी गई है।', 'New medicine added successfully.');
  };

  const updateStock = (medId: string, addedDays: number) => {
    setMedicines(prev =>
      prev.map(m =>
        m.id === medId
          ? {
              ...m,
              stockDays: m.stockDays + addedDays,
              totalStock: m.totalStock + addedDays,
            }
          : m
      )
    );
    soundService.playSuccessChime();
  };

  const toggleSharing = (paused: boolean) => {
    setElder(prev => ({ ...prev, sharingPaused: paused }));
    if (paused) {
      speakPrompt(
        'परिवार के साथ शेयरिंग रोक दी गई है।',
        'Sharing with family has been paused.'
      );
    } else {
      speakPrompt(
        'शेयरिंग चालू है। परिवार को अपडेट मिलते रहेंगे।',
        'Sharing is active. Family will receive updates.'
      );
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
        showPairingModal,
        setShowPairingModal,
        showWhoCanSeeModal,
        setShowWhoCanSeeModal,
        showRefillWhatsAppModal,
        setShowRefillWhatsAppModal,
        showAdherenceReportModal,
        setShowAdherenceReportModal,
        markDoseTaken,
        snoozeDose,
        triggerSimulatedReminder,
        claimAlert,
        markTakenByCaregiver,
        addNewMedicine,
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
