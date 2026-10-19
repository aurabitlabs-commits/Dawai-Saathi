import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { PillVisual } from '../common/PillVisual';
import { formatScheduleDate, getTodayDateString } from '../../utils/date';
import {
  AlertTriangle,
  BatteryCharging,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Phone,
  Pill,
  Plus,
  ShieldAlert,
  Users,
  ChevronRight,
  Calendar,
  AlertCircle,
  Utensils,
} from 'lucide-react';
import { timeToMinutes } from '../../utils/doseText';

interface CaregiverDashboardProps {
  onTabChange: (tab: string) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ onTabChange }) => {
  const {
    elder,
    doses,
    medicines,
    alerts,
    language,
    setShowAddMedicine,
    setEditingMedicine,
    triggerSimulatedReminder,
    markTakenByCaregiver,
  } = useApp();

  const isHindi = language === 'hi';
  const todayDateStr = getTodayDateString();

  // Today's doses sorted chronologically
  const todayDoses = doses
    .filter(d => d.date === todayDateStr)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  const completedDoses = todayDoses.filter(d => d.status === 'taken');
  const missedDoses = todayDoses.filter(d => d.status === 'missed');
  const pendingDoses = todayDoses.filter(d => d.status === 'pending' || d.status === 'snoozed');

  // Next medicine due soon
  const nextDueDose = pendingDoses[0];

  // Active missed dose alert or missed doses
  const missedAlert = alerts.find(a => a.type === 'missed_dose' && a.status === 'unclaimed');
  const activeMissedDose = missedDoses[0];

  // Low stock medicines (5 days or less)
  const lowStockMedicines = medicines.filter(m => m.stockDays <= 5);

  const completionPercentage =
    todayDoses.length > 0 ? Math.round((completedDoses.length / todayDoses.length) * 100) : 100;

  return (
    <div className="flex flex-col min-h-full pb-28 bg-[#FAF7F2]">
      {/* Top Patient Bar */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-amber-200/80 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={elder.photo || '/images/elder_dadaji_avatar_1792322618648.jpg'}
                alt={elder.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                {elder.honorific} {elder.name}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="text-emerald-700 font-semibold">{elder.lastSeenTime}</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  {elder.batteryLevel}% {isHindi ? 'बैटरी' : 'Battery'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingMedicine(null);
              setShowAddMedicine(true);
            }}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'दवा जोड़ें' : 'Add'}</span>
          </button>
        </div>

        {/* Date Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="font-semibold text-slate-700">
            {formatScheduleDate(todayDateStr, language)}
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isHindi ? 'रीयल-टाइम सिंक' : 'Live Sync Active'}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* =========================================================================
            ORDER 1: URGENT MISSED-DOSE ALERTS (What needs attention now)
            Rule: Direct users to prescribed guidance rather than inventing catch-up advice!
           ========================================================================= */}
        {activeMissedDose || missedAlert ? (
          <section
            aria-label={isHindi ? 'तत्काल ध्यान दें' : 'Urgent Attention Needed'}
            className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
                <span>{isHindi ? 'तत्काल ध्यान दें: छूटी हुई खुराक' : 'Urgent: Missed Dose'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-900 text-[11px] font-bold">
                {isHindi ? 'अलर्ट' : 'Alert'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-red-200 flex items-center gap-3">
              <PillVisual
                stripImage={activeMissedDose?.stripImage}
                pillAppearance={activeMissedDose?.pillAppearance}
                size="md"
                language={language}
              />
              <div className="flex-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeMissedDose ? activeMissedDose.medicineName : missedAlert?.medicineName}
                </h3>
                <p className="text-xs text-slate-600">
                  {activeMissedDose?.medicineHindiName} · {activeMissedDose?.dosage}
                </p>
                <p className="text-xs font-bold text-red-700 mt-0.5">
                  {isHindi
                    ? `शेड्यूल समय: ${activeMissedDose?.time || 'निर्धारित समय'} पर ली जानी थी`
                    : `Scheduled for ${activeMissedDose?.time || 'scheduled time'}`}
                </p>
              </div>
            </div>

            {/* Crucial Medical Prescription Advice Notice */}
            <div className="p-3 bg-red-100/70 rounded-xl border border-red-200 text-xs text-red-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">
                  {isHindi ? 'चिकित्सकीय मार्गदर्शन: ' : 'Prescription Guidance: '}
                </span>
                {isHindi
                  ? 'छूटी हुई खुराक के संबंध में डॉक्टर या पर्ची के निर्देशों का पालन करें। डॉक्टर से परामर्श के बिना कभी भी दोगुनी खुराक न दें।'
                  : 'Follow the physician prescription guidance regarding missed doses. Do not administer a double dose without consulting the doctor.'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${elder.emergencyContact.phone}`}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>{isHindi ? `${elder.honorific} को कॉल करें` : `Call ${elder.honorific}`}</span>
              </a>

              <button
                onClick={() => onTabChange('alerts')}
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors"
              >
                {isHindi ? 'अलर्ट्स देखें' : 'View Alerts'}
              </button>
            </div>
          </section>
        ) : (
          /* Reassuring calm status when no urgent alerts */
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-emerald-950">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">
                  {isHindi ? 'कोई आपातकालीन अलर्ट नहीं' : 'No Urgent Alerts'}
                </p>
                <p className="text-[11px] text-emerald-800">
                  {isHindi ? 'सभी खुराकें समय अनुसार चल रही हैं' : 'All medicines on track today'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-white text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200">
              {completedDoses.length}/{todayDoses.length} {isHindi ? 'पूरी' : 'taken'}
            </span>
          </div>
        )}

        {/* =========================================================================
            ORDER 2: MEDICINES DUE SOON (Upcoming doses today)
           ========================================================================= */}
        <section aria-label={isHindi ? 'आगामी खुराक' : 'Medicines Due Soon'}>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>{isHindi ? 'जल्द आने वाली खुराक (Due Soon)' : 'Medicines Due Soon'}</span>
            </h2>
            <button
              onClick={() => onTabChange('schedule')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              {isHindi ? 'पूरा शेड्यूल →' : 'Full Schedule →'}
            </button>
          </div>

          {nextDueDose ? (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <PillVisual
                    stripImage={nextDueDose.stripImage}
                    pillAppearance={nextDueDose.pillAppearance}
                    size="md"
                    language={language}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-blue-900 tabular-nums">
                        {nextDueDose.time}
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {isHindi ? 'आगामी' : 'Upcoming'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {nextDueDose.medicineName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {nextDueDose.medicineHindiName} · {nextDueDose.dosage}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => markTakenByCaregiver(nextDueDose.id)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'दर्ज करें' : 'Mark Taken'}</span>
                </button>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  {isHindi
                    ? `${elder.honorific} के फोन पर समय पर अलार्म बजेगा`
                    : `Alarm will sound on ${elder.honorific}'s phone`}
                </span>
                <button
                  onClick={() => triggerSimulatedReminder(nextDueDose.id)}
                  className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Bell className="w-3 h-3" />
                  <span>{isHindi ? 'अलार्म टेस्ट' : 'Test Reminder'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center py-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
              <p className="text-sm font-bold text-slate-800">
                {isHindi ? 'आज की सभी निर्धारित खुराकें पूरी हो चुकी हैं' : 'All scheduled doses completed for today'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? 'अगली खुराक कल सुबह होगी।' : 'Next dose is tomorrow morning.'}
              </p>
            </div>
          )}
        </section>

        {/* =========================================================================
            ORDER 3: LOW-STOCK MEDICINES (Refill Attention)
           ========================================================================= */}
        <section aria-label={isHindi ? 'कम स्टॉक वाली दवाइयाँ' : 'Low Stock Medicines'}>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-amber-600" />
              <span>{isHindi ? 'कम स्टॉक वाली दवाइयाँ (Low Stock)' : 'Low Stock Medicines'}</span>
            </h2>
            <button
              onClick={() => onTabChange('stock')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900"
            >
              {isHindi ? 'स्टॉक देखें →' : 'View Stock →'}
            </button>
          </div>

          {lowStockMedicines.length > 0 ? (
            <div className="space-y-2.5">
              {lowStockMedicines.map(med => (
                <div
                  key={med.id}
                  className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <PillVisual
                      stripImage={med.stripImage}
                      pillAppearance={med.pillAppearance}
                      size="sm"
                      language={language}
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{med.name}</h3>
                      <p className="text-[11px] font-extrabold text-amber-950 mt-0.5">
                        {isHindi
                          ? `केवल ${med.stockDays} दिन का स्टॉक बाकी (${med.totalStock} गोलियां)`
                          : `Only ${med.stockDays} days remaining (${med.totalStock} tablets)`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onTabChange('stock')}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
                  >
                    {isHindi ? 'रिफिल करें' : 'Refill'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'सभी दवाइयों का पर्याप्त स्टॉक है' : 'All medicines have sufficient stock'}</span>
              </span>
              <button
                onClick={() => onTabChange('stock')}
                className="font-bold text-slate-700 hover:text-slate-900"
              >
                {isHindi ? 'विवरण' : 'Details'}
              </button>
            </div>
          )}
        </section>

        {/* =========================================================================
            ORDER 4: TODAY'S COMPLETED AND REMAINING DOSES
           ========================================================================= */}
        <section
          aria-label={isHindi ? 'आज की समग्र प्रगति' : "Today's Adherence Summary"}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isHindi ? 'आज की प्रगति' : "Today's Progress"}
              </h2>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                {isHindi
                  ? `${todayDoses.length} में से ${completedDoses.length} खुराक पूरी`
                  : `${completedDoses.length} of ${todayDoses.length} doses completed`}
              </p>
            </div>

            <span className="text-lg font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
              {completionPercentage}%
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Mini Breakdown of Today's Doses */}
          <div className="divide-y divide-slate-100 pt-1">
            {todayDoses.map(dose => {
              const isTaken = dose.status === 'taken';
              const isMissed = dose.status === 'missed';

              return (
                <div key={dose.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 tabular-nums w-16">
                      {dose.time}
                    </span>
                    <span className="font-bold text-slate-900">{dose.medicineName}</span>
                  </div>

                  <div>
                    {isTaken ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isHindi ? `ले ली (${dose.takenAt || 'समय पर'})` : `Taken (${dose.takenAt || 'on time'})`}</span>
                      </span>
                    ) : isMissed ? (
                      <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>{isHindi ? 'छूट गई' : 'Missed'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'बाकी' : 'Pending'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            ORDER 5: QUICK ACTIONS (Adding medicine, contacting family, sound test)
           ========================================================================= */}
        <section aria-label={isHindi ? 'त्वरित कार्य' : 'Quick Actions'}>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
            {isHindi ? 'त्वरित कार्य (Quick Actions)' : 'Quick Actions'}
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Add Medicine */}
            <button
              onClick={() => {
                setEditingMedicine(null);
                setShowAddMedicine(true);
              }}
              className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center gap-3 transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{isHindi ? 'नई दवा जोड़ें' : 'Add Medicine'}</p>
                <p className="text-[10px] text-slate-500">{isHindi ? 'पर्ची से या नया' : 'New schedule'}</p>
              </div>
            </button>

            {/* View Full Schedule */}
            <button
              onClick={() => onTabChange('schedule')}
              className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center gap-3 transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{isHindi ? 'शेड्यूल देखें' : 'View Schedule'}</p>
                <p className="text-[10px] text-slate-500">{isHindi ? 'समय व खुराक' : 'Daily timeline'}</p>
              </div>
            </button>

            {/* Contact Family */}
            <button
              onClick={() => onTabChange('family')}
              className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center gap-3 transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{isHindi ? 'परिवार सदस्य' : 'Family Team'}</p>
                <p className="text-[10px] text-slate-500">{isHindi ? 'देखभालकर्ता' : 'Caregivers'}</p>
              </div>
            </button>

            {/* Test Reminder Alarm */}
            <button
              onClick={() => triggerSimulatedReminder()}
              className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center gap-3 transition-colors shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{isHindi ? 'अलार्म टेस्ट' : 'Test Alarm'}</p>
                <p className="text-[10px] text-slate-500">{isHindi ? 'घंटी व आवाज़' : 'Sound chime'}</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
