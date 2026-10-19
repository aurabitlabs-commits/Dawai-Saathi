import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderBar } from './components/common/HeaderBar';
import { BottomNav } from './components/common/BottomNav';
import { ElderHome } from './components/elder/ElderHome';
import { ElderReminderModal } from './components/elder/ElderReminderModal';
import { ElderConfirmationModal } from './components/elder/ElderConfirmationModal';
import { ElderSnoozeModal } from './components/elder/ElderSnoozeModal';
import { ElderCallModal } from './components/elder/ElderCallModal';
import { ElderPrivacyModal } from './components/elder/ElderPrivacyModal';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { CaregiverSchedule } from './components/caregiver/CaregiverSchedule';
import { CaregiverAlerts } from './components/caregiver/CaregiverAlerts';
import { CaregiverStock } from './components/caregiver/CaregiverStock';
import { CaregiverHistory } from './components/caregiver/CaregiverHistory';
import { CaregiverFamily } from './components/caregiver/CaregiverFamily';
import { CaregiverMore } from './components/caregiver/CaregiverMore';
import { AddMedicineModal } from './components/caregiver/AddMedicineModal';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { DuplicateDoseModal } from './components/elder/DuplicateDoseModal';
import { Bell } from 'lucide-react';

const MainApp: React.FC = () => {
  const { role, triggerSimulatedReminder } = useApp();
  const [caregiverTab, setCaregiverTab] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<'mobile' | 'expanded'>('mobile');

  return (
    <div className="min-h-screen bg-[#081526] flex flex-col font-sans text-slate-900">
      {/* Top Application Bar */}
      <HeaderBar onOpenWelcome={() => setShowWelcome(true)} />

      {/* Keep developer/demo controls out of the senior-facing screen. */}
      {role !== 'elder' && <div className="bg-[#0B1D33] text-white text-xs px-4 py-2 border-b border-[#18334F]">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">
              लोकल डेमो मोड (Local Demo · Multi-Tab Sync):
            </span>
            <span className="text-slate-300">
              {role === 'elder'
                ? 'दादू का फोन (Elder View) - बड़ा टेक्स्ट, हिंदी आवाज़'
                : 'केयरगिवर का फोन (Caregiver View) - रिमोट मॉनिटरिंग'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerSimulatedReminder()}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>टेस्ट अलार्म बजाएं</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setDeviceFrameMode(prev => (prev === 'mobile' ? 'expanded' : 'mobile'))}
              className="text-slate-300 hover:text-white"
            >
              {deviceFrameMode === 'mobile' ? 'विस्तृत दृश्य (Full Width)' : 'मोबाइल फ्रेम (Phone View)'}
            </button>
          </div>
        </div>
      </div>}

      {/* Main Container: Mobile Frame or Full Width */}
      <main className="flex-1 flex justify-center p-0 sm:py-6 sm:px-4">
        <div
          className={`w-full bg-white shadow-xl flex flex-col transition-all duration-300 relative ${
            deviceFrameMode === 'mobile'
              ? 'max-w-md sm:rounded-[32px] sm:border-[8px] sm:border-[#10253D] min-h-[820px] overflow-hidden'
              : 'max-w-4xl sm:rounded-3xl border border-[#243A53] min-h-[820px]'
          }`}
        >
          {/* Mobile Screen Notch on frame mode */}
          {deviceFrameMode === 'mobile' && (
            <div className="hidden sm:flex justify-center pt-2 pb-1 bg-slate-800">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
              </div>
            </div>
          )}

          {/* Body Content based on Active Role */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {role === 'elder' ? (
              <ElderHome />
            ) : (
              <>
                {caregiverTab === 'dashboard' && <CaregiverDashboard onTabChange={setCaregiverTab} />}
                {caregiverTab === 'schedule' && <CaregiverSchedule />}
                {caregiverTab === 'alerts' && <CaregiverAlerts onTabChange={setCaregiverTab} />}
                {caregiverTab === 'stock' && <CaregiverStock />}
                {caregiverTab === 'more' && <CaregiverMore onTabChange={setCaregiverTab} />}
                {caregiverTab === 'history' && <CaregiverHistory onTabChange={setCaregiverTab} />}
                {caregiverTab === 'family' && <CaregiverFamily onTabChange={setCaregiverTab} />}
              </>
            )}
          </div>

          {/* Caregiver Bottom Nav */}
          {role !== 'elder' && (
            <BottomNav activeTab={caregiverTab} onTabChange={setCaregiverTab} />
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <ElderReminderModal />
      <ElderConfirmationModal />
      <ElderSnoozeModal />
      <ElderCallModal />
      <ElderPrivacyModal />
      <DuplicateDoseModal />
      <AddMedicineModal />
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
    </div>
  );
};

export default function App() {
  // SehatParivaar's current web app is local-first: no Supabase project or database is required.
  // AppContext persists the prototype's data in browser localStorage.
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
