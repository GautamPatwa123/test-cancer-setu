import React, { useState } from 'react';
import {
  User,
  Settings,
  Globe,
  MapPin,
  Bell,
  Shield,
  RotateCcw,
  CheckCircle2,
  Lock,
  Phone,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Badge } from '../common/Badge.tsx';

export const UserProfileSettings: React.FC = () => {
  const {
    patient,
    updatePatientProfile,
    language,
    setLanguage,
    selectedCity,
    setSelectedCity,
    setShowResetConfirmModal,
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>(patient.emergencyContact.phone);
  const [preferredHospitalInput, setPreferredHospitalInput] = useState<string>(patient.preferredHospital);
  const [locationInput, setLocationInput] = useState<string>(patient.location);

  const [notifySms, setNotifySms] = useState<boolean>(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState<boolean>(false);
  const [notifyApp, setNotifyApp] = useState<boolean>(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile({
      location: locationInput,
      preferredHospital: preferredHospitalInput,
      emergencyContact: {
        ...patient.emergencyContact,
        phone: phoneInput,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
            User Profile and Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage your localized preferences, notification channels, privacy history, and test records.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirmModal(true)}
          className="self-start sm:self-center px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear & Reset Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Preferences updated and persisted to demonstration storage.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Profile Overview & Basic Settings */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              RS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{patient.name}</h3>
                <Badge variant="verified">Golden Card Verified</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient.age} Years • {patient.gender} • Blood Group: {patient.bloodGroup}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                ID: {patient.id}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Personalized Location & Care Preferences
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Locality in Darbhanga
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="E.g. Allpatti, Near VIP Road"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Healthcare Center
              </label>
              <input
                type="text"
                value={preferredHospitalInput}
                onChange={(e) => setPreferredHospitalInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="Darbhanga Medical College & Hospital (DMCH)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Next-of-Kin Contact Phone
              </label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="+91 98765 XXXXX"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Language, Notifications, Privacy & Consent History */}
        <div className="lg:col-span-5 space-y-5">
          {/* Language & Regional Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#0F766E]" />
              <span>Language & Accessibility</span>
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Interface Language</span>
                <span className="text-slate-500 text-[11px]">English & Hindi supported</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    language === 'en' ? 'bg-[#0F766E] text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    language === 'hi' ? 'bg-[#0F766E] text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Future regional releases will include Maithili (मैथिली) and Bhojpuri audio narration for non-literate patients.
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Notification Preferences</span>
            </h4>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span>In-App Status Alerts</span>
                <input
                  type="checkbox"
                  checked={notifyApp}
                  onChange={(e) => setNotifyApp(e.target.checked)}
                  className="rounded text-[#0F766E]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span>SMS Dispatch Updates</span>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded text-[#0F766E]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <span>WhatsApp Notifications</span>
                  <span className="text-[10px] bg-teal-100 text-[#0F766E] font-bold px-1.5 rounded">
                    Future Phase
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWhatsapp}
                  onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                  className="rounded text-[#0F766E]"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Consent History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Privacy & Consent Record</span>
            </h4>

            <div className="divide-y divide-slate-100 text-[11px] text-slate-600">
              <div className="py-2 flex justify-between">
                <span>AB-PMJAY Consent:</span>
                <strong className="text-emerald-700">Granted (2026-08-15)</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span>QR Emergency Share Link:</span>
                <strong className="text-teal-700">Tokenized & Revocable</strong>
              </div>
              <div className="py-2 flex justify-between">
                <span>Diagnostic Data Storage:</span>
                <strong className="text-slate-800">Local Sandbox Only</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
