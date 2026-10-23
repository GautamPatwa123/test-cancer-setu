import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  light = false,
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Original SehatSetu Emblem: Cross + Connection Nodes + Arch Bridge */}
      <div
        className="relative flex items-center justify-center rounded-xl p-1.5 shadow-sm transition-transform hover:scale-105"
        style={{
          background: light ? 'rgba(255, 255, 255, 0.15)' : '#E6F5F2',
          width: iconSize,
          height: iconSize,
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Healthcare Cross Foundation */}
          <rect
            x="19"
            y="6"
            width="10"
            height="36"
            rx="5"
            fill="#0F766E"
          />
          <rect
            x="6"
            y="19"
            width="36"
            height="10"
            rx="5"
            fill="#0F766E"
          />

          {/* Golden/Warm Bridge Arc (The "Setu" spanning across) */}
          <path
            d="M8 36 C 18 20, 30 20, 40 36"
            stroke="#123047"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Network Connection Nodes */}
          <circle cx="8" cy="36" r="3" fill="#0F766E" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="40" cy="36" r="3" fill="#0F766E" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="3.5" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight leading-none ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${light ? 'text-white' : 'text-[#123047]'}`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Sehat<span className="text-[#0F766E]">Setu</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${
              light ? 'text-white/70' : 'text-[#64748B]'
            }`}
          >
            Connected Care • Darbhanga
          </span>
        )}
      </div>
    </div>
  );
};
