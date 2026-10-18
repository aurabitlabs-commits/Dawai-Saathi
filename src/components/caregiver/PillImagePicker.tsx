import React, { useRef, useState } from 'react';
import { PillAppearance, PillShape } from '../../types';
import { PillVisual } from '../common/PillVisual';
import { Camera, Check, Image as ImageIcon, Sparkles, Trash2, Upload, Wand2 } from 'lucide-react';

interface PillImagePickerProps {
  stripImage?: string;
  pillAppearance?: PillAppearance;
  onChange: (data: { stripImage?: string; pillAppearance?: PillAppearance }) => void;
  language?: 'hi' | 'en';
}

const COLOR_OPTIONS = [
  { hex: '#ffffff', labelHi: 'सफेद', labelEn: 'White', border: 'border-slate-300' },
  { hex: '#fbbf24', labelHi: 'पीला', labelEn: 'Yellow', border: 'border-amber-400' },
  { hex: '#fed7aa', labelHi: 'पीच', labelEn: 'Peach', border: 'border-orange-300' },
  { hex: '#38bdf8', labelHi: 'नीला', labelEn: 'Blue', border: 'border-sky-400' },
  { hex: '#f87171', labelHi: 'लाल', labelEn: 'Red', border: 'border-red-400' },
  { hex: '#34d399', labelHi: 'हरा', labelEn: 'Green', border: 'border-emerald-400' },
  { hex: '#c084fc', labelHi: 'बैंगनी', labelEn: 'Purple', border: 'border-purple-400' },
  { hex: '#78716c', labelHi: 'भूरा', labelEn: 'Brown', border: 'border-stone-400' },
];

const PRESETS = [
  {
    name: 'सफेद गोल गोली (बीपी)',
<<<<<<< HEAD
    stripImage: '/images/medicine_pill_white_round_1792323535639.jpg',
=======
    stripImage: '/src/assets/images/medicine_pill_white_round_1792323535639.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    appearance: {
      shape: 'round' as PillShape,
      primaryColor: '#ffffff',
      colorLabelHi: 'सफेद',
      colorLabelEn: 'White',
      shapeLabelHi: 'छोटी गोल गोली (स्कोर लाइन)',
      shapeLabelEn: 'Small Round Tablet',
      imprintText: '5',
    },
  },
  {
    name: 'सफेद लंबी गोली (शुगर)',
<<<<<<< HEAD
    stripImage: '/images/medicine_strip_sample_1792322618845.jpg',
=======
    stripImage: '/src/assets/images/medicine_strip_sample_1792322618845.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    appearance: {
      shape: 'oval' as PillShape,
      primaryColor: '#f8fafc',
      colorLabelHi: 'सफेद',
      colorLabelEn: 'White',
      shapeLabelHi: 'लंबी अंडाकार गोली',
      shapeLabelEn: 'Oblong Tablet',
      imprintText: '500',
    },
  },
  {
    name: 'सुनहरा कैप्सूल (विटामिन D)',
<<<<<<< HEAD
    stripImage: '/images/medicine_pill_capsule_gold_1792323535542.jpg',
=======
    stripImage: '/src/assets/images/medicine_pill_capsule_gold_1792323535542.jpg',
>>>>>>> 34007d1cb821c6c4f13dce955fdddedd39e1ea63
    appearance: {
      shape: 'capsule' as PillShape,
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      colorLabelHi: 'सुनहरा पारदर्शी',
      colorLabelEn: 'Golden Amber',
      shapeLabelHi: 'सॉफ्टजेल कैप्सूल',
      shapeLabelEn: 'Softgel Capsule',
    },
  },
  {
    name: 'लाल-पीला कैप्सूल (एंटीबायोटिक)',
    appearance: {
      shape: 'capsule' as PillShape,
      primaryColor: '#ef4444',
      secondaryColor: '#facc15',
      colorLabelHi: 'लाल-पीला',
      colorLabelEn: 'Red & Yellow',
      shapeLabelHi: 'दो-रंग का कैप्सूल',
      shapeLabelEn: 'Two-tone Capsule',
    },
  },
  {
    name: 'पीच अंडाकार गोली (कोलेस्ट्रॉल)',
    appearance: {
      shape: 'oval' as PillShape,
      primaryColor: '#fed7aa',
      colorLabelHi: 'हल्का पीच',
      colorLabelEn: 'Light Peach',
      shapeLabelHi: 'अंडाकार गोली',
      shapeLabelEn: 'Oval Tablet',
      imprintText: '10',
    },
  },
];

