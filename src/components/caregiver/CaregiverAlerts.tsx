import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Phone,
  Pill,
  UserCheck,
} from 'lucide-react';

export const CaregiverAlerts: React.FC<{
  onTabChange: (tab: string) => void;
}> = ({ onTabChange }) => {
  const { alerts, claimAlert, markTakenByCaregiver, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'missed' | 'refill'>('all');

  const isHindi = language === 'hi';

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'missed') return a.type === 'missed_dose';
    if (filter === 'refill') return a.type === 'low_stock';
    return true;
  });

  return (
    <div className="flex flex-col min-h-full pb-20 bg-[#FAF7F2]">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-3 border-b border-amber-200/80 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              {isHindi ? 'अलर्ट्स व सूचनाएं' : 'Alerts & Notifications'}
            </h1>
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
              {alerts.filter(a => a.status === 'unclaimed').length}
            </span>
          </div>
        </div>

        {/* Filter Segmented Buttons matching Storyboard Screen 2 */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isHindi ? 'सभी (All)' : 'All'}
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'missed'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isHindi ? 'छूटी दवा (Missed)' : 'Missed'}
          </button>
          <button
            onClick={() => setFilter('refill')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'refill'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isHindi ? 'स्टॉक खत्म (Refill)' : 'Refill'}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-5 space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Bell className="w-12 h-12 mx-auto stroke-1 mb-2 opacity-50" />
            <p className="text-sm font-semibold">कोई अलर्ट नहीं है (No alerts)</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isMissed = alert.type === 'missed_dose';
            const isLowStock = alert.type === 'low_stock';
            const isConfirmed = alert.type === 'dose_confirmed';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isMissed
                    ? 'bg-red-50/70 border-red-200'
                    : isLowStock
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isMissed
                      ? 'bg-red-100 text-red-700'
                      : isLowStock
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isMissed && <AlertTriangle className="w-5 h-5" />}
                    {isLowStock && <Pill className="w-5 h-5" />}
                    {isConfirmed && <CheckCircle2 className="w-5 h-5 text-emerald-700" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">
                        {isHindi ? alert.titleHi : alert.title}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
                      {isHindi ? alert.messageHi : alert.message}
                    </p>

                    {/* Handling status badge */}
                    {alert.handledBy && (
                      <p className="text-xs font-bold text-emerald-800 mt-2 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{alert.handledBy}</span>
                      </p>
                    )}

                    {/* Missed dose quick actions */}
                    {isMissed && alert.status !== 'resolved' && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => claimAlert(alert.id, 'Neha')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>मैंने बात कर ली</span>
                        </button>
                        <button
                          onClick={() => markTakenByCaregiver('dose-2', alert.id)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
                        >
                          ली गई मार्क करें
                        </button>
                      </div>
                    )}

                    {/* Low stock action */}
                    {isLowStock && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => onTabChange('stock')}
                          className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          दवा स्टॉक में जोड़ें (Refill Stock)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <p className="font-bold text-slate-900 mb-0.5">स्वचालित एस्केलेशन (Escalation Rule):</p>
          <p>
            यदि 15 मिनट तक प्राथमिक केयरगिवर कोई जवाब नहीं देता, तो अलर्ट स्वतः दूसरे परिजनों (मम्मीजी व रोहित) को भेज दिया जाता है।
          </p>
        </div>
      </div>
    </div>
  );
};
