import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Shield, Users, X } from 'lucide-react';

export const ElderPrivacyModal: React.FC = () => {
  const {
    showWhoCanSeeModal,
    setShowWhoCanSeeModal,
    elder,
    familyMembers,
    toggleSharing,
    language,
  } = useApp();

  if (!showWhoCanSeeModal) return null;

  const isHindi = language === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {isHindi ? 'परिवार व गोपनीयता' : 'Family & Privacy'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {isHindi ? 'मेरे साथ कौन जुड़ा है' : 'Who can see my medicines'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWhoCanSeeModal(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* DPDP Act Promise */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm">
          <p className="font-bold text-base mb-1">
            {isHindi ? 'आपकी गरिमा और नियंत्रण सर्वोपरि है' : 'Dignity & Privacy First'}
          </p>
          <p className="text-slate-700 leading-relaxed text-xs">
            {isHindi
              ? 'केवल आपके चुने हुए परिवार के सदस्य ही आपकी दवाई का समय देख सकते हैं ताकि कोई दवा न छूटे। कोई विज्ञापन नहीं है और आपका डेटा बेचा नहीं जाता।'
              : 'Only your chosen family members can see your medication schedule to ensure no dose is missed. No ads, and your data is never sold.'}
          </p>
        </div>

        {/* Pause Sharing Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {isHindi ? 'शेयरिंग रोकें' : 'Pause Sharing'}
            </h4>
            <p className="text-xs text-slate-600">
              {isHindi ? 'अस्पताल में होने पर या जरूरत अनुसार रोकें' : 'Useful when in hospital or travelling'}
            </p>
          </div>
          <button
            onClick={() => toggleSharing(!elder.sharingPaused)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
              elder.sharingPaused ? 'bg-amber-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                elder.sharingPaused ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Connected Family Members List */}
        <div className="mt-5 space-y-3">
          <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
            {isHindi ? 'जुड़े हुए परिवार के सदस्य' : 'Connected Family Members'}
          </h4>

          {familyMembers.map(member => (
            <div
              key={member.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-base overflow-hidden shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div>
                  <h5 className="text-base font-bold text-slate-900 leading-tight">
                    {member.name}
                  </h5>
                  <p className="text-xs text-slate-500 font-medium">
                    {member.relation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" />
                <span>{isHindi ? 'कनेक्टेड' : 'Connected'}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowWhoCanSeeModal(false)}
          className="mt-6 w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors"
        >
          {isHindi ? 'समझ आ गया' : 'Understood'}
        </button>
      </div>
    </div>
  );
};
