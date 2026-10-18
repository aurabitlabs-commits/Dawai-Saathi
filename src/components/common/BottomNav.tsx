import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Calendar,
  History,
  Home,
  Pill,
  Users,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { role, alerts, language } = useApp();

  // Elder app has no bottom tabs per PRD Section 10
  if (role === 'elder') return null;

  const isHindi = language === 'hi';
  const unreadAlerts = alerts.filter(a => a.status === 'unclaimed').length;

  const tabs = [
    {
      id: 'dashboard',
      label: isHindi ? 'होम' : 'Home',
      icon: Home,
    },
    {
      id: 'schedule',
      label: isHindi ? 'शेड्यूल' : 'Schedule',
      icon: Calendar,
    },
    {
      id: 'alerts',
      label: isHindi ? 'अलर्ट्स' : 'Alerts',
      icon: Bell,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
    {
      id: 'stock',
      label: isHindi ? 'स्टॉक' : 'Stock',
      icon: Pill,
    },
    {
      id: 'history',
      label: isHindi ? 'इतिहास' : 'History',
      icon: History,
    },
    {
      id: 'family',
      label: isHindi ? 'परिवार' : 'Family',
      icon: Users,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16 px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-full py-1 relative transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
