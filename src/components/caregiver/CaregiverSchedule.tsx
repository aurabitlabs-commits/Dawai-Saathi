import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, CheckCircle2, Clock, Plus, Trash2 } from 'lucide-react';

export const CaregiverSchedule: React.FC = () => {
  const { medicines, doses, setShowAddMedicine, markTakenByCaregiver, language } = useApp();
  const isHindi = language === 'hi';

  const [activeDateIndex, setActiveDateIndex] = useState(1); // Monday 20th Oct or Sunday 19th

  const weekDays = [
    { day: 'Sun', date: '19' },
    { day: 'Mon', date: '20' },
    { day: 'Tue', date: '21' },
    { day: 'Wed', date: '22' },
    { day: 'Thu', date: '23' },
    { day: 'Fri', date: '24' },
    { day: 'Sat', date: '25' },
  ];

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'दवाइयों का शेड्यूल' : 'Medicine Schedule'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Today, 18 Oct 2026
            </p>
          </div>

          <button
            onClick={() => setShowAddMedicine(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'दवा जोड़ें' : 'Add Medicine'}</span>
          </button>
        </div>

        {/* Date Strip matching Storyboard Screen 2 */}
        <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-1">
          {weekDays.map((item, index) => {
            const isSelected = index === activeDateIndex;
            return (
              <button
                key={item.date}
                onClick={() => setActiveDateIndex(index)}
                className={`flex flex-col items-center justify-center min-w-[42px] py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] opacity-80">{item.day}</span>
                <span className="text-sm font-bold mt-0.5">{item.date}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Medicines Schedule List */}
      <div className="p-5 space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>{medicines.length} दवाइयाँ सक्रिय (Active)</span>
          <span>समय अनुसार क्रमित</span>
        </div>

        {medicines.map((med, idx) => {
          const dose = doses.find(d => d.medicineId === med.id);
          const isTaken = dose?.status === 'taken';

          return (
            <div
              key={med.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                  isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {med.form === 'capsule' ? '💊' : '⚪'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                      {med.time}
                    </span>
                    {med.important && (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        ज़रूरी
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight mt-0.5">
                    {med.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {med.dosage} · {med.notes || 'खाने के बाद'}
                  </p>
                </div>
              </div>

              {/* Status or Mark Taken action */}
              <div>
                {isTaken ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <button
                    onClick={() => dose && markTakenByCaregiver(dose.id)}
                    className="w-8 h-8 rounded-full border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors"
                    title="मार्क करें"
                  >
                    <Check className="w-4 h-4 opacity-0 hover:opacity-100" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Prescription Reference Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
          <p className="font-bold text-slate-900 text-sm mb-1">
            डॉक्टर की पर्ची (Prescription Reference)
          </p>
          <p className="text-slate-600">
            डॉ. राजीव वर्मा (MD Med) · अगली विज़िट: 12 नवंबर 2026. सभी दवाइयाँ डॉक्टर की सलाह अनुसार ही दी जा रही हैं।
          </p>
        </div>
      </div>
    </div>
  );
};
