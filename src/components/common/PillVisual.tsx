import React from 'react';
import { PillAppearance, PillShape } from '../../types';

interface PillVisualProps {
  stripImage?: string;
  pillAppearance?: PillAppearance;
  form?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  language?: 'hi' | 'en';
}

export const PillVisual: React.FC<PillVisualProps> = ({
  stripImage,
  pillAppearance,
  form = 'tablet',
  size = 'md',
  showLabel = false,
  language = 'hi',
}) => {
  const isHindi = language === 'hi';

  const shape: PillShape = pillAppearance?.shape || (form === 'capsule' ? 'capsule' : 'round');
  const primaryColor = pillAppearance?.primaryColor || '#ffffff';
  const secondaryColor = pillAppearance?.secondaryColor || '#ef4444';
  const imprint = pillAppearance?.imprintText || '';

  // Dimension mapping
  const sizeMap = {
    sm: { container: 'w-10 h-10', svg: 36, img: 'w-10 h-10', text: 'text-[10px]' },
    md: { container: 'w-14 h-14', svg: 48, img: 'w-14 h-14', text: 'text-xs' },
    lg: { container: 'w-20 h-20', svg: 72, img: 'w-20 h-20', text: 'text-sm' },
    xl: { container: 'w-28 h-28', svg: 104, img: 'w-28 h-28', text: 'text-base' },
  };

  const dim = sizeMap[size];

  // Render photo if available and not a fallback
  if (stripImage) {
    return (
      <div className="flex flex-col items-center">
        <div
          className={`${dim.container} rounded-2xl overflow-hidden border-2 border-slate-200/80 bg-slate-50 shadow-xs shrink-0 flex items-center justify-center relative group`}
        >
          <img
            src={stripImage}
            alt="Pill visual"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={e => {
              // Hide broken image frame and fallback
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1 rounded font-mono">
            📷
          </span>
        </div>

        {showLabel && pillAppearance && (
          <span className={`${dim.text} font-bold text-slate-700 mt-1.5 text-center`}>
            {isHindi ? pillAppearance.shapeLabelHi : pillAppearance.shapeLabelEn}
          </span>
        )}
      </div>
    );
  }

  // Render SVG generated pill placeholder with realistic pharmaceutical shadows and bevels
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${dim.container} rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 border-2 border-slate-200/90 shadow-sm shrink-0 flex items-center justify-center p-1.5`}
      >
        <svg
          width={dim.svg}
          height={dim.svg}
          viewBox="0 0 100 100"
          className="filter drop-shadow-md"
        >
          <defs>
            <radialGradient id={`grad-${primaryColor}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="45%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.85" />
            </radialGradient>
            <filter id="pill-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Round Tablet */}
          {shape === 'round' && (
            <g filter="url(#pill-shadow)">
              {/* Outer bevel ring */}
              <circle cx="50" cy="50" r="42" fill={primaryColor} stroke="#94a3b8" strokeWidth="1.5" />
              {/* Top face */}
              <circle cx="50" cy="50" r="38" fill={`url(#grad-${primaryColor})`} />
              {/* Score line */}
              <line x1="50" y1="16" x2="50" y2="84" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              {/* Imprint Text */}
              {imprint && (
                <text
                  x="70"
                  y="54"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#475569"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {imprint}
                </text>
              )}
            </g>
          )}

          {/* Oval / Oblong Tablet */}
          {shape === 'oval' && (
            <g filter="url(#pill-shadow)">
              <rect
                x="14"
                y="30"
                width="72"
                height="40"
                rx="20"
                fill={primaryColor}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <rect
                x="16"
                y="32"
                width="68"
                height="36"
                rx="18"
                fill={`url(#grad-${primaryColor})`}
              />
              {/* Score line */}
              <line x1="50" y1="32" x2="50" y2="68" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              {imprint && (
                <text
                  x="50"
                  y="55"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#475569"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {imprint}
                </text>
              )}
            </g>
          )}

          {/* Capsule */}
          {shape === 'capsule' && (
            <g filter="url(#pill-shadow)">
              {/* Left half */}
              <path
                d="M 20,50 C 20,34 32,30 50,30 L 50,70 C 32,70 20,66 20,50 Z"
                fill={primaryColor}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* Right half */}
              <path
                d="M 50,30 C 68,30 80,34 80,50 C 80,66 68,70 50,70 Z"
                fill={secondaryColor}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              {/* Central joint band */}
              <line x1="50" y1="30" x2="50" y2="70" stroke="#475569" strokeWidth="2" opacity="0.5" />
              {/* Gloss shine */}
              <ellipse cx="36" cy="40" rx="10" ry="3" fill="#ffffff" opacity="0.6" />
            </g>
          )}

          {/* Liquid / Syrup Drop */}
          {shape === 'liquid' && (
            <g filter="url(#pill-shadow)">
              <path
                d="M 50,15 C 50,15 25,50 25,65 C 25,78 36,88 50,88 C 64,88 75,78 75,65 C 75,50 50,15 50,15 Z"
                fill={primaryColor === '#ffffff' ? '#38bdf8' : primaryColor}
                stroke="#0284c7"
                strokeWidth="2"
              />
              <ellipse cx="43" cy="60" rx="8" ry="12" fill="#ffffff" opacity="0.5" transform="rotate(-20 43 60)" />
            </g>
          )}

          {/* Strip / Blister placeholder */}
          {shape === 'strip' && (
            <g filter="url(#pill-shadow)">
              <rect x="15" y="20" width="70" height="60" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="35" cy="40" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="65" cy="40" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="35" cy="62" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="65" cy="62" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>

      {showLabel && pillAppearance && (
        <span className={`${dim.text} font-bold text-slate-700 mt-1.5 text-center`}>
          {isHindi ? `${pillAppearance.colorLabelHi} ${pillAppearance.shapeLabelHi}` : `${pillAppearance.colorLabelEn} ${pillAppearance.shapeLabelEn}`}
        </span>
      )}
    </div>
  );
};
