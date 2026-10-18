import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { AlertTriangle, Check, Copy, MessageSquare, Pill, Plus, Share2 } from 'lucide-react';

export const CaregiverStock: React.FC = () => {
  const { medicines, updateStock, language } = useApp();
  const [copied, setCopied] = useState(false);
  const [replenishModal, setReplenishModal] = useState<{ id: string; name: string } | null>(null);
  const [addedDays, setAddedDays] = useState(30);

  const isHindi = language === 'hi';

  const lowStockMeds = medicines.filter(m => m.stockDays <= 5);

  const generateWhatsAppList = () => {
    const lines = [
      `*दवाइयों की लिस्ट (Dawai Saathi)*`,
      `मरीज: रामकांत शर्मा (पापा) · 18 Oct 2026`,
      `-----------------------------`,
      ...medicines
        .filter(m => m.stockDays <= 7)
        .map(m => `• *${m.name}* - ${m.dosage} (${m.stockDays} दिन बाकी - कृपया 1 माह का पत्ता दें)`),
      `-----------------------------`,
      `केमिस्ट भैया, कृपया यह दवाइयाँ घर पर पहुँचा दें। धन्यवाद!`,
    ];
    return lines.join('\n');
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(generateWhatsAppList());
    setCopied(true);
    soundService.playSuccessChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStock = () => {
    if (replenishModal) {
      updateStock(replenishModal.id, addedDays);
      setReplenishModal(null);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          {isHindi ? 'दवा स्टॉक व रीफिल' : 'Medicine Stock & Refill'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          दवा खत्म होने से 5 दिन पहले परिवार को अलर्ट मिलता है
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Warning Banner matching Storyboard Screen 4 */}
        {lowStockMeds.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-200 text-amber-900 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-amber-950">
                {lowStockMeds[0].name} का स्टॉक कम है।
              </h2>
            </div>
            <p className="text-xs font-semibold text-amber-900 leading-relaxed">
              केवल {lowStockMeds[0].stockDays} दिन का बचा है। तुरंत केमिस्ट से नई स्ट्रिप ऑर्डर करें ताकि पापा की दवा न छूटे।
            </p>

            <button
              onClick={handleCopyWhatsApp}
              className="mt-2 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{copied ? 'WhatsApp संदेश कॉपी हो गया!' : 'WhatsApp पर केमिस्ट को लिस्ट भेजें'}</span>
            </button>
          </div>
        )}

        {/* Medicines Stock List matching Storyboard Screen 4 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>सभी दवाइयों का स्टॉक (Remaining Days)</span>
            <span>+ रीफिल जोड़ें</span>
          </div>

          {medicines.map(med => {
            const isCritical = med.stockDays <= 3;
            const isWarning = med.stockDays <= 7 && !isCritical;

            return (
              <div
                key={med.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <Pill className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {med.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {med.dosage} · {med.time}
                      </p>
                    </div>
                  </div>

                  {/* Days left pill */}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isCritical
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {med.stockDays} {isHindi ? 'दिन बाकी' : 'days left'}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (med.stockDays / 30) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>0 दिन</span>
                    <button
                      onClick={() => setReplenishModal({ id: med.id, name: med.name })}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>स्टॉक बढ़ाएं</span>
                    </button>
                    <span>30 दिन</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stock Replenish Modal */}
      {replenishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {replenishModal.name} का स्टॉक जोड़ें
            </h3>
            <p className="text-xs text-slate-500">
              नई स्ट्रिप या बोतल खरीदी गई है? कितने दिनों का स्टॉक बढ़ाना चाहते हैं:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setAddedDays(days)}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    addedDays === days
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  +{days} दिन
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleSaveStock}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm"
              >
                सुरक्षित करें
              </button>
              <button
                onClick={() => setReplenishModal(null)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
              >
                रद्द करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
