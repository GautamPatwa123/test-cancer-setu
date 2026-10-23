import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Info,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Badge } from '../common/Badge.tsx';

interface GuidanceResult {
  summary: string;
  understandingTheConcern: string;
  redFlagSigns: string[];
  suggestedNextSteps: string[];
  recommendedSpecialist: string;
  questionsForDoctor: string[];
  urgencyLevel: string;
}

export const AiHealthAssistant: React.FC = () => {
  const { language, setCurrentPage } = useApp();

  const [mode, setMode] = useState<'general' | 'cancer_awareness'>('general');
  const [age, setAge] = useState<string>('30-45');
  const [symptoms, setSymptoms] = useState<string>('');
  const [duration, setDuration] = useState<string>('2-3 weeks');
  const [severity, setSeverity] = useState<string>('Moderate');
  const [history, setHistory] = useState<string>('');
  const [priorEvaluation, setPriorEvaluation] = useState<string>('None');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

  const examplePrompts = [
    { text: 'I have been coughing for several weeks.', mode: 'general' },
    { text: 'I have noticed an unexplained painless lump.', mode: 'cancer_awareness' },
    { text: 'I have persistent unexplained fatigue and weight loss.', mode: 'general' },
    { text: 'I want to understand when cancer screening may be appropriate.', mode: 'cancer_awareness' },
  ];

  const handleApplyExample = (ex: { text: string; mode: string }) => {
    setSymptoms(ex.text);
    setMode(ex.mode as any);
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपने लक्षणों का विवरण लिखें।' : 'Please describe your symptoms.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/symptom-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          symptoms,
          duration,
          severity,
          mode,
          history,
          priorEvaluation,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setResult(data.data);
        setDataSource(data.source || 'gemini-ai');
      } else {
        throw new Error(data.error || 'Failed to generate guidance');
      }
    } catch (err: any) {
      console.warn('API error, using client-side clinical guidance fallback:', err);
      // Clean fallback if offline
      setResult({
        summary: `Reported: "${symptoms}" lasting ${duration} in a person aged ${age}.`,
        understandingTheConcern:
          mode === 'cancer_awareness'
            ? 'Any persistent body changes, unusual lumps, or non-healing lesions that persist for more than 3 weeks warrant systematic clinical palpation, imaging (ultrasound/CT), or biopsy to evaluate whether the origin is inflammatory, cystic, or cellular dysplasia.'
            : 'Respiratory and systemic symptoms of this duration are frequently related to viral hyperreactivity, allergic bronchial irritation, or acid reflux, especially prevalent in northern Bihar agricultural riverine plains.',
        redFlagSigns: [
          'Unexplained weight loss of more than 5-10% of body weight within a short period',
          'Persistent fever or night sweats without an obvious infection source',
          'Presence of blood in cough, stool, or abnormal bleeding',
          'Difficulty swallowing food or progressively increasing pain',
        ],
        suggestedNextSteps: [
          'Schedule an in-person consultation with an internal medicine specialist at DMCH Darbhanga or your nearest district hospital.',
          'Keep a daily record of whether symptoms are worse in the morning, night, or after meals.',
          'Bring any prior prescriptions or diagnostic test slips to your visit.',
        ],
        recommendedSpecialist:
          mode === 'cancer_awareness'
            ? 'Oncologist / General Surgeon at DMCH or Regional Cancer Centre'
            : 'Internal Medicine Specialist / Pulmonologist',
        questionsForDoctor: [
          'What specific blood tests or imaging scans are most useful to pinpoint the cause?',
          'Could these symptoms be linked to seasonal allergies or lifestyle factors?',
          'Under what circumstances should I seek immediate hospital emergency care?',
        ],
        urgencyLevel: severity === 'Severe' ? 'Prompt (Within 48-72h)' : 'Routine',
      });
      setDataSource('clinical-demonstration-engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSymptoms('');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              AI Health Assistant
            </h2>
            <Badge variant="info">Gemini 3.8 Flash</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Understand your symptoms and explore appropriate next steps.
          </p>
        </div>

        {/* Dual Mode Switcher: General vs Cancer Awareness */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => {
              setMode('general');
              if (result) setResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'general'
                ? 'bg-white text-[#0F766E] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General Symptom Guidance
          </button>
          <button
            onClick={() => {
              setMode('cancer_awareness');
              if (result) setResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'cancer_awareness'
                ? 'bg-[#0F766E] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Cancer Awareness & Referral</span>
          </button>
        </div>
      </div>

      {/* MANDATORY CLINICAL SAFETY NOTICE */}
      <div className="p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Non-Diagnostic Information Only:</strong> Symptoms alone cannot confirm or rule out cancer or serious illness. This tool provides structured questions and navigation guidance for healthcare consultations. It does not provide medical diagnoses, treatment prescriptions, or probability scores.
        </div>
      </div>

      {!result ? (
        /* INPUT FORM */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-2xs">
          <form onSubmit={handleRunAssessment} className="space-y-5">
            {/* Quick Example Prompts */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Example symptom concerns (Click to prefill):
              </label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyExample(ex)}
                    className="text-xs bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-[#0F766E] px-3 py-1.5 rounded-lg transition-colors text-left"
                  >
                    "{ex.text}"
                  </button>
                ))}
              </div>
            </div>

            {/* Plain-Language Symptoms Description */}
            <div>
              <label htmlFor="symptoms-input" className="block text-xs font-bold text-[#172B3A] mb-1.5">
                Describe your symptoms in plain language <span className="text-red-500">*</span>
              </label>
              <textarea
                id="symptoms-input"
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="E.g. I have had a continuous dry cough for 3 weeks and mild chest heaviness at night, especially after coming home from work..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
              />
              {errorMessage && (
                <p className="text-xs text-red-600 font-semibold mt-1">{errorMessage}</p>
              )}
            </div>

            {/* Meta Row: Age, Duration, Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Age Range
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  <option value="Under 18">Under 18</option>
                  <option value="18-29">18 - 29</option>
                  <option value="30-45">30 - 45</option>
                  <option value="46-60">46 - 60</option>
                  <option value="60+">60+ (Senior)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration of Symptoms
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  <option value="1-3 days">1 - 3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2-3 weeks">2 - 3 weeks</option>
                  <option value="1-2 months">1 - 2 months</option>
                  <option value="More than 3 months">More than 3 months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Severity as you describe it
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  <option value="Mild (Does not interfere with daily routine)">Mild (Noticeable but manageable)</option>
                  <option value="Moderate (Interferes with some tasks)">Moderate (Interferes with activities)</option>
                  <option value="Severe (Substantially limiting daily life)">Severe (Hard to perform routine tasks)</option>
                </select>
              </div>
            </div>

            {/* Optional Medical History & Prior Evaluation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Relevant medical history (Optional)
                </label>
                <input
                  type="text"
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="E.g. Blood pressure, diabetes, asthma, tobacco use"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Prior medical evaluation (Optional)
                </label>
                <input
                  type="text"
                  value={priorEvaluation}
                  onChange={(e) => setPriorEvaluation(e.target.value)}
                  placeholder="E.g. Visited local clinic last week, took cough syrup"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Clinical Guidance</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* AI RESULTS PAGE (6 Requested Sections + Disclaimers) */
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Top Result Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#E6F5F2] text-[#0F766E] rounded-lg">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#123047]">
                    Clinical Assessment Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mode: {mode === 'cancer_awareness' ? 'Cancer Awareness & Referral' : 'General Symptom Guidance'} • {dataSource}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={result.urgencyLevel.includes('Emergency') ? 'danger' : result.urgencyLevel.includes('Prompt') ? 'warning' : 'info'}>
                  Triage: {result.urgencyLevel}
                </Badge>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Assessment</span>
                </button>
              </div>
            </div>

            {/* 1. Summary of Reported Symptoms */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                1. Summary of Reported Symptoms
              </h4>
              <p className="text-xs sm:text-sm text-[#172B3A] font-medium leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* 2. Understanding the Concern */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                2. Information to Help You Understand the Concern
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-teal-50/50 p-3.5 rounded-xl border border-teal-100">
                {result.understandingTheConcern}
              </p>
            </div>

            {/* 3. Warning Signs (Red Flags) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  3. Warning Signs That Warrant Prompt Medical Attention
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.redFlagSigns.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-50/70 border border-red-100 text-xs text-red-900 flex items-start gap-2"
                  >
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Suggested Next Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Suggested Practical Next Steps
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {result.suggestedNextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Recommended Type of Healthcare Professional */}
            <div className="p-4 rounded-xl bg-[#123047] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  5. Recommended Healthcare Specialist
                </span>
                <p className="text-sm sm:text-base font-extrabold text-white">
                  {result.recommendedSpecialist}
                </p>
                <p className="text-xs text-slate-300">
                  Suggested location: Darbhanga Medical College & Hospital (DMCH) OPD or District Polyclinic
                </p>
              </div>

              <button
                onClick={() => setCurrentPage('hospitals')}
                className="self-start sm:self-center px-4 py-2 bg-[#0F766E] hover:bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Find Hospitals in Darbhanga
              </button>
            </div>

            {/* 6. Questions for Doctor */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                6. Questions You May Wish to Ask Your Doctor
              </h4>
              <div className="space-y-2">
                {result.questionsForDoctor.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 shadow-2xs"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>"{q}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action bottom footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl border border-slate-200 gap-3">
            <span className="text-xs text-slate-500">
              Need to save or print this summary for your appointment?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg"
              >
                Start New Assessment
              </button>
              <button
                onClick={() => setCurrentPage('hospitals')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0d655e] rounded-lg shadow-xs"
              >
                Explore Empaneled Doctors
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
