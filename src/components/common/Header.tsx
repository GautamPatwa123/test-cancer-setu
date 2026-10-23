import React, { useState } from 'react';
import {
  Bell,
  MapPin,
  Globe,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Menu,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from './Logo.tsx';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    t,
    language,
    setLanguage,
    userRole,
    setUserRole,
    userLocation,
    selectedCity,
    setSelectedCity,
    patient,
    currentPage,
    setCurrentPage,
    bloodRequests,
    ambulanceRequests,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cities = [
    'Darbhanga, Bihar',
    'Madhubani, Bihar',
    'Samastipur, Bihar',
    'Muzaffarpur, Bihar',
    'Patna, Bihar',
  ];

  const pendingCount =
    bloodRequests.filter((r) => r.status.includes('Awaiting')).length +
    ambulanceRequests.filter((r) => r.status.includes('Submitted')).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-bold text-[#172B3A] tracking-tight leading-tight">
              {userRole === 'admin'
                ? (language === 'hi' ? 'नमस्ते, डॉ. आनंद वर्मा' : 'Namaste, Dr. Anand Verma')
                : t('greeting')}
            </h1>
            <p className="text-xs text-[#64748B]">
              {userRole === 'admin'
                ? (language === 'hi' ? 'डीएमसीएच नोडल स्वास्थ्य समन्वय केंद्र' : 'DMCH Regional Health Coordination Desk')
                : t('subtitle')}
            </p>
          </div>

          <div className="sm:hidden">
            <Logo size="sm" showTagline={false} />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City Selector */}
          {/* City & State Location Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentPage !== 'find-care') {
                  setCurrentPage('find-care');
                } else {
                  setShowCityDropdown(!showCityDropdown);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E6F5F2] hover:bg-teal-100/70 text-[#0F766E] text-xs font-semibold border border-teal-200 transition-colors"
              aria-label="Select or view location"
              title="Click to set or change your location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              <span className="hidden sm:inline max-w-[140px] truncate">
                {userLocation.city && userLocation.state
                  ? `${userLocation.city}, ${userLocation.state}`
                  : userLocation.city || userLocation.state || (userLocation.type === 'geolocation' ? userLocation.approximateArea : 'Select Location')}
              </span>
              <span className="sm:hidden max-w-[80px] truncate">
                {userLocation.city || 'Location'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#0F766E]" />
            </button>

            {showCityDropdown && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-40 space-y-2">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                  Current Location
                </div>
                <div className="px-2 py-1 text-xs font-bold text-slate-800">
                  {userLocation.approximateArea || 'Location not set'}
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentPage('find-care');
                      setShowCityDropdown(false);
                    }}
                    className="w-full text-center px-3 py-1.5 text-xs font-bold bg-[#0F766E] text-white rounded-lg hover:bg-[#0d625c] transition-colors"
                  >
                    Open Location Selector
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
            title="Toggle Language: English / Hindi"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Role Toggle Button (Patient vs Admin Demo) */}
          <button
            onClick={() => {
              const newRole = userRole === 'patient' ? 'admin' : 'patient';
              setUserRole(newRole);
              if (newRole === 'admin') setCurrentPage('admin');
              else setCurrentPage('overview');
            }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              userRole === 'admin'
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-[#123047] border-[#E2E8F0]'
            }`}
            title="Toggle between Patient View and Administrator Portal"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{userRole === 'admin' ? 'Admin Portal' : 'Patient Mode'}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B91C1C] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'hi' ? 'अधिसूचनाएं (डेमो)' : 'System Notifications (Demo)'}
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    aria-label="Close notifications"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 mt-2 max-h-64 overflow-y-auto">
                  <div className="py-2 text-xs">
                    <p className="font-semibold text-slate-800">Blood Enquiry Queued</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      REQ-BLD-9021 awaiting DMCH Model Blood Centre stock verification.
                    </p>
                    <span className="text-[10px] text-teal-700">15 mins ago</span>
                  </div>
                  <div className="py-2 text-xs">
                    <p className="font-semibold text-slate-800">Emergency Reminder</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      SehatSetu is a demonstration platform. Real emergencies require dialing 112.
                    </p>
                    <span className="text-[10px] text-slate-400">Notice</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setCurrentPage('requests');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-[#0F766E] font-bold hover:underline"
                  >
                    {language === 'hi' ? 'सभी अनुरोध देखें' : 'View All Active Requests'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => setCurrentPage('profile-settings')}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Open Profile & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {userRole === 'admin' ? 'AV' : 'RS'}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-700 pr-2">
              {userRole === 'admin' ? 'Dr. Verma' : patient.alias}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
