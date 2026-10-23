import React from 'react';
import { PhoneCall, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const EmergencyBanner: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="bg-[#B91C1C]/10 border-l-4 border-[#B91C1C] p-3 sm:p-4 rounded-r-xl my-4 text-[#172B3A] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="bg-[#B91C1C] text-white p-2 rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-[#B91C1C] uppercase tracking-wider">
              {language === 'hi' ? 'आपातकालीन चेतावनी' : 'Emergency Assistance Notice'}
            </span>
            <span className="text-xs bg-[#B91C1C] text-white font-semibold px-2 py-0.5 rounded-full">
              Demo Platform
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
            {language === 'hi'
              ? 'सेहतसेतु एक प्रदर्शन (prototype) प्लेटफॉर्म है और वास्तविक आपातकालीन सेवाओं को सीधे डिस्पैच नहीं करता है। किसी भी गंभीर चिकित्सा आपात स्थिति में तुरंत 112 या 108 पर संपर्क करें।'
              : 'SehatSetu is an educational competition prototype and does NOT dispatch live emergency services. If you or someone nearby is experiencing a life-threatening crisis, call India emergency response directly.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pl-10 sm:pl-0">
        <a
          href="tel:112"
          className="inline-flex items-center gap-1.5 bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-sm transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Dial 112 / 108</span>
        </a>
      </div>
    </div>
  );
};
