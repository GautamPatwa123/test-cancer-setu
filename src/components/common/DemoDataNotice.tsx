import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DemoDataNoticeProps {
  label?: string;
  className?: string;
}

export const DemoDataNotice: React.FC<DemoDataNoticeProps> = ({
  label = 'DEMO DATA — NOT LIVE AVAILABILITY',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs select-none ${className}`}
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span>{label}</span>
    </div>
  );
};
