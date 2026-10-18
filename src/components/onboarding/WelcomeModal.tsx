import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { Role } from '../../types';
import { Check, ChevronRight, Heart, Phone, ShieldCheck, UserCheck, Users } from 'lucide-react';

export const WelcomeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { setRole, role, language, setLanguage } = useApp();
  const [step, setStep] = useState<'welcome' | 'role_select' | 'login' | 'otp'>('welcome');
  const [selectedRole, setSelectedRole] = useState<Role>(role);
  const [phone, setPhone] = useState('98765 43210');
  const [otp, setOtp] = useState(['4', '8', '2', '9']);

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  const handleStartRoleSelect = () => {
    soundService.playBellChime();
    setStep('role_select');
  };

  const handleRoleChosen = (chosen: Role) => {
    setSelectedRole(chosen);
    setRole(chosen);
    if (chosen === 'elder') {
      soundService.playSuccessChime();
      onClose();
    } else {
      setStep('login');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playSuccessChime();
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    soundService.playSuccessChime();
    setRole(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[95vh] overflow-y-auto">
        {/* Step 1: Welcome Screen matching Storyboard Screen 1 */}
        {step === 'welcome' && (
          <div className="p-6 flex flex-col items-center text-center">
            {/* Logo lockup matching Storyboard */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  Dawai Saathi
                </h1>
                <p className="text-[11px] font-bold text-emerald-800">
                  दवाई याद रहे, परिवार के साथ
                </p>
              </div>
            </div>

            {/* Warm Multigenerational Indian Family Hero Illustration */}
            <div className="my-3 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
<<<<<<< HEAD
                src="/images/dawai_saathi_family_hero_1792322618126.jpg"
=======
                src="/src/assets/images/dawai_saathi_family_hero_1792322618126.jpg"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
                alt="Dawai Saathi Family"
                className="w-full h-52 object-cover"
              />
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-2">
              {isHindi ? 'बड़ों के लिए आसान, परिवार के लिए भरोसेमंद' : 'Simple for the elder. Powerful for the family.'}
            </h2>

            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {isHindi
                ? 'बड़ी लिखावट, स्पष्ट हिंदी आवाज़ और यदि कोई खुराक छूटे तो तुरंत परिवार को सूचना।'
                : 'Hindi voice reminders, large text, and instant family alerts if a dose is missed.'}
            </p>

            {/* 3 Core Value Props matching Storyboard top */}
            <div className="grid grid-cols-3 gap-2 my-4 w-full">
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/60 text-center">
                <span className="text-base">📢</span>
                <p className="text-[10px] font-bold text-amber-950 mt-1">हिंदी आवाज़</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-xl border border-blue-200/60 text-center">
                <span className="text-base">👨‍👩‍👧</span>
                <p className="text-[10px] font-bold text-blue-950 mt-1">फैमिली अलर्ट</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200/60 text-center">
                <span className="text-base">🛡️</span>
                <p className="text-[10px] font-bold text-emerald-950 mt-1">सुरक्षित व निजी</p>
              </div>
            </div>

            <button
              onClick={handleStartRoleSelect}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-lg shadow-lg shadow-blue-600/25 transition-all"
            >
              शुरू करें (Get Started)
            </button>

            <button
              onClick={() => {
                setRole('elder');
                onClose();
              }}
              className="mt-3 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              सीधे ऐप देखें (Skip to Demo)
            </button>
          </div>
        )}

        {/* Step 2: Role Selection matching Storyboard Screen 1 */}
        {step === 'role_select' && (
          <div className="p-6 flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              Select Your Role
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              कौन उपयोग कर रहा है? अपनी भूमिका चुनें:
            </p>

            <div className="space-y-3 mt-5 flex-1">
              {/* Option 1: Elder */}
              <button
                type="button"
                onClick={() => handleRoleChosen('elder')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all ${
                  selectedRole === 'elder'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shrink-0">
                  👴
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Elder (बुजुर्ग / पापा-मम्मी)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    मैं अपनी दवाई का रिमाइंडर पाना चाहता/चाहती हूँ। (बड़ा टेक्स्ट व आवाज़)
                  </p>
                </div>
              </button>

              {/* Option 2: Primary Caregiver */}
              <button
                type="button"
                onClick={() => handleRoleChosen('caregiver')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all ${
                  selectedRole === 'caregiver'
                    ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl shrink-0">
                  👩‍💼
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Primary Caregiver (बेटा / बेटी)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    मैं दवाई शेड्यूल सेट करना और अलर्ट्स पाना चाहता/चाहती हूँ।
                  </p>
                </div>
              </button>

              {/* Option 3: Co-caregiver */}
              <button
                type="button"
                onClick={() => handleRoleChosen('co_caregiver')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all ${
                  selectedRole === 'co_caregiver'
                    ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-2xl shrink-0">
                  🧑‍🤝‍🧑
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Co-caregiver (भाई / बहन / जीवनसाथी)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    मैं अलर्ट्स देखना और जरूरत पड़ने पर मार्क करना चाहता/चाहती हूँ।
                  </p>
                </div>
              </button>

              {/* Option 4: Attendant */}
              <button
                type="button"
                onClick={() => handleRoleChosen('attendant')}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all ${
                  selectedRole === 'attendant'
                    ? 'border-blue-500 bg-blue-50/60 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl shrink-0">
                  🧑‍⚕️
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Attendant (देखभालकर्ता / सहायक)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    मैं दवाई देने का रिकॉर्ड दर्ज करना चाहता/चाहती हूँ।
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep('welcome')}
              className="mt-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 text-center"
            >
              ← वापस जाएं (Back)
            </button>
          </div>
        )}

        {/* Step 3: Family Login matching Storyboard Screen 1 */}
        {step === 'login' && (
          <div className="p-6 flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              Family Login / Signup
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              अपने मोबाइल नंबर से लॉगिन या साइनअप करें:
            </p>

            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाइल नंबर (Mobile Number)
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3.5 py-3 bg-slate-100 text-sm font-bold text-slate-700 border-r border-slate-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 px-4 py-3 text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
              >
                OTP भेजें (Send OTP)
              </button>
            </form>

            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-900">
                Your data is safe with us
              </h4>
              <p className="text-[11px] text-slate-500">
                DPDP Act 2023 अनुरूप · डेटा पूर्णतः एन्क्रिप्टेड है
              </p>
            </div>

            <button
              onClick={() => setStep('role_select')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 text-center"
            >
              ← रोल बदलें
            </button>
          </div>
        )}

        {/* Step 4: OTP Verification */}
        {step === 'otp' && (
          <div className="p-6 flex flex-col text-center">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              OTP दर्ज करें
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              +91 {phone} पर भेजा गया 4-अंकीय कोड डालें:
            </p>

            <div className="flex justify-center gap-3 my-6">
              {otp.map((digit, index) => (
                <div
                  key={index}
                  className="w-12 h-14 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-900 font-black text-2xl flex items-center justify-center shadow-xs"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              सत्यापित करें (Continue to App)
            </button>

            <button
              onClick={() => setStep('login')}
              className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              ← नंबर बदलें
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
