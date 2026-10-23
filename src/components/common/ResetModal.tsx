import React from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const ResetModal: React.FC = () => {
  const { showResetConfirmModal, setShowResetConfirmModal, resetAllDemoData, language } = useApp();

  if (!showResetConfirmModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={() => setShowResetConfirmModal(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#172B3A]">
              {language === 'hi' ? 'डेमो डेटा रीसेट करें?' : 'Reset All Demo Data?'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'प्रतियोगिता परीक्षण मोड' : 'Competition Prototype Testing Mode'}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {language === 'hi'
            ? 'यह आपके द्वारा जोड़े गए सभी नए अनुरोध, अपलोड किए गए दस्तावेज़, और संशोधित सेटिंग्स को रीसेट कर प्रारंभिक डेमो स्थिति में ले आएगा।'
            : 'This will restore all simulated patient records, sample blood requests, ambulance logs, and documents back to the pristine competition baseline.'}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setShowResetConfirmModal(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            onClick={resetAllDemoData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'hi' ? 'हाँ, रीसेट करें' : 'Confirm Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
