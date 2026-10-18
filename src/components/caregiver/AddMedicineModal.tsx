import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMMON_INDIAN_MEDICINES } from '../../data/initialData';
import { MealRelation, MedicineForm, PillAppearance } from '../../types';
import { PillImagePicker } from './PillImagePicker';
import { Clock, Edit3, Mic, Pill, Plus, X } from 'lucide-react';

export const AddMedicineModal: React.FC = () => {
  const {
    showAddMedicine,
    setShowAddMedicine,
    editingMedicine,
    setEditingMedicine,
    addNewMedicine,
    updateExistingMedicine,
    language,
  } = useApp();

  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [form, setForm] = useState<MedicineForm>('tablet');
  const [strength, setStrength] = useState('5mg');
  const [time, setTime] = useState('08:00 AM');
  const [mealRelation, setMealRelation] = useState<MealRelation>('after');
  const [stockDays, setStockDays] = useState(15);
  const [notes, setNotes] = useState('Khaane ke baad (After food)');
  const [important, setImportant] = useState(true);
  const [stripImage, setStripImage] = useState<string | undefined>(undefined);
  const [pillAppearance, setPillAppearance] = useState<PillAppearance | undefined>({
    shape: 'round',
    primaryColor: '#ffffff',
    colorLabelHi: 'सफेद',
    colorLabelEn: 'White',
    shapeLabelHi: 'गोल गोली',
    shapeLabelEn: 'Round Tablet',
    imprintText: '',
  });
  const [isListening, setIsListening] = useState(false);

  const isEditing = !!editingMedicine;
  const isHindi = language === 'hi';

  // Load existing medicine data when opened in edit mode
  useEffect(() => {
    if (editingMedicine) {
      setName(editingMedicine.name);
      setHindiName(editingMedicine.hindiName);
      setDosage(editingMedicine.dosage);
      setForm(editingMedicine.form);
      setStrength(editingMedicine.strength);
      setTime(editingMedicine.time);
      setMealRelation(editingMedicine.mealRelation);
      setStockDays(editingMedicine.stockDays);
      setNotes(editingMedicine.notes || '');
      setImportant(editingMedicine.important);
      setStripImage(editingMedicine.stripImage);
      setPillAppearance(
        editingMedicine.pillAppearance || {
          shape: editingMedicine.form === 'capsule' ? 'capsule' : 'round',
          primaryColor: '#ffffff',
          colorLabelHi: 'सफेद',
          colorLabelEn: 'White',
          shapeLabelHi: 'गोल गोली',
          shapeLabelEn: 'Round Tablet',
        }
      );
    } else {
      // Reset form
      setName('');
      setHindiName('');
      setDosage('1 Tablet');
      setForm('tablet');
      setStrength('5mg');
      setTime('08:00 AM');
      setMealRelation('after');
      setStockDays(15);
      setNotes('Khaane ke baad (After food)');
      setImportant(true);
      setStripImage(undefined);
      setPillAppearance({
        shape: 'round',
        primaryColor: '#ffffff',
        colorLabelHi: 'सफेद',
        colorLabelEn: 'White',
        shapeLabelHi: 'गोल गोली',
        shapeLabelEn: 'Round Tablet',
      });
    }
  }, [editingMedicine, showAddMedicine]);

  if (!showAddMedicine) return null;

  const handleClose = () => {
    setEditingMedicine(null);
    setShowAddMedicine(false);
  };

  const handleSelectPreset = (item: typeof COMMON_INDIAN_MEDICINES[0]) => {
    setName(item.name);
    setHindiName(item.hindi);
    setForm(item.form);
    setNotes(`${item.for} · Khaane ke baad`);

    // Assign appropriate visual preset based on medicine
    if (item.name.toLowerCase().includes('amlodipine')) {
      setStripImage('/images/medicine_pill_white_round_1792323535639.jpg');
      setPillAppearance({
        shape: 'round',
        primaryColor: '#ffffff',
        colorLabelHi: 'सफेद',
        colorLabelEn: 'White',
        shapeLabelHi: 'छोटी गोल गोली (स्कोर लाइन)',
        shapeLabelEn: 'Small Round Tablet',
        imprintText: '5',
      });
    } else if (item.name.toLowerCase().includes('metformin')) {
      setStripImage('/images/medicine_strip_sample_1792322618845.jpg');
      setPillAppearance({
        shape: 'oval',
        primaryColor: '#ffffff',
        colorLabelHi: 'सफेद',
        colorLabelEn: 'White',
        shapeLabelHi: 'लंबी अंडाकार गोली',
        shapeLabelEn: 'Oblong Tablet',
        imprintText: '500',
      });
    } else if (item.name.toLowerCase().includes('vitamin d3')) {
      setStripImage('/images/medicine_pill_capsule_gold_1792323535542.jpg');
      setPillAppearance({
        shape: 'capsule',
        primaryColor: '#f59e0b',
        colorLabelHi: 'सुनहरा पारदर्शी',
        colorLabelEn: 'Golden Amber',
        shapeLabelHi: 'सॉफ्टजेल कैप्सूल',
        shapeLabelEn: 'Softgel Capsule',
      });
    } else if (item.name.toLowerCase().includes('atorvastatin')) {
      setStripImage(undefined);
      setPillAppearance({
        shape: 'oval',
        primaryColor: '#fed7aa',
        colorLabelHi: 'हल्का पीच',
        colorLabelEn: 'Light Peach',
        shapeLabelHi: 'अंडाकार गोली',
        shapeLabelEn: 'Oval Tablet',
        imprintText: '10',
      });
    } else {
      setStripImage(undefined);
      setPillAppearance({
        shape: item.form === 'capsule' ? 'capsule' : 'round',
        primaryColor: '#ffffff',
        colorLabelHi: 'सफेद',
        colorLabelEn: 'White',
        shapeLabelHi: item.form === 'capsule' ? 'कैप्सूल' : 'गोल गोली',
        shapeLabelEn: item.form === 'capsule' ? 'Capsule' : 'Round Tablet',
      });
    }
  };

  const handleMicSim = () => {
    setIsListening(true);
    setTimeout(() => {
      setName('Telmisartan 40mg');
      setHindiName('टेल्मिसार्टन 40mg (बी.पी.)');
      setNotes('Blood Pressure / बीपी · Khaane ke baad');
      setPillAppearance({
        shape: 'round',
        primaryColor: '#ffffff',
        colorLabelHi: 'सफेद',
        colorLabelEn: 'White',
        shapeLabelHi: 'गोल गोली',
        shapeLabelEn: 'Round Tablet',
        imprintText: '40',
      });
      setIsListening(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editingMedicine) {
      updateExistingMedicine({
        ...editingMedicine,
        name,
        hindiName: hindiName || name,
        dosage,
        form,
        strength,
        time,
        mealRelation,
        stockDays: Number(stockDays) || 15,
        totalStock: Number(stockDays) || 15,
        important,
        notes,
        stripImage,
        pillAppearance,
      });
    } else {
      addNewMedicine({
        name,
        hindiName: hindiName || name,
        dosage,
        form,
        strength,
        time,
        mealRelation,
        stockDays: Number(stockDays) || 15,
        totalStock: Number(stockDays) || 15,
        important,
        notes,
        stripImage,
        pillAppearance,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {isEditing ? (isHindi ? 'दवा व फ़ोटो संपादित करें' : 'Edit Medicine & Pill Visual') : (isHindi ? 'नई दवा जोड़ें' : 'Add Medicine')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Indian Medicine Suggestions (only in Add Mode) */}
        {!isEditing && (
          <div className="mt-3">
            <p className="text-xs font-bold text-slate-500 mb-1.5">
              आम भारतीय दवाइयाँ (Quick Presets):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_INDIAN_MEDICINES.slice(0, 5).map(item => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSelectPreset(item)}
                  className="text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Medicine Name with Mic input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              दवा का नाम (Medicine Name) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Amlodipine 5mg"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              />
              <button
                type="button"
                onClick={handleMicSim}
                className={`absolute right-2 top-2 p-1.5 rounded-lg ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-blue-600'
                }`}
                title="बोलकर लिखें"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-red-600 mt-1 font-semibold animate-pulse">
                सुन रहे हैं... (Listening...)
              </p>
            )}
          </div>

          {/* Hindi Name / Translation for Elder's Voice & Large display */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              हिंदी नाम व बीमारी (बड़ों को बोलने व दिखने के लिए)
            </label>
            <input
              type="text"
              value={hindiName}
              onChange={e => setHindiName(e.target.value)}
              placeholder="e.g. एम्लोडिपिन 5mg (बी.पी.)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PILL VISUAL IDENTIFIER & IMAGE GENERATOR */}
          <PillImagePicker
            stripImage={stripImage}
            pillAppearance={pillAppearance}
            onChange={({ stripImage: newImg, pillAppearance: newApp }) => {
              setStripImage(newImg);
              if (newApp) setPillAppearance(newApp);
            }}
            language={language}
          />

          {/* Dosage & Form */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मात्रा (Dosage)
              </label>
              <select
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1 Tablet">1 Tablet (गोली)</option>
                <option value="2 Tablets">2 Tablets</option>
                <option value="1/2 Tablet">1/2 Tablet</option>
                <option value="1 Capsule">1 Capsule</option>
                <option value="1 Spoon (5ml)">1 Spoon (5ml)</option>
                <option value="2 Drops">2 Drops</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                प्रकार (Form)
              </label>
              <select
                value={form}
                onChange={e => {
                  const f = e.target.value as MedicineForm;
                  setForm(f);
                  if (f === 'capsule' && pillAppearance?.shape !== 'capsule') {
                    setPillAppearance(prev => ({
                      ...(prev || {
                        primaryColor: '#f59e0b',
                        colorLabelHi: 'पीला',
                        colorLabelEn: 'Yellow',
                      }),
                      shape: 'capsule',
                      shapeLabelHi: 'कैप्सूल',
                      shapeLabelEn: 'Capsule',
                    }));
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tablet">Tablet (गोली)</option>
                <option value="capsule">Capsule (कैप्सूल)</option>
                <option value="syrup">Syrup (सिरप)</option>
                <option value="injection">Injection</option>
                <option value="drops">Drops</option>
              </select>
            </div>
          </div>

          {/* Time Picker & Meal Relation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                समय (Time)
              </label>
              <select
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="08:00 AM">08:00 AM (सुबह)</option>
                <option value="09:00 AM">09:00 AM (सुबह)</option>
                <option value="01:00 PM">01:00 PM (दोपहर)</option>
                <option value="05:00 PM">05:00 PM (शाम)</option>
                <option value="08:00 PM">08:00 PM (रात)</option>
                <option value="10:00 PM">10:00 PM (सोते समय)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                भोजन संबंध (Meal)
              </label>
              <select
                value={mealRelation}
                onChange={e => setMealRelation(e.target.value as MealRelation)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="after">खाने के बाद (After food)</option>
                <option value="before">खाने से पहले (Before food)</option>
                <option value="empty_stomach">खाली पेट (Empty stomach)</option>
                <option value="with">खाने के साथ (With food)</option>
              </select>
            </div>
          </div>

          {/* Stock Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                स्टॉक दिन (Stock Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={stockDays}
                onChange={e => setStockDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={important}
                  onChange={e => setImportant(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="text-xs font-bold text-red-900">
                  ज़रूरी दवा (Important / BP / Heart)
                </span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              नोट्स / निर्देश (Notes)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. पानी के साथ लें"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {isEditing
              ? (isHindi ? 'बदलाव सुरक्षित करें (Save Changes)' : 'Save Changes')
              : (isHindi ? 'सुरक्षित करें (Save Medicine)' : 'Save Medicine')}
          </button>
        </form>
      </div>
    </div>
  );
};
