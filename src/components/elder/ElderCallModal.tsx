import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { Phone, PhoneCall, PhoneOff, UserCheck, X } from 'lucide-react';

export const ElderCallModal: React.FC = () => {
  const { showCallModal, setShowCallModal, elder, language } = useApp();
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected'>('idle');

  if (!showCallModal) return null;

  const isHindi = language === 'hi';
  const contact = elder.emergencyContact;

  const handleStartCall = () => {
    soundService.playBellChime();
    setCallState('calling');

    setTimeout(() => {
      setCallState('connected');
    }, 2200);
  };

  const handleEndCall = () => {
    setCallState('idle');
    setShowCallModal(false);
  };

  return (
<<<<<<< HEAD
    <div role="dialog" aria-modal="true" aria-labelledby="call-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        {/* Header */}
        <h2 id="call-title" className="text-2xl font-extrabold text-slate-900">
          {isHindi ? 'परिवार से बात करें' : 'Call Family Member'}
        </h2>
        <p className="text-lg font-semibold text-slate-700 mt-1">
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100 flex flex-col items-center">
        {/* Header */}
        <h2 className="text-2xl font-black text-slate-900">
          {isHindi ? 'परिवार से बात करें' : 'Call Family Member'}
        </h2>
        <p className="text-sm font-semibold text-slate-500 mt-1">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          {isHindi ? 'एक टैप से सीधे परिवार को कॉल करें' : 'One tap direct call to family'}
        </p>

        {/* Contact Profile Photo & Info */}
        <div className="my-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-400 shadow-md"
            />
            {callState === 'calling' && (
              <span className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping opacity-75"></span>
            )}
          </div>

          <h3 className="text-2xl font-black text-slate-900 mt-3">
            {contact.name}
          </h3>
<<<<<<< HEAD
          <p className="text-xl font-bold text-blue-900">
=======
          <p className="text-base font-semibold text-blue-800">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
            {contact.phone}
          </p>

          {/* Call Status Indicator */}
          {callState === 'calling' && (
<<<<<<< HEAD
            <div className="mt-3 px-4 py-1.5 bg-blue-100 text-blue-900 font-bold rounded-full text-lg animate-pulse flex items-center gap-2">
=======
            <div className="mt-3 px-4 py-1.5 bg-blue-100 text-blue-900 font-bold rounded-full text-sm animate-pulse flex items-center gap-2">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>{isHindi ? 'कॉल मिल रहा है...' : 'Ringing...'}</span>
            </div>
          )}

          {callState === 'connected' && (
<<<<<<< HEAD
            <div className="mt-3 px-4 py-1.5 bg-emerald-100 text-emerald-900 font-bold rounded-full text-lg flex items-center gap-2">
=======
            <div className="mt-3 px-4 py-1.5 bg-emerald-100 text-emerald-900 font-bold rounded-full text-sm flex items-center gap-2">
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>{isHindi ? 'बात हो रही है (00:42)' : 'Connected (00:42)'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {callState === 'idle' ? (
            <button
              onClick={handleStartCall}
              className="w-full h-18 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all"
            >
              <Phone className="w-7 h-7" />
              <span>{isHindi ? 'अभी कॉल करें' : 'Call Now'}</span>
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="w-full h-18 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all"
            >
              <PhoneOff className="w-7 h-7" />
              <span>{isHindi ? 'कॉल समाप्त करें' : 'End Call'}</span>
            </button>
          )}

          <button
            onClick={() => {
              setCallState('idle');
              setShowCallModal(false);
            }}
<<<<<<< HEAD
            className="w-full min-h-[56px] text-lg font-bold text-slate-800 hover:text-slate-900"
=======
            className="w-full py-3.5 text-base font-bold text-slate-600 hover:text-slate-800"
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
