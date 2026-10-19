import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Share2,
  Download,
  Check,
  Copy,
  X,
  ExternalLink,
  QrCode,
  Sparkles,
  Apple,
  Terminal,
} from 'lucide-react';
import { soundService } from '../../utils/audio';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}> = ({ isOpen, onClose, language = 'hi' }) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'capacitor' | 'qr'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);

  const isHindi = language === 'hi';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sehatparivaar.app';

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      soundService.playSuccessChime();
    }
    setDeferredPrompt(null);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    soundService.playSuccessChime();
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `दवाई साथी (SehatParivaar) ऐप अपने फोन में खोलने और इंस्टॉल करने के लिए इस लिंक पर टैप करें:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Simple clean SVG QR code pattern representing the app URL
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&color=047857&bgcolor=FAF7F2&margin=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border-2 border-amber-300 flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200 block">
                {isHindi ? 'मोबाइल टेस्टिंग व इंस्टॉलेशन' : 'Mobile Installation'}
              </span>
              <h2 id="install-modal-title" className="text-xl sm:text-2xl font-black leading-tight">
                {isHindi ? 'अपने फोन में ऐप कैसे चलाएं' : 'Install App on Your Phone'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/30"
            aria-label={isHindi ? 'बंद करें' : 'Close'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1 text-slate-900">
          {/* 1-Click Native Install Banner if browser supports beforeinstallprompt */}
          {deferredPrompt && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 p-4 rounded-2xl shadow-md border-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-base font-black flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-950" />
                  <span>{isHindi ? '1-क्लिक सीधा इंस्टॉल उपलब्ध है!' : '1-Click Direct Install Ready!'}</span>
                </p>
                <p className="text-xs font-bold text-amber-950 mt-0.5">
                  {isHindi
                    ? 'ब्राउज़र बार हटाकर ऐप को सीधे होम स्क्रीन पर लगाएं।'
                    : 'Add to home screen instantly without browser bars.'}
                </p>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-900 font-black text-sm shrink-0 flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'अभी इंस्टॉल करें' : 'Install Now'}</span>
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="bg-emerald-100 border-2 border-emerald-300 text-emerald-950 p-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold">
              <Check className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                {isHindi
                  ? 'ऐप पहले से ही स्टैंडअलोन मोड में सफलतापूर्वक स्थापित है!'
                  : 'App is already running in standalone installed mode!'}
              </span>
            </div>
          )}

          {/* Quick Share Link & QR Banner */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                {isHindi ? 'फोन पर तुरंत खोलें' : 'Open Link on Phone'}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {isHindi ? 'कोई ऐप स्टोर आवश्यक नहीं' : 'No App Store Needed'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 truncate select-all"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Platform Tab Buttons */}
          <div className="flex rounded-xl bg-stone-200/80 p-1 gap-1 text-xs font-bold">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activePlatform === 'android'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🤖</span>
              <span>Android (Chrome)</span>
            </button>
            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activePlatform === 'ios'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🍎</span>
              <span>iPhone (Safari)</span>
            </button>
            <button
              onClick={() => setActivePlatform('qr')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activePlatform === 'qr'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>📷</span>
              <span>QR कोड</span>
            </button>
            <button
              onClick={() => setActivePlatform('capacitor')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activePlatform === 'capacitor'
                  ? 'bg-white text-emerald-900 shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>⚡</span>
              <span>APK Build</span>
            </button>
          </div>

          {/* TAB 1: ANDROID INSTRUCTIONS */}
          {activePlatform === 'android' && (
            <div className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                  1
                </span>
                <span>{isHindi ? 'Android फोन पर PWA इंस्टॉल करने के 3 आसान कदम:' : '3 Easy Steps on Android:'}</span>
              </h3>

              <ol className="space-y-3 text-sm text-slate-800">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="block text-slate-950 font-bold">
                      {isHindi ? 'अपने फोन के Google Chrome में यह लिंक खोलें' : 'Open in Google Chrome on your phone'}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isHindi ? 'ऊपर दिए बटन से लिंक WhatsApp पर भेजकर तुरंत फोन में खोल सकते हैं।' : 'Use WhatsApp button above to send the link to your phone.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="block text-slate-950 font-bold">
                      {isHindi ? 'ऊपर कोने में 3 डॉट्स (⋮) मेनू पर टैप करें' : 'Tap the 3 dots (⋮) menu in top right'}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isHindi ? 'क्रोम के ऊपरी दाएं कोने में तीन बिंदु होते हैं।' : 'Chrome menu opens showing browser options.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="block text-slate-950 font-bold">
                      {isHindi ? "'Install app' या 'Add to Home screen' (होम स्क्रीन पर जोड़ें) चुनें" : "Select 'Install app' or 'Add to Home screen'"}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isHindi
                        ? 'पुष्टि करते ही सेहत परिवार का आइकन आपके फोन की होम स्क्रीन पर आ जाएगा और ऐप असली ऐप की तरह बिना ब्राउज़र यूआरएल बार के खुलेगी।'
                        : 'The app icon appears on your home screen and launches full-screen like a native app.'}
                    </span>
                  </div>
                </li>
              </ol>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                💡 <strong>बुजुर्गों के लिए फायदा:</strong> एक बार होम स्क्रीन पर आइकन आने के बाद दादू को कोई ब्राउज़र या लिंक याद नहीं रखना पड़ता—सीधे ऐप आइकन पर दबाते ही बड़े अक्षरों वाला दवाई रिमाइंडर खुल जाता है।
              </div>
            </div>
          )}

          {/* TAB 2: IPHONE / IOS INSTRUCTIONS */}
          {activePlatform === 'ios' && (
            <div className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-900" />
                <span>{isHindi ? 'iPhone / iPad (Safari) पर कैसे लगाएं:' : 'How to install on iPhone (Safari):'}</span>
              </h3>

              <ol className="space-y-3 text-sm text-slate-800">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="block text-slate-950 font-bold">
                      {isHindi ? 'यह लिंक iPhone के Safari ब्राउज़र में खोलें' : 'Open this link in Apple Safari'}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isHindi ? 'iOS पर होम स्क्रीन पर ऐप लगाने की सुविधा केवल Safari में उपलब्ध है।' : 'Safari is required for iOS Home Screen installation.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="block text-slate-950 font-bold">
                      {isHindi ? 'स्क्रीन के नीचे बीच में शेयर बटन (⬆) दबाएं' : 'Tap the Share icon (square with arrow ⬆) at bottom'}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isHindi ? 'यह सफारी के बॉटम टूलबार में नीले रंग का बॉक्स होता है।' : 'Located at the bottom center of the Safari browser.'}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="block text-slate-950 font-bold">
                      {isHindi ? "नीचे स्क्रॉल करें और 'Add to Home Screen' (होम स्क्रीन में जोड़ें) दबाएं" : "Scroll down and tap 'Add to Home Screen'"}
                    </strong>
                    <span className="text-xs text-slate-600">
                      {isHindi ? "फिर ऊपर दाईं ओर 'Add' पर टैप करें। बस काम हो गया!" : "Then tap 'Add' in top right. You're done!"}
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* TAB 3: QR CODE */}
          {activePlatform === 'qr' && (
            <div className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-2xs flex flex-col items-center text-center space-y-4">
              <h3 className="text-base font-black text-slate-900">
                {isHindi ? 'फोन का कैमरा कंप्यूटर स्क्रीन पर लाएं' : 'Scan with your phone camera'}
              </h3>
              <p className="text-xs text-slate-600 max-w-xs">
                {isHindi
                  ? 'अपने फोन के कैमरा या Google Lens से इस QR कोड को स्कैन करें और तुरंत ऐप खोलें।'
                  : 'Point your camera or QR scanner at the screen to open the app on your mobile device.'}
              </p>

              <div className="p-3 bg-[#FAF7F2] rounded-2xl border-2 border-emerald-600 shadow-md">
                <img
                  src={qrSvgUrl}
                  alt="QR code to open app on phone"
                  className="w-48 h-48 rounded-xl object-contain"
                />
              </div>

              <span className="text-xs font-mono text-slate-500 break-all max-w-sm px-2">
                {currentUrl}
              </span>
            </div>
          )}

          {/* TAB 4: CAPACITOR NATIVE APK */}
          {activePlatform === 'capacitor' && (
            <div className="bg-white p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-black">
                <Terminal className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base">
                  {isHindi ? 'Capacitor से Android APK तैयार करना' : 'Building Native Android APK with Capacitor'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'यदि आपको गूगल प्ले स्टोर या फोन पर बिना किसी इंटरनेट ब्राउज़र के ऑफलाइन अलार्म शेड्यूल करने के लिए नेटिव ऐप (.apk) चाहिए, तो टर्मिनल में ये कमांड चलाएं:'
                  : 'To build a native Android .apk bundle that triggers native device alarms offline via Capacitor:'}
              </p>

              <div className="space-y-2.5">
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto space-y-1.5">
                  <p className="text-slate-400"># 1. प्रोडक्शन वेब बिल्ड बनाएं</p>
                  <p className="font-bold text-white">npm run build</p>
                  <p className="text-slate-400 mt-2"># 2. कैपेसिटर Android फोल्डर जोड़ें और सिंक करें</p>
                  <p className="font-bold text-white">npx cap add android</p>
                  <p className="font-bold text-white">npx cap sync</p>
                  <p className="text-slate-400 mt-2"># 3. Android Studio में खोलकर फोन में सीधे चलाएं</p>
                  <p className="font-bold text-white">npx cap open android</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                <strong>ऑफलाइन अलार्म:</strong> कैपेसिटर में <code>@capacitor/local-notifications</code> प्लगइन के जरिए हर खुराक का अलार्म सीधे फोन के हार्डवेयर अलार्म क्लॉक में शेड्यूल हो जाता है, जिससे इंटरनेट न होने पर भी अलार्म बजता है।
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-xs"
          >
            {isHindi ? 'समझ गया / बंद करें' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
