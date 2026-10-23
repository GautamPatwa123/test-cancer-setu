import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Ambulance,
  FileText,
  QrCode,
  HeartHandshake,
  Building2,
  ArrowRight,
  ShieldAlert,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  Navigation,
  Pill,
  Calendar,
  Volume2,
  Plus,
  X,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { EmergencyBanner } from '../common/EmergencyBanner.tsx';
import { DemoDataNotice } from '../common/DemoDataNotice.tsx';
import { Badge } from '../common/Badge.tsx';
import { calculateAdherenceRate } from '../../utils/healthLogic.ts';

export const PatientOverview: React.FC = () => {
  const {
    setCurrentPage,
    t,
    language,
    selectedCity,
    userLocation,
    patient,
    bloodRequests,
    ambulanceRequests,
    assistanceApplications,
    documents,
    hospitals,
    reminders,
    updateReminderStatus,
    testNotificationAlert,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const relevantHospitals = React.useMemo(() => {
    if (userLocation.city) {
      const match = hospitals.filter(
        (h) => h.city && h.city.toLowerCase() === userLocation.city.toLowerCase()
      );
      if (match.length > 0) return match.slice(0, 3);
    }
    if (userLocation.state) {
      const stateMatch = hospitals.filter(
        (h) => h.state && h.state.toLowerCase() === userLocation.state.toLowerCase()
      );
      if (stateMatch.length > 0) return stateMatch.slice(0, 3);
    }
    return hospitals.slice(0, 3);
  }, [hospitals, userLocation.city, userLocation.state]);

  const adherenceRate = calculateAdherenceRate(reminders);
  const todaysMedicines = reminders.filter((r) => r.type === 'medicine');
  const upcomingAppointments = reminders.filter((r) => r.type === 'appointment');
  const pendingMedsCount = todaysMedicines.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card with City and Demo Profile details */}
      <div className="bg-gradient-to-r from-[#123047] via-[#0F766E] to-[#123047] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle geometric background motif */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-32 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-white/20 text-white font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Demo Profile: {patient.name} ({patient.age}y / {patient.gender})
              </span>
              <span className="text-xs bg-teal-400/20 text-teal-200 border border-teal-300/30 px-2.5 py-0.5 rounded-full">
                AB-PMJAY Golden Card Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('greeting')}
            </h2>
            <p className="text-sm sm:text-base text-teal-100 max-w-xl">
              {t('subtitle')} Connect to verified blood banks, emergency ambulances, translated medical reports, and cancer support across {selectedCity}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => setCurrentPage('find-care')}
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <Navigation className="w-4 h-4 text-white" />
              <span>{t('navFindCare')}</span>
            </button>

            <button
              onClick={() => setCurrentPage('qr-profile')}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#123047] hover:bg-slate-100 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <QrCode className="w-4 h-4 text-[#0F766E]" />
              <span>Emergency QR Card</span>
            </button>

            <button
              onClick={() => setCurrentPage('ai-assistant')}
              className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0d655e] border border-teal-400/40 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all"
            >
              <HeartPulse className="w-4 h-4" />
              <span>AI Symptom Triage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Notice Banner */}
      <EmergencyBanner />

      {/* Location Care Locator Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50/70 border border-teal-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {language === 'hi' ? 'निकटतम स्वास्थ्य केंद्र खोजें (Location-Aware)' : 'Find Care Near Me'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'hi'
                ? `वर्तमान क्षेत्र: ${selectedCity} • दूरी एवं सत्यापित केंद्र देखें`
                : `Active Area: ${selectedCity} • Calculate actual distance to nearby hospitals, ambulances, and blood banks.`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentPage('find-care')}
          className="px-4 py-2 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>{language === 'hi' ? 'सेवाएं खोजें' : 'Open Care Locator'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* DEDICATED TODAY'S HEALTHCARE SCHEDULE & REMINDERS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-[#123047]">
                  {t('todaysSchedule')}
                </h3>
                {pendingMedsCount > 0 ? (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {pendingMedsCount} {language === 'hi' ? 'दवाएं बाकी' : 'Doses Due Today'}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'hi' ? 'आज की दवाएं पूर्ण' : 'All Doses Completed'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('scheduleDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={async () => {
                const res = await testNotificationAlert();
                setToastMessage(
                  res.permission === 'granted'
                    ? (language === 'hi' ? 'घंटी व नोटिफिकेशन भेजा गया!' : 'Chime played & alert delivered!')
                    : (language === 'hi' ? 'घंटी बजाई गई (इन-ऐप)।' : 'Gentle audio chime played.')
                );
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="p-2 text-slate-500 hover:text-[#0F766E] hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
              title="Test reminder chime"
              aria-label="Test chime"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage('reminders')}
              className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'पूरा शेड्यूल देखें' : 'Manage Reminders'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Schedule Grid: Medicines on Left, Upcoming Appointments on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          {/* Left Column (7 cols): Today's Medicine Intake */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{language === 'hi' ? 'आज की दवाएं (One-Click Intake)' : 'Today\'s Prescribed Medicines'}</span>
              </span>
              <span className="text-[11px] text-teal-700 font-semibold">
                {language === 'hi' ? 'पालन दर: ' : 'Adherence: '}
                <strong className="font-extrabold">{adherenceRate}%</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {todaysMedicines.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                  {language === 'hi' ? 'कोई दवा रिमाइंडर सक्रिय नहीं है।' : 'No medicine reminders scheduled.'}
                </div>
              ) : (
                todaysMedicines.slice(0, 3).map((med) => {
                  const isTaken = med.status === 'taken';
                  return (
                    <div
                      key={med.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isTaken
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 hover:border-teal-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isTaken
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-teal-50 text-[#0F766E]'
                          }`}
                        >
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                              {med.title}
                            </h4>
                            <span className="text-[11px] font-mono text-slate-500">
                              · {med.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {med.dosageOrDoctor}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isTaken ? (
                          <button
                            onClick={() => updateReminderStatus(med.id, 'pending')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Click to revert to pending"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{t('taken')}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateReminderStatus(med.id, 'taken');
                              setToastMessage(
                                language === 'hi'
                                  ? `${med.title} का सेवन दर्ज किया गया!`
                                  : `Dose logged: ${med.title} taken!`
                              );
                              setTimeout(() => setToastMessage(null), 2500);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t('markAsTaken')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Upcoming Appointments */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'hi' ? 'आगामी डॉक्टर परामर्श' : 'Upcoming Doctor Visits'}</span>
              </span>
              <button
                onClick={() => setCurrentPage('reminders')}
                className="text-[11px] text-[#0F766E] font-bold hover:underline"
              >
                {language === 'hi' ? 'सभी देखें' : 'View Calendar'}
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingAppointments.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                  {language === 'hi' ? 'कोई आगामी अपॉइंटमेंट निर्धारित नहीं है।' : 'No upcoming doctor appointments.'}
                </div>
              ) : (
                upcomingAppointments.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {apt.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {apt.dosageOrDoctor}
                      </p>
                      {apt.facilityName && (
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{apt.facilityName}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>{apt.date}</span>
                        <span>·</span>
                        <span className="font-bold text-slate-700">{apt.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY QUICK ACTIONS (4 Core Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-[#172B3A]">
            {language === 'hi' ? 'त्वरित स्वास्थ्य सेवाएं' : 'Primary Quick Actions'}
          </h3>
          <span className="text-xs text-slate-500">Fast assistance within {selectedCity}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Check Symptoms */}
          <div
            onClick={() => setCurrentPage('ai-assistant')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0F766E] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E6F5F2] group-hover:bg-[#0F766E] text-[#0F766E] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-[#172B3A] group-hover:text-[#0F766E] transition-colors">
                {t('checkSymptoms')}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('checkSymptomsDesc')}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Find Blood */}
          <div
            onClick={() => setCurrentPage('blood')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-red-600 text-red-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Droplets className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-[#172B3A] group-hover:text-red-700 transition-colors">
                {t('findBlood')}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('findBloodDesc')}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700">
              <span>Search Stock</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Request Ambulance */}
          <div
            onClick={() => setCurrentPage('ambulance')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <Ambulance className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-[#172B3A] group-hover:text-amber-800 transition-colors">
                {t('requestAmbulance')}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('requestAmbulanceDesc')}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>View Map & Units</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Upload Medical Report */}
          <div
            onClick={() => setCurrentPage('documents')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-[#172B3A] group-hover:text-blue-700 transition-colors">
                {t('uploadReport')}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {t('uploadReportDesc')}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Open Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY SERVICE CARDS (3 Secondary Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* QR Health Profile */}
        <div
          onClick={() => setCurrentPage('qr-profile')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-2xs transition-all cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-3 bg-teal-50 text-[#0F766E] rounded-xl shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-sm text-[#172B3A]">QR Health Profile</h4>
            <p className="text-xs text-slate-500 truncate">{t('qrProfileDesc')}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
        </div>

        {/* Financial Assistance */}
        <div
          onClick={() => setCurrentPage('ngo-assistance')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 shadow-2xs transition-all cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-sm text-[#172B3A]">{t('financialAssistance')}</h4>
            <p className="text-xs text-slate-500 truncate">{t('financialAssistanceDesc')}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
        </div>

        {/* Hospitals & Insurance */}
        <div
          onClick={() => setCurrentPage('hospitals')}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 shadow-2xs transition-all cursor-pointer flex items-center gap-3.5"
        >
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-sm text-[#172B3A]">{t('hospitalsDirectory')}</h4>
            <p className="text-xs text-slate-500 truncate">{t('hospitalsDirectoryDesc')}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
        </div>
      </div>

      {/* LOWER SECTION: Recent Activity (Left) + Healthcare Support Near You (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Recent Activity */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F766E]" />
              <h3 className="font-bold text-base text-[#172B3A]">
                {t('recentActivity')}
              </h3>
            </div>
            <button
              onClick={() => setCurrentPage('requests')}
              className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
            >
              <span>{t('viewAllRequests')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* 1. Blood Request - Awaiting Confirmation */}
            {bloodRequests.slice(0, 1).map((b) => (
              <div
                key={b.id}
                onClick={() => setCurrentPage('requests')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 text-red-700 rounded-lg">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        Blood Request • {b.bloodGroup} {b.component}
                      </span>
                      <span className="text-[10px] text-slate-400">{b.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Requested from: {b.centreName} ({b.units} units)
                    </p>
                  </div>
                </div>
                <Badge variant="warning">{b.status}</Badge>
              </div>
            ))}

            {/* 2. Medical Report - Uploaded to Demo Profile */}
            {documents.slice(0, 1).map((doc) => (
              <div
                key={doc.id}
                onClick={() => setCurrentPage('documents')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {doc.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{doc.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Uploaded to Demo Profile • AI Plain-Language Summary Available
                    </p>
                  </div>
                </div>
                <Badge variant="success">Analyzed</Badge>
              </div>
            ))}

            {/* 3. NGO Assistance - Under Review */}
            {assistanceApplications.slice(0, 1).map((app) => (
              <div
                key={app.id}
                onClick={() => setCurrentPage('requests')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        NGO Assistance • {app.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{app.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Treatment at {app.hospitalName} • Grant Review
                    </p>
                  </div>
                </div>
                <Badge variant="info">{app.status}</Badge>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('requests')}
              className="text-xs text-slate-600 hover:text-[#0F766E] font-medium"
            >
              Showing 3 most recent demonstration activities
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Healthcare Support Near You (Darbhanga Facilities) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F766E]" />
                <h3 className="font-bold text-base text-[#172B3A]">
                  {t('healthcareNearYou')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {userLocation.city
                  ? `${userLocation.city}${userLocation.state ? `, ${userLocation.state}` : ''} Medical Centers`
                  : 'Participating Regional Medical Centers'}
              </p>
            </div>
            <DemoDataNotice label="DEMO DIRECTORY" />
          </div>

          <div className="space-y-3">
            {relevantHospitals.map((h) => (
              <div
                key={h.id}
                onClick={() => setCurrentPage('hospitals')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0F766E] hover:bg-slate-50 transition-all cursor-pointer flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {h.name}
                  </h4>
                  <Badge variant={h.type === 'Government' ? 'info' : 'neutral'}>
                    {h.type}
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{h.locality || `${h.city}, ${h.state}`}</span>
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-700 font-semibold">
                    {h.hasEmergencyIcu ? '24x7 Emergency ICU' : 'General Care'}
                  </span>
                  <span className="text-[#0F766E] font-bold hover:underline flex items-center gap-0.5">
                    <span>View Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Ayushman Bharat Helpdesk:</span>
              <p className="text-[11px] text-teal-800">
                {userLocation.city ? `${userLocation.city} Ayushman Desk (24/7)` : 'Nodal Helpdesk Counter (24/7)'}
              </p>
            </div>
            <a
              href="tel:14555"
              className="px-2.5 py-1.5 bg-[#0F766E] text-white text-[11px] font-bold rounded-lg shadow-2xs hover:bg-[#0d655e]"
            >
              Call 14555
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
