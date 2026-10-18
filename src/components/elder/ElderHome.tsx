import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import {
  Bell,
  CheckCircle2,
  Clock,
  Phone,
  Shield,
  Volume2,
  X,
} from 'lucide-react';

export const ElderHome: React.FC = () => {
  const {
    elder,
    doses,
    language,
    markDoseTaken,
    triggerSimulatedReminder,
    setShowCallModal,
    setShowWhoCanSeeModal,
    speakPrompt,
  } = useApp();

  const isHindi = language === 'hi';

  // Find next pending or missed dose
  const nextDose = doses.find(d => d.status === 'pending' || d.status === 'missed') || doses[0];
  const completedDoses = doses.filter(d => d.status === 'taken');

  const handleSpeakOverview = () => {
    soundService.playBellChime();
    if (nextDose) {
      speakPrompt(
        `नमस्ते पापा। आज आपकी ${completedDoses.length} दवाइयाँ ली जा चुकी हैं। अगली दवाई ${nextDose.time} पर ${nextDose.medicineHindiName} है।`,
        `Namaste Papa. You have taken ${completedDoses.length} medicines today. Your next medicine is ${nextDose.medicineName} at ${nextDose.time}.`
      );
    } else {
      speakPrompt(
        'नमस्ते पापा! आज की सभी दवाइयाँ पूरी हो चुकी हैं। बहुत बढ़िया!',
        'Namaste Papa! All medicines for today have been taken. Great job!'
      );
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Top Elder Header: Large, welcoming, dignified */}
      <div className="bg-gradient-to-b from-amber-50 to-white px-5 pt-4 pb-5 border-b border-amber-100/80">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-amber-800 flex items-center gap-1.5">
              <span>सोमवार, 18 अक्टूबर 2026</span>
              <span className="text-xs bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">आज</span>
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <span>नमस्ते पापा</span>
              <span className="text-amber-500">☀️</span>
            </h1>
          </div>

          {/* Big Voice Button */}
          <button
            onClick={handleSpeakOverview}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 active:scale-95 transition-all shadow-sm border border-amber-200/60"
            title="बोलकर बताएं (Speak aloud)"
            aria-label="बोलकर बताएं"
          >
            <Volume2 className="w-7 h-7 text-amber-800 animate-pulse" />
            <span className="text-xs font-bold mt-1">सुनिए</span>
          </button>
        </div>

        {/* Sharing status badge */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium">
              {elder.sharingPaused
                ? isHindi ? 'परिवार के साथ शेयरिंग रुकी है' : 'Sharing paused'
                : isHindi ? 'नेहा (बेटी) से कनेक्टेड है' : 'Connected with Neha (Daughter)'}
            </span>
          </div>
          <button
            onClick={() => setShowWhoCanSeeModal(true)}
            className="text-emerald-700 font-semibold underline hover:text-emerald-800"
          >
            {isHindi ? 'विवरण देखें' : 'View Details'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-5 space-y-6 flex-1">
        {/* Next Dose Hero Card - Large, Uncluttered, High Contrast */}
        {nextDose ? (
          <div className={`p-6 rounded-3xl border-2 shadow-md transition-all ${
            nextDose.status === 'missed'
              ? 'bg-red-50/90 border-red-300 ring-2 ring-red-200'
              : 'bg-emerald-50/70 border-emerald-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                nextDose.status === 'missed'
                  ? 'bg-red-200 text-red-900'
                  : 'bg-emerald-200 text-emerald-900'
              }`}>
                {nextDose.status === 'missed'
                  ? (isHindi ? 'दवाई छूट गई है' : 'Missed Dose')
                  : (isHindi ? 'अगली दवाई का समय' : 'Next Medicine')}
              </span>
              <div className="flex items-center gap-1.5 text-2xl font-black text-slate-900">
                <Clock className="w-6 h-6 text-emerald-700" />
                <span>{nextDose.time}</span>
              </div>
            </div>

            <div className="my-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-200 shrink-0">
                <span className="text-3xl">💊</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {isHindi ? nextDose.medicineHindiName : nextDose.medicineName}
                </h2>
                <p className="text-base font-semibold text-slate-700 mt-1">
                  {nextDose.dosage} · {isHindi ? 'खाने के बाद' : 'After Food'}
                </p>
              </div>
            </div>

            {/* Giant Big Action Button - 72px touch target */}
            <div className="space-y-3">
              <button
                onClick={() => markDoseTaken(nextDose.id, 'Papa')}
                className="w-full h-20 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-700/25 transition-transform"
              >
                <CheckCircle2 className="w-8 h-8" />
                <span>{isHindi ? 'दवाई ले ली' : 'Taken'}</span>
              </button>

              <button
                onClick={() => triggerSimulatedReminder(nextDose.id)}
                className="w-full py-3 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white rounded-xl border border-slate-200/80 transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'अलार्म और आवाज़ चलाकर देखें' : 'Test Alarm & Voice Reminder'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl mb-3">
              🎉
            </div>
            <h2 className="text-2xl font-black text-emerald-900">
              {isHindi ? 'आज की सभी दवाइयाँ पूरी!' : 'All Medicines Taken!'}
            </h2>
            <p className="text-base text-slate-700 mt-2">
              {isHindi ? 'बहुत खूब पापा! परिवार निश्चिंत है।' : 'Great job Papa! Your family is at peace.'}
            </p>
          </div>
        )}

        {/* Big Call Family Button */}
        <button
          onClick={() => setShowCallModal(true)}
          className="w-full h-18 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xl flex items-center justify-center gap-3 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
        >
          <Phone className="w-7 h-7" />
          <span>{isHindi ? 'परिवार से बात करें (कॉल करें)' : 'Call Family (Neha)'}</span>
        </button>

        {/* Today's Checklist - Senior Friendly High Contrast */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-black text-slate-900">
              {isHindi ? 'आज की दवाइयाँ' : "Today's Schedule"}
            </h3>
            <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-full">
              {completedDoses.length} / {doses.length} {isHindi ? 'ली गईं' : 'Taken'}
            </span>
          </div>

          <div className="space-y-3">
            {doses.map(dose => {
              const isTaken = dose.status === 'taken';
              const isMissed = dose.status === 'missed';

              return (
                <div
                  key={dose.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isTaken
                      ? 'bg-white border-emerald-200 shadow-xs'
                      : isMissed
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => {
                        if (!isTaken) {
                          markDoseTaken(dose.id, 'Papa');
                        }
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isTaken
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : isMissed
                          ? 'bg-red-100 text-red-600 hover:bg-emerald-600 hover:text-white'
                          : 'bg-slate-100 text-slate-400 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title={isTaken ? 'Taken' : 'Mark as taken'}
                    >
                      {isTaken ? <CheckCircle2 className="w-7 h-7" /> : <span className="text-xl font-bold">○</span>}
                    </button>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-snug">
                        {isHindi ? dose.medicineHindiName : dose.medicineName}
                      </h4>
                      <p className="text-sm font-semibold text-slate-600">
                        {dose.time} · {dose.dosage}
                        {isTaken && dose.takenAt && (
                          <span className="text-emerald-700 ml-1.5 font-bold">
                            ({isHindi ? `${dose.takenAt} पर ली` : `Taken at ${dose.takenAt}`})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {!isTaken && (
                    <button
                      onClick={() => markDoseTaken(dose.id, 'Papa')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-sm active:scale-95 transition-all"
                    >
                      {isHindi ? 'ले ली' : 'Take'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info & Dignity Notice */}
        <div className="pt-2 text-center text-xs text-slate-600 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isHindi ? 'आपका डेटा सुरक्षित है · कोई विज्ञापन नहीं' : 'Safe & Private · No Ads'}</span>
          </p>
          <p className="text-[11px] text-slate-600">
            {isHindi ? 'दवाई याद रहे, परिवार के साथ' : 'Dawai yaad rahe, parivaar ke saath'}
          </p>
        </div>
      </div>
    </div>
  );
};
