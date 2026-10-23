import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Pill,
  Calendar,
  CheckCircle2,
  Plus,
  RotateCcw,
  Volume2,
  Trash2,
  Stethoscope,
  Building2,
  MapPin,
  AlertCircle,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { HealthcareReminder, ReminderType, ReminderRecurrence } from '../../types/index.ts';
import { calculateAdherenceRate, formatTimeDisplay, playNotificationChime } from '../../utils/healthLogic.ts';

export const RemindersModule: React.FC = () => {
  const {
    reminders,
    createReminder,
    updateReminderStatus,
    deleteReminder,
    testNotificationAlert,
    triggerReminderNotification,
    t,
    language,
    patient,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'medicine' | 'appointment'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [testAlertFeedback, setTestAlertFeedback] = useState<string | null>(null);

  // New Reminder Form State
  const [reminderType, setReminderType] = useState<ReminderType>('medicine');
  const [title, setTitle] = useState<string>('');
  const [dosageOrDoctor, setDosageOrDoctor] = useState<string>('');
  const [time, setTime] = useState<string>('08:30');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [recurrence, setRecurrence] = useState<ReminderRecurrence>('daily');
  const [facilityName, setFacilityName] = useState<string>('Darbhanga Medical College & Hospital (DMCH)');
  const [notes, setNotes] = useState<string>('');
  const [audioChimeEnabled, setAudioChimeEnabled] = useState<boolean>(true);

  // Calculations
  const adherenceRate = calculateAdherenceRate(reminders);
  const medicineCount = reminders.filter((r) => r.type === 'medicine').length;
  const appointmentCount = reminders.filter((r) => r.type === 'appointment').length;
  const pendingMeds = reminders.filter((r) => r.type === 'medicine' && r.status === 'pending');
  const takenMeds = reminders.filter((r) => r.type === 'medicine' && r.status === 'taken');

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  const handleTestAlert = async () => {
    setTestAlertFeedback(language === 'hi' ? 'घंटी बजाई जा रही है...' : 'Playing chime & testing alert...');
    const res = await testNotificationAlert(
      'SehatSetu Healthcare Reminder',
      language === 'hi'
        ? 'दवा का समय: 1 गोली नाश्ते के बाद लें।'
        : 'Time for your scheduled dose of Amlodipine 5mg.'
    );
    if (res.permission === 'granted') {
      setTestAlertFeedback(language === 'hi' ? 'सूचना व घंटी सफल!' : 'Chime played & browser alert delivered!');
    } else if (res.permission === 'denied') {
      setTestAlertFeedback(
        language === 'hi'
          ? 'घंटी बजी (ब्राउज़र नोटिफिकेशन अस्वीकृत है)।'
          : 'Audio chime played (browser notification permission denied in browser settings).'
      );
    } else {
      setTestAlertFeedback(
        language === 'hi'
          ? 'घंटी बजी (इन-ऐप अलर्ट सक्रिय)।'
          : 'Audio chime played! In-app reminders active.'
      );
    }
    setTimeout(() => setTestAlertFeedback(null), 4000);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createReminder({
      patientId: patient.id,
      type: reminderType,
      title: title.trim(),
      dosageOrDoctor: dosageOrDoctor.trim() || (reminderType === 'medicine' ? '1 dose' : 'General OPD'),
      time: formatTimeDisplay(time),
      date,
      recurrence,
      facilityName: reminderType === 'appointment' ? facilityName.trim() : undefined,
      notes: notes.trim(),
      audioChimeEnabled,
    });

    setShowAddModal(false);
    setTitle('');
    setDosageOrDoctor('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              {language === 'hi' ? 'दवा व अपॉइंटमेंट रिमाइंडर' : 'Reminders & Schedule'}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {language === 'hi' ? 'समय पर देखभाल' : 'Adherence & Clinic Timings'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            {language === 'hi'
              ? 'दैनिक दवा सेवन और अस्पताल परामर्श के लिए समयबद्ध सूचनाएं और पुष्टि।'
              : 'Set automated reminders for daily medicine intake and upcoming medical appointments.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleTestAlert}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            title="Play two-tone audio chime and verify browser notification permission"
          >
            <Volume2 className="w-4 h-4 text-[#0F766E]" />
            <span>{t('testChimeAlert')}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addReminder')}</span>
          </button>
        </div>
      </div>

      {testAlertFeedback && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span>{testAlertFeedback}</span>
          </div>
          <button onClick={() => setTestAlertFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* METRIC STRIP (4 KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'hi' ? 'कुल निर्धारित अनुस्मारक' : 'Total Active Reminders'}
          </span>
          <div className="text-2xl font-extrabold text-[#123047] tabular-nums mt-1">
            {reminders.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {medicineCount} {language === 'hi' ? 'दवाएं' : 'Meds'} · {appointmentCount} {language === 'hi' ? 'मुलाकातें' : 'Visits'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'hi' ? 'आज की लंबित खुराक' : 'Pending Medicine Doses'}
          </span>
          <div className="text-2xl font-extrabold text-amber-600 tabular-nums mt-1">
            {pendingMeds.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
            {pendingMeds.length > 0 ? (language === 'hi' ? 'सेवन बाकी है' : 'Awaiting confirmation') : (language === 'hi' ? 'सभी खुराक ली गई' : 'All doses taken')}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'hi' ? 'आज ली गई खुराक' : 'Doses Taken Today'}
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums mt-1">
            {takenMeds.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
            {language === 'hi' ? 'समयबद्ध सेवन' : 'Logged & confirmed'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'hi' ? 'दवा पालन दर' : 'Medication Adherence'}
          </span>
          <div className="text-2xl font-extrabold text-[#0F766E] tabular-nums mt-1">
            {adherenceRate}%
          </div>
          <span className="text-[11px] text-teal-700 font-medium mt-0.5 block">
            {adherenceRate >= 80 ? (language === 'hi' ? 'उत्कृष्ट पालन' : 'Optimal compliance') : (language === 'hi' ? 'सुधार की आवश्यकता' : 'Needs attention')}
          </span>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {language === 'hi' ? 'सभी अनुस्मारक' : 'All Reminders'} ({reminders.length})
        </button>
        <button
          onClick={() => setActiveTab('medicine')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'medicine'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'दवाइयां' : 'Medicines'} ({medicineCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('appointment')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            activeTab === 'appointment'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'डॉक्टर परामर्श' : 'Appointments'} ({appointmentCount})</span>
        </button>
      </div>

      {/* REMINDERS LIST */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">
              {language === 'hi' ? 'कोई अनुस्मारक नहीं मिला' : 'No reminders scheduled in this category'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'hi'
                ? 'नियमित दवाओं अथवा आगामी डॉक्टर अपॉइंटमेंट के लिए नया रिमाइंडर जोड़ें।'
                : 'Keep your treatment on track by creating medication or appointment alerts.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#0F766E] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0d655e]"
            >
              {t('addReminder')}
            </button>
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const isMedicine = rem.type === 'medicine';
            const isTaken = rem.status === 'taken' || rem.status === 'completed';

            return (
              <div
                key={rem.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isTaken
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-teal-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isMedicine
                        ? isTaken
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-teal-50 text-[#0F766E]'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {isMedicine ? <Pill className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                        {rem.title}
                      </h4>
                      <span className="text-xs text-slate-500">
                        · {isMedicine ? (language === 'hi' ? 'दवा सेवन' : 'Medication') : (language === 'hi' ? 'परामर्श' : 'Hospital Visit')}
                      </span>
                      {rem.recurrence && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          · {rem.recurrence}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {rem.dosageOrDoctor}
                    </p>

                    {rem.facilityName && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{rem.facilityName}</span>
                      </p>
                    )}

                    {rem.notes && (
                      <p className="text-[11px] text-slate-400 italic mt-0.5">
                        "{rem.notes}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rem.time}</span>
                      </span>
                      <span>·</span>
                      <span>{rem.date}</span>
                      {isTaken && rem.lastTakenTimestamp && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold">
                            {language === 'hi' ? 'सेवन दर्ज: ' : 'Confirmed at '}
                            {rem.lastTakenTimestamp.slice(11, 16)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isMedicine ? (
                    isTaken ? (
                      <button
                        onClick={() => updateReminderStatus(rem.id, 'pending')}
                        className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                        title="Click to mark back to pending"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('taken')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          updateReminderStatus(rem.id, 'taken');
                          playNotificationChime();
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('markAsTaken')}</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => updateReminderStatus(rem.id, isTaken ? 'pending' : 'completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                        isTaken
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isTaken ? (language === 'hi' ? 'परामर्श पूर्ण' : 'Completed') : (language === 'hi' ? 'पूर्ण मार्क करें' : 'Mark Completed')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => triggerReminderNotification(rem)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#0F766E] hover:bg-slate-50 transition-colors"
                    title="Test chime alert for this reminder"
                    aria-label="Ring chime"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove reminder"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE REMINDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0F766E] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'नया स्वास्थ्य रिमाइंडर जोड़ें' : 'Add Healthcare Reminder'}
                </h3>
                <p className="text-xs text-slate-500">
                  {patient.name} ({patient.age}y / {patient.gender}) · Darbhanga
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setReminderType('medicine')}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    reminderType === 'medicine'
                      ? 'bg-white text-[#0F766E] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'दवा सेवन' : 'Medicine Dose'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReminderType('appointment')}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    reminderType === 'appointment'
                      ? 'bg-white text-[#123047] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'डॉक्टर अपॉइंटमेंट' : 'Doctor Appointment'}</span>
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {reminderType === 'medicine'
                    ? (language === 'hi' ? 'दवा का नाम *' : 'Medicine Name *')
                    : (language === 'hi' ? 'अपॉइंटमेंट का उद्देश्य / विभाग *' : 'Appointment Title or Department *')}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    reminderType === 'medicine'
                      ? 'e.g. Amlodipine 5mg, Metformin 500mg, Paracetamol'
                      : 'e.g. Quarterly Cardiac Follow-up, Oncology OPD Review'
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                />
              </div>

              {/* Dosage / Doctor detail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {reminderType === 'medicine'
                    ? (language === 'hi' ? 'खुराक व सेवन निर्देश' : 'Dosage & Intake Instructions')
                    : (language === 'hi' ? 'डॉक्टर का नाम व विशेषज्ञता' : 'Doctor Name & Specialty')}
                </label>
                <input
                  type="text"
                  value={dosageOrDoctor}
                  onChange={(e) => setDosageOrDoctor(e.target.value)}
                  placeholder={
                    reminderType === 'medicine'
                      ? 'e.g. 1 tablet after breakfast with warm water'
                      : 'e.g. Dr. A.K. Jha (MD Medicine)'
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                />
              </div>

              {reminderType === 'appointment' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'अस्पताल अथवा क्लिनिक केंद्र' : 'Hospital or Clinic Facility'}
                  </label>
                  <input
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. DMCH Medicine OPD Room 12, Paras Global Bela"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  />
                </div>
              )}

              {/* Timing & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'समय *' : 'Scheduled Time *'}
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'hi' ? 'तारीख' : 'Scheduled Date'}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पुनरावृत्ति (Recurrence)' : 'Recurrence Schedule'}
                </label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as ReminderRecurrence)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="daily">{language === 'hi' ? 'प्रतिदिन (Daily)' : 'Daily (Every day)'}</option>
                  <option value="twice_daily">{language === 'hi' ? 'दिन में दो बार (Twice Daily)' : 'Twice Daily (Morning & Evening)'}</option>
                  <option value="weekly">{language === 'hi' ? 'साप्ताहिक (Weekly)' : 'Weekly'}</option>
                  <option value="once">{language === 'hi' ? 'केवल एक बार (Once)' : 'Once (Single occurrence)'}</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'अतिरिक्त टिप्पणी या पर्ची निर्देश' : 'Additional Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    reminderType === 'medicine'
                      ? 'e.g. Avoid dairy within 2 hours, monitor pulse'
                      : 'e.g. Carry previous ultrasound and blood test report'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              {/* Audio Chime Checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={audioChimeEnabled}
                  onChange={(e) => setAudioChimeEnabled(e.target.checked)}
                  className="rounded text-[#0F766E]"
                />
                <span>
                  {language === 'hi'
                    ? 'अलर्ट समय पर मधुर घंटी (Audio Chime) बजाएं'
                    : 'Play gentle audio chime sound when reminder matures'}
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {language === 'hi' ? 'रिमाइंडर सहेजें' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
