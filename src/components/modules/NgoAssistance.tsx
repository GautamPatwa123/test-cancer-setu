import React, { useState } from 'react';
import {
  HeartHandshake,
  Building,
  FileText,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  Plus,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { AssistanceApplication, AssistanceStatus } from '../../types/index.ts';
import { Badge } from '../common/Badge.tsx';
import { DemoDataNotice } from '../common/DemoDataNotice.tsx';

export const NgoAssistance: React.FC = () => {
  const {
    ngos,
    govtSchemes,
    assistanceApplications,
    createAssistanceApplication,
    patient,
    setCurrentPage,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ngos' | 'schemes' | 'my-applications'>('ngos');
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState<AssistanceApplication | null>(null);

  // Application Form State
  const [category, setCategory] = useState<AssistanceApplication['category']>('Oncology / Cancer Care');
  const [treatmentNeed, setTreatmentNeed] = useState<string>('Adjuvant Chemotherapy & Travel Grant');
  const [hospitalName, setHospitalName] = useState<string>('DMCH / Mahavir Cancer Sansthan');
  const [supportType, setSupportType] = useState<AssistanceApplication['supportType']>('Financial Aid');
  const [estimatedCost, setEstimatedCost] = useState<number>(65000);
  const [docsChecklist, setDocsChecklist] = useState({
    incomeCertificate: true,
    rationCard: true,
    medicalDiagnosisReport: true,
    hospitalCostEstimate: false,
  });
  const [notes, setNotes] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      alert('Please provide consent for the demonstration submission.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createAssistanceApplication({
        patientId: patient.id,
        patientName: patient.name,
        applicantId: `DEMO-APPL-${Math.floor(100 + Math.random() * 900)}`,
        category,
        treatmentNeed,
        hospitalName,
        supportType,
        estimatedCost: Number(estimatedCost),
        requiredDocuments: docsChecklist,
        notes,
        consentGiven,
      });

      setIsSubmitting(false);
      setShowApplyModal(false);
      setActiveTab('my-applications');
      setSelectedAppDetail(created);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              Financial Assistance and Support
            </h2>
            <DemoDataNotice label="NON-PROFIT & GOVT DIRECTORY" />
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Explore support resources, discover health schemes, and track demonstration grant applications.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="self-start sm:self-center inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Assistance</span>
        </button>
      </div>

      {/* THREE SECTION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ngos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'ngos'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          NGO Directory ({ngos.length})
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'schemes'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Government Healthcare Schemes ({govtSchemes.length})
        </button>

        <button
          onClick={() => setActiveTab('my-applications')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'my-applications'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>My Applications</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
            {assistanceApplications.length}
          </span>
        </button>
      </div>

      {/* DISCLAIMER NOTICE */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Non-Guarantee Disclaimer:</strong> SehatSetu connects patients with verified directory information for charitable non-profits and government programs. Submission of a demo application does NOT promise approval, reimbursement, or direct financial aid. Official approvals are determined solely by authorized NGO trust committees and government health boards.
        </div>
      </div>

      {/* TAB 1: NGO DIRECTORY */}
      {activeTab === 'ngos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{ngo.name}</h3>
                    <p className="text-xs text-[#0F766E] font-semibold mt-0.5">{ngo.category}</p>
                  </div>
                  <Badge variant="verified">Registered NGO</Badge>
                </div>

                <div className="py-3 space-y-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-700 block">Area Served:</span>
                    <span>{ngo.areaServed}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Focus & Support:</span>
                    <span>{ngo.focusArea}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Eligibility:</span>
                    <span className="text-slate-500">{ngo.eligibility}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Verified Helpline:</span>
                    <span className="text-slate-800 font-mono">{ngo.contact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">{ngo.website}</span>
                <button
                  onClick={() => {
                    setCategory('Oncology / Cancer Care');
                    setHospitalName('DMCH Referral Center');
                    setShowApplyModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                >
                  Apply to NGO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: GOVERNMENT HEALTHCARE SCHEMES */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {govtSchemes.map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{sch.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{sch.ministry}</p>
                  </div>
                  <Badge variant="info">Govt Scheme</Badge>
                </div>

                <div className="my-3 p-3 bg-teal-50/70 rounded-xl border border-teal-200/60 text-xs">
                  <span className="text-[11px] font-bold text-teal-800 uppercase block">Maximum Benefit</span>
                  <div className="text-base font-extrabold text-[#0F766E] mt-0.5">
                    {sch.coverageAmount}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-700 block">Beneficiary Target:</span>
                    <span>{sch.beneficiaryType}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">Eligibility:</span>
                    <span className="text-slate-500">{sch.eligibility}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block">How to Apply (Darbhanga):</span>
                    <span className="text-slate-700">{sch.howToApply}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Free facilitation at DMCH Kiosk</span>
                <button
                  onClick={() => setCurrentPage('hospitals')}
                  className="text-[#0F766E] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Empaneled Centers</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MY APPLICATIONS */}
      {activeTab === 'my-applications' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {assistanceApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedAppDetail(app)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-[#0F766E] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0 mt-0.5">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900">{app.category}</h4>
                      <span className="text-xs text-slate-400 font-mono">({app.id})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {app.treatmentNeed} • Center: <strong>{app.hospitalName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Submitted on: {app.createdAt} • Applicant: {app.patientName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                  <Badge variant={app.status === 'Under Review' ? 'warning' : app.status === 'Documents Required' ? 'danger' : 'info'}>
                    Stage: {app.status}
                  </Badge>
                  <span className="text-xs text-[#0F766E] font-bold hover:underline">
                    View Chronological Audit →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APPLY FOR ASSISTANCE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close application dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Demonstration Assistance Request
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applicant ID: DEMO-APPL-771 ({patient.name})
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <strong>No Identity Documents Required:</strong> For this startup prototype, do not upload real Aadhaar numbers, PAN cards, or bank credentials.
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Healthcare Need / Assistance Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Oncology / Cancer Care">Oncology / Cancer Care</option>
                  <option value="Cardiac Surgery">Cardiac Surgery</option>
                  <option value="Dialysis Support">Dialysis Support</option>
                  <option value="Rare Disease / Pediatric">Rare Disease / Pediatric Care</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Treatment or Procedure
                </label>
                <input
                  type="text"
                  required
                  value={treatmentNeed}
                  onChange={(e) => setTreatmentNeed(e.target.value)}
                  placeholder="E.g. Radiation therapy cycles & chemotherapy support"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Treating Hospital</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="E.g. DMCH Oncology Block"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Support Category</label>
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Financial Aid">Direct Financial Grant</option>
                    <option value="Medicine Subsidy">Chemotherapy / Medicine Subsidy</option>
                    <option value="Ration & Travel Grant">Ration & Travel Assistance</option>
                    <option value="Ayushman Gap Funding">Ayushman Gap Funding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Treatment Cost (₹ INR)
                </label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {/* Document Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Required Document Availability Checklist (Demo)
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={docsChecklist.incomeCertificate}
                      onChange={(e) => setDocsChecklist({ ...docsChecklist, incomeCertificate: e.target.checked })}
                      className="rounded text-[#0F766E]"
                    />
                    <span>Income Certificate (Annual income under ₹2.5 Lakhs)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={docsChecklist.rationCard}
                      onChange={(e) => setDocsChecklist({ ...docsChecklist, rationCard: e.target.checked })}
                      className="rounded text-[#0F766E]"
                    />
                    <span>BPL / Priority Household Ration Card</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={docsChecklist.medicalDiagnosisReport}
                      onChange={(e) => setDocsChecklist({ ...docsChecklist, medicalDiagnosisReport: e.target.checked })}
                      className="rounded text-[#0F766E]"
                    />
                    <span>Biopsy / Histopathology Diagnosis Report from DMCH</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={docsChecklist.hospitalCostEstimate}
                      onChange={(e) => setDocsChecklist({ ...docsChecklist, hospitalCostEstimate: e.target.checked })}
                      className="rounded text-[#0F766E]"
                    />
                    <span>Authorized Hospital Cost Estimate Slip</span>
                  </label>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-start gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded text-[#0F766E]"
                  />
                  <span>
                    I confirm this is a competition demonstration submission with synthetic details.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !consentGiven}
                  className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATION CHRONOLOGICAL STATUS AUDIT MODAL */}
      {selectedAppDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedAppDetail(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close details dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Application Timeline & Audit History
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedAppDetail.id} • {selectedAppDetail.category}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <Badge variant="warning">{selectedAppDetail.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hospital:</span>
                  <strong className="text-slate-800">{selectedAppDetail.hospitalName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Support:</span>
                  <strong className="text-emerald-700">₹{selectedAppDetail.estimatedCost.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2">Chronological Status Steps:</h4>
                <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedAppDetail.history.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#0F766E] ring-2 ring-white" />
                      <div className="font-bold text-slate-900">{step.status}</div>
                      <div className="text-[11px] text-slate-500">{step.timestamp} • by {step.actor}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{step.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedAppDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
