import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface BadgeProps {
  variant?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'verified'
    | 'demo';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantStyles = {
    success: 'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/20',
    warning: 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20',
    danger: 'bg-[#B91C1C]/10 text-[#B91C1C] border-[#B91C1C]/20',
    info: 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/20',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium',
    demo: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold tracking-wide',
  };

  const icons = {
    verified: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1 inline" />,
    demo: <AlertTriangle className="w-3 h-3 text-amber-600 mr-1 inline" />,
    success: <CheckCircle2 className="w-3 h-3 text-[#15803D] mr-1 inline" />,
    warning: <Clock className="w-3 h-3 text-[#B45309] mr-1 inline" />,
    danger: <AlertTriangle className="w-3 h-3 text-[#B91C1C] mr-1 inline" />,
    info: <Info className="w-3 h-3 text-[#0F766E] mr-1 inline" />,
    neutral: null,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClasses} ${variantStyles[variant]} ${className}`}
    >
      {icons[variant]}
      {children}
    </span>
  );
};
