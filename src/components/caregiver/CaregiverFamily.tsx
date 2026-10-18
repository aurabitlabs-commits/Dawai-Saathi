import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import {
  Check,
  ChevronRight,
  Plus,
  QrCode,
  Shield,
  Smartphone,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

export const CaregiverFamily: React.FC = () => {
  const { familyMembers, elder, language } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');

  const isHindi = language === 'hi';

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    soundService.playSuccessChime();
    setShowInviteModal(false);
    setInviteName('');
    setInvitePhone('');
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          {isHindi ? 'परिवार के सदस्य' : 'Family Members'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage who can see alerts and manage the account
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Pairing Elder Device Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wide flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isHindi ? 'दादू का फोन पेयरिंग' : 'Elder Phone Pairing'}</span>
            </span>
            <h3 className="text-base font-extrabold">
              {isHindi ? 'पेयरिंग कोड:' : 'Pairing Code:'} <span className="text-amber-300 font-mono tracking-widest">{elder.pairingCode}</span>
            </h3>
            <p className="text-[11px] text-blue-100">
              दादू के फोन पर यह कोड डालें या QR कोड स्कैन करें
            </p>
          </div>
          <button
            onClick={() => setShowPairingModal(true)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors shrink-0"
            title="QR Code देखें"
          >
            <QrCode className="w-6 h-6" />
          </button>
        </div>

        {/* Family Members List matching Storyboard Screen 2 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>सक्रिय सदस्य ({familyMembers.length})</span>
            <span>रोल व अनुमतियाँ</span>
          </div>

          {familyMembers.map(member => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg overflow-hidden shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    {member.isAdmin && (
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {member.phone}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {member.relation}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>

        {/* + Add Family Member Button matching Storyboard Screen 2 */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full py-3.5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>{isHindi ? '+ परिवार के अन्य सदस्य जोड़ें' : '+ Add Family Member'}</span>
        </button>

        {/* Safety & Care note */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
          <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>परिवार का साथ, हर कदम पर</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            जब कोई दवा छूटती है, तो सबसे पहले प्राथमिक केयरगिवर को पुश अलर्ट जाता है। यदि 15 मिनट तक कोई दावा नहीं किया जाता, तो यह स्वतः दूसरे परिवारजनों को एस्केलेट होता है ताकि कई लोग एक साथ परेशान न हों।
          </p>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                परिवार के सदस्य को जोड़ें
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  नाम (Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. अंकुर (चाचाजी)"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मोबाइल नंबर (Mobile Number)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={invitePhone}
                  onChange={e => setInvitePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm"
                >
                  आमंत्रण लिंक भेजें
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Pairing Modal */}
      {showPairingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-xl font-black text-slate-900">
              दादू के फोन से स्कैन करें
            </h3>
            <p className="text-xs text-slate-500">
              दादू के फोन में Dawai Saathi ऐप खोलें और यह QR स्कैन करें
            </p>

            {/* Stylized QR Code Box */}
            <div className="w-48 h-48 mx-auto p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-inner">
              <QrCode className="w-32 h-32 text-slate-800" />
              <span className="text-xs font-mono font-bold text-slate-600 mt-2">
                CODE: {elder.pairingCode}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 font-semibold">
              यह कोड 24 घंटे तक मान्य रहेगा
            </div>

            <button
              onClick={() => setShowPairingModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
