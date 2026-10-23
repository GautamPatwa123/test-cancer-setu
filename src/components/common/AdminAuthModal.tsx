import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  X,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { adminLogin, setCurrentPage, language } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!pin.trim()) {
      setErrorMsg('Please enter your 6-digit administrative security PIN.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = adminLogin(pin);
      setIsLoading(false);
      if (result.success) {
        onClose();
        setCurrentPage('admin');
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(result.message);
      }
    }, 350);
  };

  const handleUseDemoPin = () => {
    setPin('749001');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-auth-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="admin-auth-title" className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {language === 'hi' ? 'प्रशासक पोर्टल सुरक्षा द्वार' : 'Administrator Portal Security Gate'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Role-Based Access Control · Nodal Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Restricted Healthcare Desk</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300">
              Access is limited to authorized hospital nodal officers, blood bank coordinators, and emergency fleet dispatchers.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              Security PIN / Passcode
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                maxLength={10}
                placeholder="Enter 6-digit administrative PIN"
                autoFocus
                className="w-full text-sm font-mono tracking-widest px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* Demo Hint & Quick Fill */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Demo Master PIN:</span>
              <code className="font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-800 dark:text-slate-200">749001</code>
            </div>
            <button
              type="button"
              onClick={handleUseDemoPin}
              className="text-[11px] font-semibold text-[#0F766E] dark:text-teal-400 hover:underline"
            >
              Auto-fill Demo PIN
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
