import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Download, FileText, Share2 } from 'lucide-react';

export const CaregiverHistory: React.FC = () => {
  const { language } = useApp();
  const [copied, setCopied] = useState(false);
  const isHindi = language === 'hi';

  const historyDays = [
    { day: 1, status: 'full' },
    { day: 2, status: 'full' },
    { day: 3, status: 'partial' },
    { day: 4, status: 'full' },
    { day: 5, status: 'full' },
    { day: 6, status: 'full' },
    { day: 7, status: 'full' },
    { day: 8, status: 'full' },
    { day: 9, status: 'full' },
    { day: 10, status: 'full' },
    { day: 11, status: 'full' },
    { day: 12, status: 'partial' },
    { day: 13, status: 'full' },
    { day: 14, status: 'full' },
    { day: 15, status: 'full' },
    { day: 16, status: 'full' },
    { day: 17, status: 'full' },
    { day: 18, status: 'current' }, // Today
    { day: 19, status: 'future' },
    { day: 20, status: 'future' },
    { day: 21, status: 'future' },
    { day: 22, status: 'future' },
    { day: 23, status: 'future' },
    { day: 24, status: 'future' },
    { day: 25, status: 'future' },
    { day: 26, status: 'future' },
    { day: 27, status: 'future' },
    { day: 28, status: 'future' },
    { day: 29, status: 'future' },
    { day: 30, status: 'future' },
    { day: 31, status: 'future' },
  ];

  const handleShareReport = () => {
    soundService.playSuccessChime();
    const text = `*दवाई साथी - मासिक अनुपालन रिपोर्ट (Dawai Saathi Report)*\nमरीज: रामकांत शर्मा (उम्र 68)\nअवधि: 1 - 18 अक्टूबर 2026\nसमय पर ली गईं: 94% (Adherence)\nछूटी हुई दवाइयाँ: 2 (तुरंत परिवार द्वारा कवर की गईं)\nडॉक्टर: डॉ. राजीव वर्मा\nडाउनलोड लिंक: https://dawaisaathi.in/report/849201`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'दवाइयों का इतिहास व रिपोर्ट' : 'Medicine History & Reports'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              पिछले 7 व 30 दिनों का अनुपालन रिकॉर्ड
            </p>
          </div>

          <button
            onClick={handleShareReport}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'कॉपी हो गया!' : 'डॉक्टर से शेयर'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Adherence Rate Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              अक्टूबर माह का अनुपालन (Monthly Adherence)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black tabular-nums">94%</span>
              <span className="text-xs text-emerald-100 font-medium">उत्कृष्ट (Excellent)</span>
            </div>
            <p className="text-[11px] text-emerald-100 mt-1">
              72 में से 68 दवाइयाँ समय पर ली गईं
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🏆
          </div>
        </div>

        {/* Calendar View matching Storyboard Screen 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <button className="p-1 text-slate-400 hover:text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">
              October 2026
            </h3>
            <button className="p-1 text-slate-400 hover:text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 pb-1">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {historyDays.map(item => {
              const isFull = item.status === 'full';
              const isPartial = item.status === 'partial';
              const isCurrent = item.status === 'current';

              return (
                <div
                  key={item.day}
                  className={`h-8 rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : isFull
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : isPartial
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'text-slate-300 bg-slate-50'
                  }`}
                >
                  <span>{item.day}</span>
                  {isFull && <span className="w-1 h-1 rounded-full bg-emerald-600 -mt-0.5"></span>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              सभी ली गईं
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              देर से या आंशिक
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              आज का दिन
            </span>
          </div>
        </div>

        {/* Detailed Timeline matching Storyboard Screen 5 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            दैनिक रिकॉर्ड (Daily Log)
          </h3>

          {/* 18 Oct */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100">
              <span>18 Oct 2026 (आज)</span>
              <span className="text-emerald-700">1 ली गई · 1 छूटी</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">8:12 AM · Amlodipine 5mg</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Taken</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">9:05 AM · Metformin 500mg</span>
                <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">Missed</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>1:10 PM · Vitamin D3</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">Pending</span>
              </div>
            </div>
          </div>

          {/* 17 Oct */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-100">
              <span>17 Oct 2026</span>
              <span className="text-emerald-700">सभी 4 दवाइयाँ ली गईं ✓</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">8:02 AM · Amlodipine 5mg</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Taken</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">9:01 AM · Metformin 500mg</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Taken</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">1:03 PM · Vitamin D3</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Taken</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
