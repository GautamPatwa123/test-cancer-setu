import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  FileCheck,
  Sparkles,
  HelpCircle,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Plus,
  X,
  FileSpreadsheet,
  Stethoscope,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { MedicalDoc } from '../../types/index.ts';
import { Badge } from '../common/Badge.tsx';

export const MedicalDocuments: React.FC = () => {
  const { documents, uploadDocument, updateDocumentAiExplanation, patient, language } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'Laboratory Report' | 'Prescription' | 'Imaging Report' | 'Discharge Summary'>('all');
  const [selectedDocForModal, setSelectedDocForModal] = useState<MedicalDoc | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New Upload Form state
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<MedicalDoc['category']>('Laboratory Report');
  const [notes, setNotes] = useState<string>('');
  const [simulatedFileName, setSimulatedFileName] = useState<string>('CBC_Platelet_Count_Report.pdf');
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);

  const totalDocs = documents.length;
  const labReports = documents.filter((d) => d.category === 'Laboratory Report').length;
  const prescriptions = documents.filter((d) => d.category === 'Prescription').length;
  const dischargeSummaries = documents.filter((d) => d.category === 'Discharge Summary' || d.category === 'Imaging Report').length;

  const filteredDocs = documents.filter((d) => {
    if (activeTab === 'all') return true;
    return d.category === activeTab;
  });

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size exceeds the 15 MB limit.');
        return;
      }
      setSimulatedFileName(file.name);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsProcessingUpload(true);
    setTimeout(() => {
      const newDoc = uploadDocument({
        patientId: patient.id,
        title: title.trim(),
        fileName: simulatedFileName,
        category,
        fileSize: '540 KB',
        notes: notes || 'Uploaded for clinical review & AI translation.',
        tags: [category, 'Demo Document'],
        extractedText: `DOCUMENT: ${title}. Category: ${category}. Notes: ${notes}. Verified for patient ${patient.name}.`,
      });

      setIsProcessingUpload(false);
      setShowUploadModal(false);
      setTitle('');
      setNotes('');
      // Trigger AI translation automatically
      handleExplainDoc(newDoc);
    }, 600);
  };

  const handleExplainDoc = async (doc: MedicalDoc) => {
    setSelectedDocForModal(doc);
    if (doc.aiExplanation) return; // already analyzed

    setIsExplaining(true);
    try {
      const res = await fetch('/api/ai/explain-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: doc.fileName,
          category: doc.category,
          notes: doc.notes,
          reportContent: doc.extractedText || doc.notes,
        }),
      });

      const json = await res.json();
      if (json.data) {
        const explanation = {
          documentType: json.data.documentType || doc.category,
          keyFindings: json.data.keyFindings || [
            'Document successfully processed and categorized into patient health file.',
            'Values align with standard ambulatory outpatient baseline.',
          ],
          medicalTermsExplained: json.data.medicalTermsExplained || [
            { term: 'Hemoglobin', meaning: 'Crucial protein in red blood cells that delivers oxygen to tissues.' },
            { term: 'Platelets', meaning: 'Blood cells essential for normal blood clotting.' },
          ],
          questionsForDoctor: json.data.questionsForDoctor || [
            'Do these results indicate any need to adjust my regular prescription?',
            'What lifestyle modifications are recommended for these figures?',
          ],
          importantLimitations: json.data.importantLimitations || 'Informational review only. Must be correlated with physical clinical examination by treating physician.',
          source: json.source || 'gemini-ai',
        };

        updateDocumentAiExplanation(doc.id, explanation);
        setSelectedDocForModal({ ...doc, aiExplanation: explanation });
      }
    } catch (err) {
      console.warn('AI report translation error, fallback used:', err);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              My Medical Documents
            </h2>
            <Badge variant="info">AI Document Translator</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Organize medical reports and understand their contents in plain, supportive language.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="self-start sm:self-center inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Medical Report</span>
        </button>
      </div>

      {/* DASHBOARD SUMMARY CARDS (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Demo Documents</span>
          <div className="text-2xl font-extrabold text-[#123047] mt-1">{totalDocs}</div>
          <div className="text-[11px] text-teal-700 mt-0.5">Encrypted in profile vault</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Lab & Pathology Reports</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{labReports}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">CBC, Biochemistry, ESR</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Doctor Prescriptions</span>
          <div className="text-2xl font-extrabold text-[#0F766E] mt-1">{prescriptions}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">DMCH General Medicine OPD</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Imaging & Summaries</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{dischargeSummaries}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Chest X-Ray & Scans</div>
        </div>
      </div>

      {/* PRIVACY & RESTRICTED ACCESS NOTICE */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#0F766E] shrink-0" />
          <span>
            <strong>Patient Privacy Shield:</strong> Uploaded documents in this demonstration are stored locally and accessible only to the demo patient ({patient.name}). They are never indexed or exposed to public search engines.
          </span>
        </div>
        <span className="text-[10px] bg-white border border-slate-300 font-bold px-2 py-0.5 rounded text-slate-600 shrink-0">
          Synthetic Records
        </span>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'Laboratory Report', label: 'Lab Reports' },
          { id: 'Prescription', label: 'Prescriptions' },
          { id: 'Imaging Report', label: 'Imaging / X-Ray' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#123047] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DOCUMENTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                      {doc.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {doc.category} • {doc.fileSize}
                    </span>
                  </div>
                </div>
                <Badge variant={doc.aiExplanation ? 'success' : 'neutral'}>
                  {doc.aiExplanation ? 'AI Translated' : 'Processed'}
                </Badge>
              </div>

              <div className="py-3 space-y-2 text-xs text-slate-600">
                <p className="line-clamp-2 text-slate-500">
                  {doc.notes}
                </p>
                <div className="text-[11px] text-slate-400">
                  Uploaded on: <strong>{doc.uploadedAt}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDocForModal(doc)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => handleExplainDoc(doc)}
                className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Plain Language</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD REPORT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close upload dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2.5 bg-teal-100 text-[#0F766E] rounded-xl">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload & Translate Medical Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    Securely add lab slips, discharge records, or prescriptions.
                  </p>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#0F766E] rounded-xl p-6 text-center bg-slate-50/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-[#0F766E] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  Drag and drop files here, or browse from device
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PDF, JPG, PNG up to 15 MB
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleSimulatedFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-3 inline-block px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold rounded-lg cursor-pointer text-slate-700 shadow-2xs"
                >
                  Browse Files
                </label>
                {simulatedFileName && (
                  <div className="mt-2 text-xs font-semibold text-[#0F766E]">
                    Selected file: {simulatedFileName}
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Blood Sugar & Lipid Profile"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Laboratory Report">Laboratory Report</option>
                    <option value="Prescription">Doctor Prescription</option>
                    <option value="Imaging Report">Imaging / X-Ray / Scan</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Other">Other Medical File</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Destination
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`Vault: ${patient.name}`}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Clinical Notes / Doctor Advice
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Prescribed by Dr. A.K. Jha at DMCH OPD for routine review"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingUpload}
                  className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  {isProcessingUpload ? 'Uploading...' : 'Save & Explain Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI REPORT EXPLANATION MODAL (Section 11 Specifics) */}
      {selectedDocForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedDocForModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close report explanation modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-3 bg-teal-100 text-[#0F766E] rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  AI Report Plain-Language Explanation
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedDocForModal.title} ({selectedDocForModal.fileName})
                </p>
              </div>
            </div>

            {isExplaining ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Translating medical terminology into plain language...
                </p>
                <p className="text-[11px] text-slate-400">
                  Evaluating reference ranges and identifying clarifying questions for your doctor.
                </p>
              </div>
            ) : selectedDocForModal.aiExplanation ? (
              <div className="space-y-4">
                {/* 1. Document Type */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">1. Document Type:</span>
                  <Badge variant="info">{selectedDocForModal.aiExplanation.documentType}</Badge>
                </div>

                {/* 2. Key Findings stated in report */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                    <span>2. Key Findings Stated in the Report</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDocForModal.aiExplanation.keyFindings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-teal-50/60 border border-teal-100 text-xs sm:text-sm text-slate-800 leading-relaxed"
                      >
                        {finding}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Medical Terms Explained */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <span>3. Medical Terms Explained Simply</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDocForModal.aiExplanation.medicalTermsExplained.map((termItem, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs space-y-1"
                      >
                        <strong className="text-blue-700 font-bold block">{termItem.term}</strong>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{termItem.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Questions the patient may ask a doctor */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>4. Questions You May Ask Your Doctor</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDocForModal.aiExplanation.questionsForDoctor.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        "{q}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Important Limitations */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>5. Clinical Limitations:</strong> {selectedDocForModal.aiExplanation.importantLimitations}
                  </div>
                </div>

                {/* Extracted Raw Snippet (Distinguishing extracted facts from AI interpretation) */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Direct Extracted Document Text (Raw Facts)
                  </span>
                  <div className="p-2.5 rounded-lg bg-slate-100 text-[11px] font-mono text-slate-600 overflow-x-auto whitespace-pre-wrap max-h-28">
                    {selectedDocForModal.extractedText || 'Raw text extracted via OCR.'}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedDocForModal(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0d655e] rounded-xl shadow-xs"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
