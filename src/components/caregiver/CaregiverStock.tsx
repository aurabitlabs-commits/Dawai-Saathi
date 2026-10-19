import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { formatScheduleDate, getTodayDateString } from '../../utils/date';
import {
  AlertTriangle,
  Check,
  Copy,
  MessageSquare,
  Pill,
  Plus,
  Share2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  X,
} from 'lucide-react';

export const CaregiverStock: React.FC = () => {
  const { medicines, updateStock, elder, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [replenishModal, setReplenishModal] = useState<{ id: string; name: string } | null>(null);
  const [addedDays, setAddedDays] = useState(30);
  const [addedUnits, setAddedUnits] = useState(30);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const isHindi = language === 'hi';
  const todayDateStr = getTodayDateString();

  // Stock status classifications
  const runningOutMeds = medicines.filter(m => m.stockDays <= 3);
  const lowStockMeds = medicines.filter(m => m.stockDays > 3 && m.stockDays <= 7);
  const allNeedingRefill = medicines.filter(m => m.stockDays <= 7);

  const getStockStatus = (days: number) => {
    if (days <= 3) {
      return {
        labelHi: 'तुरंत रीफिल करें',
        labelEn: 'Running out',
        badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
        barClass: 'bg-rose-600',
        state: 'critical',
      };
    }
    if (days <= 7) {
      return {
        labelHi: 'कम स्टॉक',
        labelEn: 'Low stock',
        badgeClass: 'bg-amber-100 text-amber-950 border-amber-300',
        barClass: 'bg-amber-500',
        state: 'low',
      };
    }
    return {
      labelHi: 'पर्याप्त स्टॉक',
      labelEn: 'In stock',
      badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      barClass: 'bg-emerald-600',
      state: 'ok',
    };
  };

  const generateWhatsAppList = () => {
    const formattedDate = formatScheduleDate(todayDateStr, language);
    const patientName = `${elder.honorific || ''} ${elder.name}`.trim();

    const lines = [
      `*दवाइयों की रीफिल लिस्ट (SehatParivaar)*`,
      `मरीज: ${patientName} · ${formattedDate}`,
      `-----------------------------`,
      ...allNeedingRefill.map(
        m =>
          `• *${m.name}* (${m.hindiName || ''}) - ${m.dosage}\n   अनुमानित शेष: ${m.stockDays} दिन (${m.stockDays} खुराक) - कृपया 1 माह का पत्ता दें`
      ),
      `-----------------------------`,
      `केमिस्ट भैया, कृपया यह दवाइयाँ घर पर पहुँचा दें। धन्यवाद!`,
    ];
    return lines.join('\n');
  };

  const handleCopyWhatsApp = async () => {
    const text = generateWhatsAppList();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setCopyFeedback(isHindi ? 'WhatsApp लिस्ट कॉपी हो गई!' : 'WhatsApp list copied to clipboard!');
      soundService.playSuccessChime();
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback(null);
      }, 3000);
    } catch {
      setCopyFeedback(isHindi ? 'कॉपी नहीं हो सका, कृपया दोबारा प्रयास करें।' : 'Could not copy, please try again.');
    }
  };

  const handleOpenWhatsAppDirect = () => {
    const text = encodeURIComponent(generateWhatsAppList());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleOpenRefill = (med: { id: string; name: string }) => {
    setReplenishModal(med);
    setAddedDays(30);
    setAddedUnits(30);
    setBatchNumber('');
    setExpiryDate('');
  };

  const handleSaveStock = () => {
    if (replenishModal) {
      updateStock(replenishModal.id, addedDays);
      soundService.playSuccessChime();
      setReplenishModal(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-28 bg-[#FAF7F2]">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-amber-200/80 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900">
          {isHindi ? 'दवा स्टॉक व रीफिल प्रबंधन' : 'Medicine Stock & Refill'}
        </h1>
        <p className="text-xs text-slate-600 font-semibold mt-0.5">
          {isHindi
            ? 'दवा खत्म होने से 7 दिन पहले परिवार को रीफिल चेतावनी मिलती है'
            : 'Family is notified 7 days before medicine runs out'}
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* REFILL ALERT BANNER — Lists ALL medicines needing refill, not just one! */}
        {allNeedingRefill.length > 0 && (
          <section
            aria-label={isHindi ? 'रीफिल चेतावनी' : 'Refill Warning'}
            className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-200 text-amber-950 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-amber-950">
                    {isHindi
                      ? `${allNeedingRefill.length} दवाइयों का स्टॉक कम है`
                      : `${allNeedingRefill.length} medicines need restocking`}
                  </h2>
                  <p className="text-xs font-bold text-amber-800">
                    {elder.honorific || 'पापा'} के लिए समय पर नई स्ट्रिप मंगवाएं
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-black">
                {allNeedingRefill.length} {isHindi ? 'दवाइयाँ' : 'meds'}
              </span>
            </div>

            {/* List all items needing refill */}
            <div className="divide-y divide-amber-200/80 bg-white/80 rounded-2xl border border-amber-200 p-2 text-xs">
              {allNeedingRefill.map(m => (
                <div key={m.id} className="py-2 px-2 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900">{m.name}</span>
                    <span className="text-slate-500 ml-1.5">({m.dosage})</span>
                  </div>
                  <span
                    className={`font-black px-2 py-0.5 rounded ${
                      m.stockDays <= 3 ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {m.stockDays} {isHindi ? 'दिन बाकी' : 'days left'}
                  </span>
                </div>
              ))}
            </div>

            {/* WhatsApp Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyWhatsApp}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'लिस्ट कॉपी करें' : 'Copy List')}</span>
              </button>

              <button
                onClick={handleOpenWhatsAppDirect}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isHindi ? 'केमिस्ट को WhatsApp भेजें' : 'Send to Chemist'}</span>
              </button>
            </div>

            {copyFeedback && (
              <p className="text-xs font-bold text-center text-emerald-800 animate-in fade-in">
                {copyFeedback}
              </p>
            )}
          </section>
        )}

        {/* Medicines Stock List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
            <span>{isHindi ? 'सभी दवाइयों का वर्तमान स्टॉक' : 'All Medicine Stock Levels'}</span>
            <span>{medicines.length} {isHindi ? 'दवाइयाँ' : 'medicines'}</span>
          </div>

          {medicines.map(med => {
            const status = getStockStatus(med.stockDays);
            // Remaining quantity in tablets (calculated assuming 1 dose/day or frequency)
            const remainingUnits = med.stockDays;

            return (
              <div
                key={med.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200/90 shadow-2xs space-y-3 transition-all hover:border-amber-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-lg border-2 ${
                        status.state === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : status.state === 'low'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <Pill className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-slate-950 truncate">
                        {med.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold truncate">
                        {med.hindiName && <span>{med.hindiName} · </span>}
                        <span>{med.dosage}</span>
                        <span> · {med.time}</span>
                      </p>
                    </div>
                  </div>

                  {/* Stock State Badge */}
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl border shrink-0 ${status.badgeClass}`}
                  >
                    {isHindi ? status.labelHi : status.labelEn}
                  </span>
                </div>

                {/* Remaining quantity and days as distinct separate numbers */}
                <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider">
                      {isHindi ? 'अनुमानित गोलियां' : 'Tablets Remaining'}
                    </span>
                    <span className="text-base font-black text-slate-900 tabular-nums">
                      {remainingUnits} {isHindi ? 'गोलियां' : 'tablets'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 font-bold block uppercase text-[10px] tracking-wider">
                      {isHindi ? 'दिन बाकी' : 'Days Remaining'}
                    </span>
                    <span className={`text-base font-black tabular-nums ${
                      status.state === 'critical' ? 'text-rose-700' : status.state === 'low' ? 'text-amber-800' : 'text-emerald-700'
                    }`}>
                      {med.stockDays} {isHindi ? 'दिन' : 'days'}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5">
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${status.barClass}`}
                      style={{ width: `${Math.min(100, Math.max(8, (med.stockDays / 30) * 100))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">0</span>
                    <button
                      onClick={() => handleOpenRefill({ id: med.id, name: med.name })}
                      className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isHindi ? 'नया स्टॉक जोड़ें (रीफिल)' : 'Record Refill'}</span>
                    </button>
                    <span className="text-slate-400 font-bold">30+ {isHindi ? 'दिन' : 'days'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Record Refill Quantity & Details Modal */}
      {replenishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-emerald-600 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-black text-slate-900">
                  {replenishModal.name} {isHindi ? 'का रीफिल' : 'Refill'}
                </h3>
              </div>
              <button
                onClick={() => setReplenishModal(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-semibold">
              {isHindi
                ? 'नई स्ट्रिप या बोतल खरीदी गई है? रीफिल की मात्रा और बैच विवरण दर्ज करें:'
                : 'Enter refill quantity and optional batch/expiry details:'}
            </p>

            {/* Quick Days Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isHindi ? 'कितने दिनों का स्टॉक बढ़ाना है:' : 'Days to add:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 60].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setAddedDays(days);
                      setAddedUnits(days);
                    }}
                    className={`py-2 rounded-xl font-black text-xs border transition-all ${
                      addedDays === days
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    +{days} {isHindi ? 'दिन' : 'days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Batch and Expiry Inputs */}
            <div className="space-y-2 pt-1 border-t border-stone-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {isHindi ? 'बैच नंबर (वैकल्पिक)' : 'Batch Number (optional)'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. B-9428"
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {isHindi ? 'एक्सपायरी डेट (वैकल्पिक)' : 'Expiry Date (optional)'}
                </label>
                <input
                  type="month"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleSaveStock}
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-sm shadow-xs transition-colors"
              >
                {isHindi ? 'रीफिल सुरक्षित करें' : 'Save Refill'}
              </button>
              <button
                onClick={() => setReplenishModal(null)}
                className="py-3 px-4 bg-stone-200 hover:bg-stone-300 text-slate-800 font-bold rounded-xl text-sm transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
