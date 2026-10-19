import React from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import {
  History,
  Users,
  FileText,
  Volume2,
  Shield,
  Smartphone,
  PhoneCall,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';

interface CaregiverMoreProps {
  onTabChange: (tab: string) => void;
  onOpenInstall?: () => void;
}

export const CaregiverMore: React.FC<CaregiverMoreProps> = ({ onTabChange, onOpenInstall }) => {
  const { elder, language, speakPrompt, triggerSimulatedReminder } = useApp();
  const isHindi = language === 'hi';

  const handleTestAudio = () => {
    soundService.playBellChime();
    speakPrompt(
      'नमस्ते! यह दवाई साथी का आवाज़ टेस्ट है। आवाज़ बिल्कुल स्पष्ट है।',
      'Namaste! This is Dawai Saathi audio test. Audio is clear.'
    );
  };

  return (
    <div className="flex flex-col min-h-full pb-28">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          {isHindi ? 'अधिक विकल्प व सेटिंग्स' : 'More Options & Settings'}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {isHindi
            ? 'दवाई इतिहास, परिवार सदस्य और ऐप प्राथमिकताएं'
            : 'Adherence history, family members, and app preferences'}
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Patient Profile Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={elder.photo || '/images/elder_dadaji_avatar_1792322618648.jpg'}
              alt={elder.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isHindi ? 'मरीज का विवरण' : 'Patient Profile'}
              </p>
              <h2 className="text-base font-bold text-slate-900">
                {elder.honorific} {elder.name} (उम्र {elder.age})
              </h2>
              <p className="text-xs text-slate-600">
                {isHindi ? 'प्राथमिक भाषा:' : 'Primary language:'} {elder.language === 'hi' ? 'हिंदी (Hindi)' : 'English'}
              </p>
            </div>
          </div>
        </div>

        {/* Core Nav Options: Install, History & Family */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {/* 0. Install on Phone */}
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/60 transition-colors text-left bg-emerald-50/30"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
                  <Smartphone className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    <span>{isHindi ? '📱 फोन में ऐप इंस्टॉल करें (PWA / APK)' : 'Install App on Phone'}</span>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                      {isHindi ? 'गाइड' : 'Guide'}
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    {isHindi
                      ? 'Android Chrome, iPhone Safari या QR कोड से सीधे इंस्टॉल करें'
                      : 'Step-by-step instructions for Android, iOS & QR code'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-700" />
            </button>
          )}

          {/* 1. Medication History */}
          <button
            onClick={() => onTabChange('history')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'दवाई इतिहास व अनुपालन रिपोर्ट' : 'Medication History & Adherence'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'मासिक 94% रिकॉर्ड, डॉक्टर शेयरिंग व ऑडिट लॉग' : 'Monthly report, adherence score & audit log'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* 2. Family & Caregiver Team */}
          <button
            onClick={() => onTabChange('family')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'परिवार व देखभालकर्ता (Family Caregivers)' : 'Family & Caregiver Team'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'अमित, डॉ. वर्मा और आपातकालीन संपर्क' : 'Caregiver roles, primary attendant & emergency contact'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* 3. Audio & Voice Settings */}
          <button
            onClick={handleTestAudio}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'आवाज़ व अलार्म टेस्ट' : 'Voice & Reminder Sound Test'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'हिंदी आवाज़ और घंटी की आवाज़ सुनकर जांचें' : 'Test Hindi speech synthesis and reminder bells'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              {isHindi ? 'टेस्ट करें' : 'Test'}
            </span>
          </button>
        </div>

        {/* Doctor & Emergency Quick Contacts */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isHindi ? 'आपातकालीन व डॉक्टर संपर्क' : 'Emergency & Doctor Contacts'}</span>
            </h3>
          </div>
          <div className="space-y-2 mt-2">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200/70 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">डॉ. राजीव वर्मा (हृदय रोग विशेषज्ञ)</p>
                <p className="text-[11px] text-slate-500">Max Super Speciality Hospital · +91 98100 45678</p>
              </div>
              <a
                href="tel:+919810045678"
                className="px-2.5 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors"
              >
                कॉल करें
              </a>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200/70 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">आपातकालीन एम्बुलेंस (National Emergency)</p>
                <p className="text-[11px] text-slate-500">टोल-फ्री 108 / 112</p>
              </div>
              <a
                href="tel:112"
                className="px-2.5 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg hover:bg-red-800 transition-colors"
              >
                112
              </a>
            </div>
          </div>
        </div>

        {/* Privacy & Safe Operation Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>{isHindi ? 'डेटा गोपनीयता व सुरक्षा' : 'Data Privacy & Security'}</span>
          </div>
          <p className="leading-relaxed">
            {isHindi
              ? 'दवाई साथी आपके परिवार का व्यक्तिगत मेडिकल डेटा केवल आपके अधिकृत उपकरणों पर ही साझा करता है। कोई विज्ञापन नहीं, कोई तृतीय-पक्ष ट्रैकर नहीं।'
              : 'Dawai Saathi only shares your family medication data between authorized caregiver devices. Zero ads, zero trackers.'}
          </p>
        </div>
      </div>
    </div>
  );
};
