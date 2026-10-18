import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Calendar,
  Home,
  Pill,
  Menu,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { role, alerts, medicines, language } = useApp();

  // Elder app has no bottom tabs per PRD Section 10
  if (role === 'elder') return null;

  const isHindi = language === 'hi';
  const unreadAlerts = alerts.filter(a => a.status === 'unclaimed').length;
  const lowStockCount = medicines.filter(m => m.stockDays <= 5).length;

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
      badgeColor: 'bg-red-600',
    },
    {
      id: 'stock',
      label: isHindi ? 'स्टॉक' : 'Stock',
      icon: Pill,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'more',
      label: isHindi ? 'अधिक' : 'More',
      icon: Menu,
      // Highlight "More" if viewing history or family subpages
      isMatch: (current: string) => ['more', 'history', 'family'].includes(current),
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 items-center h-[68px] px-1 max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = tab.isMatch ? tab.isMatch(activeTab) : activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-full py-1.5 relative transition-all active:scale-95 ${
                isActive
                  ? 'text-blue-800 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'stroke-[2.5] scale-110' : 'stroke-2'
                  }`}
                  aria-hidden="true"
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full ${tab.badgeColor || 'bg-red-600'} text-white text-[11px] font-bold flex items-center justify-center leading-none shadow-xs`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[12px] mt-1 truncate max-w-full tracking-tight ${isActive ? 'font-extrabold text-blue-900' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-6 h-1 rounded-full bg-blue-700 absolute bottom-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
