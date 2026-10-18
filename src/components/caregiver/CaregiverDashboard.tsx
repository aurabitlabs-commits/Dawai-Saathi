import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  PhoneCall,
  Pill,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const CaregiverDashboard: React.FC<{
  onTabChange: (tab: string) => void;
}> = ({ onTabChange }) => {
  const {
    elder,
    doses,
    alerts,
    claimAlert,
    markTakenByCaregiver,
    setShowAddMedicine,
    setShowRefillWhatsAppModal,
    triggerSimulatedReminder,
    language,
    speakPrompt,
  } = useApp();

  const isHindi = language === 'hi';

  const takenCount = doses.filter(d => d.status === 'taken').length;
  const pendingCount = doses.filter(d => d.status === 'pending').length;
  const missedCount = doses.filter(d => d.status === 'missed').length;

  const missedAlert = alerts.find(a => a.type === 'missed_dose' && a.status !== 'resolved');
  const lowStockAlert = alerts.find(a => a.type === 'low_stock');

  const handleCallDadaji = () => {
    soundService.playBellChime();
    speakPrompt(
      'पापा को कॉल मिलाया जा रहा है...',
      'Calling Papa now...'
    );
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Caregiver Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/src/assets/images/elder_dadaji_avatar_1792322618648.jpg"
                alt="Dadaji"
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {elder.honorific} ({elder.name})
                </h1>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="text-emerald-700 font-semibold">{elder.lastSeenTime}</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  {elder.batteryLevel}% बैटरी
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={() => triggerSimulatedReminder()}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="दादू के फोन पर टेस्ट अलार्म बजाएं"
          >
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>टेस्ट अलार्म</span>
          </button>
        </div>

        {/* Date Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="font-semibold text-slate-700">सोमवार, 18 अक्टूबर 2026</span>
          <span className="text-emerald-700 font-medium">रीयल-टाइम सिंक सक्रिय</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Today's Status 3 KPI Chips matching Storyboard Screen 4 */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            {isHindi ? 'आज की स्थिति (Today\'s Status)' : "Today's Status"}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Taken Chip */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-emerald-800 tabular-nums">
                {takenCount}
              </span>
              <p className="text-xs font-bold text-emerald-900 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'ले ली (Taken)' : 'Taken'}</span>
              </p>
            </div>

            {/* Pending Chip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-amber-800 tabular-nums">
                {pendingCount}
              </span>
              <p className="text-xs font-bold text-amber-900 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{isHindi ? 'बाकी (Pending)' : 'Pending'}</span>
              </p>
            </div>

            {/* Missed Chip */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-red-800 tabular-nums">
                {missedCount}
              </span>
              <p className="text-xs font-bold text-red-900 mt-1 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isHindi ? 'छूट गई (Missed)' : 'Missed'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Urgent Active Missed Dose Alert Card matching Storyboard Screen 4 */}
        {missedAlert && (
          <div className="bg-red-50/90 border-2 border-red-300 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-red-950">
                    {missedAlert.titleHi}
                  </h3>
                  <span className="text-[11px] font-semibold text-red-700">
                    {missedAlert.timestamp}
                  </span>
                </div>
                <p className="text-sm font-bold text-red-900 mt-0.5">
                  {missedAlert.message}
                </p>
                <p className="text-xs text-red-700 mt-1">
                  दवाई: <span className="font-semibold">{missedAlert.medicineName}</span> · समय: 09:00 AM
                </p>
              </div>
            </div>

            {/* Alert Status or Action Buttons matching Storyboard Screen 4 */}
            {missedAlert.status === 'handled' ? (
              <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  {missedAlert.handledBy} द्वारा देखा जा रहा है
                </span>
                <button
                  onClick={() => markTakenByCaregiver('dose-2', missedAlert.id)}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs"
                >
                  ली गई मार्क करें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => claimAlert(missedAlert.id, 'Neha (Beti)')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>मैंने बात कर ली (I called him)</span>
                </button>

                <button
                  onClick={() => {
                    triggerSimulatedReminder('dose-2');
                    soundService.playAlertTone();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-red-100 border border-red-300 text-red-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-red-700" />
                  <span>फिर से याद दिलाएं</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Refill Reminder Banner matching Storyboard Screen 4 */}
        {lowStockAlert && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  {lowStockAlert.titleHi}
                </h4>
                <p className="text-sm font-bold text-amber-900">
                  {lowStockAlert.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => onTabChange('stock')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              स्टॉक देखें
            </button>
          </div>
        )}

        {/* Today's Schedule Timeline List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900">
              {isHindi ? 'दवाइयों का शेड्यूल' : 'Medicine Schedule'}
            </h3>
            <button
              onClick={() => setShowAddMedicine(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'नई दवा जोड़ें' : 'Add Medicine'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {doses.map(dose => {
              const isTaken = dose.status === 'taken';
              const isMissed = dose.status === 'missed';

              return (
                <div
                  key={dose.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTaken
                      ? 'bg-white border-slate-200'
                      : isMissed
                      ? 'bg-red-50/60 border-red-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isTaken
                          ? 'bg-emerald-100 text-emerald-800'
                          : isMissed
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isTaken ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <Clock className="w-5 h-5" />}
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {dose.medicineName}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500">
                          {dose.time} · {dose.dosage}
                        </p>
                      </div>
                    </div>

                    {/* Status Chip */}
                    <div>
                      {isTaken && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          ✓ ली गई ({dose.takenAt})
                        </span>
                      )}
                      {isMissed && (
                        <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
                          ! छूटी हुई
                        </span>
                      )}
                      {dose.status === 'pending' && (
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          समय बाकी
                        </span>
                      )}
                      {dose.status === 'snoozed' && (
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                          स्नूज़ किया
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Caregiver Actions row if missed or pending */}
                  {!isTaken && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {isMissed ? 'पापा से फोन पर पुष्टि करें:' : 'जल्द याद दिलाना है:'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => markTakenByCaregiver(dose.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition-colors"
                        >
                          ली गई मार्क करें
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Family Call & Share Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold">
              {isHindi ? 'पापा से बात करना चाहते हैं?' : 'Want to talk to Papa?'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              +91 98765 00000 · घर का लैंडलाइन या मोबाइल
            </p>
          </div>
          <button
            onClick={handleCallDadaji}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>कॉल करें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