export const PillImagePicker: React.FC<PillImagePickerProps> = ({
  stripImage,
  pillAppearance,
  onChange,
  language = 'hi',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'generate' | 'photo' | 'presets'>('generate');

  const currentShape: PillShape = pillAppearance?.shape || 'round';
  const currentColor = pillAppearance?.primaryColor || '#ffffff';
  const currentSecondary = pillAppearance?.secondaryColor || '#ef4444';
  const currentImprint = pillAppearance?.imprintText || '';

  const isHindi = language === 'hi';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          stripImage: reader.result as string,
          pillAppearance: pillAppearance || {
            shape: 'round',
            primaryColor: '#ffffff',
            colorLabelHi: 'फ़ोटो युक्त',
            colorLabelEn: 'Photo Pill',
            shapeLabelHi: 'पत्ते/दवा की असली फ़ोटो',
            shapeLabelEn: 'Actual Pill Photo',
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShapeChange = (shape: PillShape) => {
    const shapeLabels: Record<PillShape, { hi: string; en: string }> = {
      round: { hi: 'गोल गोली', en: 'Round Tablet' },
      oval: { hi: 'लंबी अंडाकार गोली', en: 'Oblong Tablet' },
      capsule: { hi: 'कैप्सूल', en: 'Capsule' },
      liquid: { hi: 'सिरप / ड्रॉप्स', en: 'Liquid Drops' },
      strip: { hi: 'दवा का पत्ता', en: 'Blister Strip' },
    };

    const colorObj = COLOR_OPTIONS.find(c => c.hex === currentColor) || COLOR_OPTIONS[0];

    onChange({
      stripImage,
      pillAppearance: {
        shape,
        primaryColor: currentColor,
        secondaryColor: currentSecondary,
        colorLabelHi: colorObj.labelHi,
        colorLabelEn: colorObj.labelEn,
        shapeLabelHi: shapeLabels[shape].hi,
        shapeLabelEn: shapeLabels[shape].en,
        imprintText: currentImprint,
      },
    });
  };

  const handleColorChange = (hex: string, labelHi: string, labelEn: string) => {
    onChange({
      stripImage,
      pillAppearance: {
        shape: currentShape,
        primaryColor: hex,
        secondaryColor: currentSecondary,
        colorLabelHi: labelHi,
        colorLabelEn: labelEn,
        shapeLabelHi: pillAppearance?.shapeLabelHi || 'गोल गोली',
        shapeLabelEn: pillAppearance?.shapeLabelEn || 'Round Tablet',
        imprintText: currentImprint,
      },
    });
  };

  const handleImprintChange = (text: string) => {
    onChange({
      stripImage,
      pillAppearance: {
        ...(pillAppearance || {
          shape: 'round',
          primaryColor: '#ffffff',
          colorLabelHi: 'सफेद',
          colorLabelEn: 'White',
          shapeLabelHi: 'गोल गोली',
          shapeLabelEn: 'Round Tablet',
        }),
        imprintText: text,
      },
    });
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    onChange({
      stripImage: preset.stripImage,
      pillAppearance: preset.appearance,
    });
  };

  const handleRemovePhoto = () => {
    onChange({
      stripImage: undefined,
      pillAppearance,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
      {/* Header and Live Preview */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>दवा की पहचान फ़ोटो (Pill Visual for Seniors)</span>
          </label>
          <p className="text-[11px] text-slate-500">
            बुजुर्ग दवा देखकर तुरंत पहचान सकें
          </p>
        </div>

        {/* Live Pill Visual Preview */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
          <PillVisual
            stripImage={stripImage}
            pillAppearance={pillAppearance}
            size="md"
            language={language}
          />
          <div className="text-left pr-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              स्क्रीन पर दिखेगा:
            </p>
            <p className="text-xs font-extrabold text-slate-800 leading-tight">
              {pillAppearance?.colorLabelHi || 'सफेद'} {pillAppearance?.shapeLabelHi || 'गोली'}
            </p>
            {pillAppearance?.imprintText && (
              <p className="text-[10px] font-semibold text-slate-500">
                मार्किंग: {pillAppearance.imprintText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Visual Generator vs Camera Photo vs Quick Presets */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setTab('generate')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            tab === 'generate' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>रंग व आकार</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('photo')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            tab === 'photo' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>कैमरा / फ़ोटो</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('presets')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
            tab === 'presets' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>प्रीसेट्स</span>
        </button>
      </div>

      {/* Tab 1: Visual Pill Styler & Generator */}
      {tab === 'generate' && (
        <div className="space-y-3 pt-1">
          {/* Shape Selector */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
              1. दवा का आकार (Pill Shape):
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { shape: 'round' as PillShape, labelHi: 'गोल', labelEn: 'Round', icon: '⚪' },
                { shape: 'oval' as PillShape, labelHi: 'लंबी', labelEn: 'Oval', icon: '💊' },
                { shape: 'capsule' as PillShape, labelHi: 'कैप्सूल', labelEn: 'Capsule', icon: '💊' },
                { shape: 'liquid' as PillShape, labelHi: 'सिरप', labelEn: 'Drops', icon: '💧' },
                { shape: 'strip' as PillShape, labelHi: 'पत्ता', labelEn: 'Strip', icon: '📋' },
              ].map(item => (
                <button
                  key={item.shape}
                  type="button"
                  onClick={() => handleShapeChange(item.shape)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    currentShape === item.shape
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-extrabold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base block">{item.icon}</span>
                  <span className="text-[10px] mt-0.5 block">{isHindi ? item.labelHi : item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
              2. दवा का मुख्य रंग (Color):
            </span>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleColorChange(c.hex, c.labelHi, c.labelEn)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform relative flex items-center justify-center ${c.border} ${
                    currentColor === c.hex ? 'scale-110 ring-2 ring-blue-500 shadow-sm' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.labelHi}
                >
                  {currentColor === c.hex && (
                    <Check
                      className={`w-4 h-4 stroke-[3] ${
                        c.hex === '#ffffff' || c.hex === '#fbbf24' ? 'text-slate-800' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Markings / Imprint */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              3. गोली पर लिखा नंबर या स्कोर (Imprint/Score):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentImprint}
                onChange={e => handleImprintChange(e.target.value)}
                placeholder="e.g. 5, 500, या BP"
                maxLength={6}
                className="w-32 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 uppercase"
              />
              <span className="text-[11px] text-slate-500">
                (गोली की सतह पर उकेरा हुआ दिखेगा)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Camera & Photo Upload */}
      {tab === 'photo' && (
        <div className="space-y-3 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>कैमरे से फ़ोटो खींचें (Take Photo)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>गैलरी से चुनें</span>
            </button>
          </div>

          {stripImage && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={stripImage}
                  alt="Captured pill"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>फ़ोटो अपलोड हो गई</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    दादू के रिमाइंडर में यह फ़ोटो सबसे ऊपर दिखेगी
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="फ़ोटो हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Quick Indian Presets */}
      {tab === 'presets' && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold text-slate-500 mb-1">
            क्लिक करें और दवा का असली रूप अपने आप सेट हो जाएगा:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <PillVisual
                    stripImage={p.stripImage}
                    pillAppearance={p.appearance}
                    size="sm"
                    language={language}
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{p.name}</h5>
                    <p className="text-[10px] text-slate-500">{p.appearance.shapeLabelHi}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">
                  चुनें
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
