import React, { useState } from 'react';
import {
  X,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  MessageSquare,
  Phone,
  FileCheck,
} from 'lucide-react';
import { BloodGroup, BloodComponent } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { isValidIndianPhone } from '../../utils/healthLogic.ts';

interface BloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCentreId?: string;
  preselectedCentreName?: string;
  initialBloodGroup?: BloodGroup;
}

export const BloodRequestModal: React.FC<BloodRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedCentreId,
  preselectedCentreName,
  initialBloodGroup,
}) => {
  const {
    t,
    language,
    bloodCentres,
    userLocation,
    patient,
    createBloodRequest,
  } = useApp();

  // Multi-step state: 1: Details, 2: Review Screen, 3: Demo Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialBloodGroup || 'B+');
  const [component, setComponent] = useState<BloodComponent>('Packed Red Cells');
  const [units, setUnits] = useState<number>(2);
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Critical Emergency'>('Urgent');
  const [centreId, setCentreId] = useState<string>(
    preselectedCentreId || (bloodCentres.length > 0 ? bloodCentres[0].id : '')
  );
  const [requesterName, setRequesterName] = useState<string>(patient.name);
  const [contactPhone, setContactPhone] = useState<string>(patient.emergencyContact?.phone || '9876543210');
  const [contactPreference, setContactPreference] = useState<'Phone' | 'SMS' | 'WhatsApp (Future)'>('Phone');
  const [additionalNotes, setAdditionalNotes] = useState<string>('Required for inpatient treatment in Darbhanga.');

  // Privacy options
  const [shareApproximateOnly, setShareApproximateOnly] = useState<boolean>(true);
  const [consentToShareWithDonors, setConsentToShareWithDonors] = useState<boolean>(true);

  // Errors & generated request
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCentre = bloodCentres.find((c) => c.id === centreId);
  const resolvedCentreName = selectedCentre ? selectedCentre.name : preselectedCentreName || 'Local Verified Blood Centre';

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!requesterName.trim()) {
      setErrorMsg('Please provide a requester or patient name.');
      return;
    }
    if (!isValidIndianPhone(contactPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian contact number.');
      return;
    }
    if (units < 1 || units > 10) {
      setErrorMsg('Requested units must be between 1 and 10.');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = () => {
    const newReq = createBloodRequest({
      patientId: patient.id,
      patientName: requesterName.trim(),
      bloodGroup,
      component,
      units,
      urgency,
      requiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      centreId: centreId || 'BC-DMCH-01',
      centreName: resolvedCentreName,
      contactPreference,
      patientPhone: contactPhone,
      additionalNotes: `${additionalNotes.trim()} | Location Shared: ${shareApproximateOnly ? 'Approximate Area Only' : 'Specific Location'} (${userLocation.approximateArea})`,
    });

    setSubmittedRequestId(newReq.id);
    setStep(3);
  };

  const handleCancelAndClear = () => {
    setStep(1);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#123047] to-[#0F766E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-red-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {step === 1 && (language === 'hi' ? 'रक्त आवश्यकता अनुरोध' : 'Create Blood Requisition')}
                {step === 2 && (language === 'hi' ? 'डेटा साझाकरण समीक्षा एवं पुष्टि' : 'Review Information Sharing & Confirm')}
                {step === 3 && (language === 'hi' ? 'अनुरोध पंजीकृत (डेमो)' : 'Request Registered (Demo Mode)')}
              </h2>
              <p className="text-xs text-teal-100">
                {step === 1 && 'Step 1 of 3: Enter essential details'}
                {step === 2 && 'Step 2 of 3: Explicit privacy & recipient consent'}
                {step === 3 && 'Step 3 of 3: Demonstration submission notice'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancelAndClear}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details Entry */}
        {step === 1 && (
          <form onSubmit={handleProceedToReview} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Medical Emergency Notice: </span>
                In critical acute trauma or hemorrhagic shock, call <strong>112</strong> immediately and report directly to the DMCH Emergency Trauma Desk. Do not wait for digital confirmations.
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Blood Group *
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white font-bold text-[#0F766E]"
                >
                  {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Component Type *
                </label>
                <select
                  value={component}
                  onChange={(e) => setComponent(e.target.value as BloodComponent)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white"
                >
                  <option value="Packed Red Cells">Packed Red Cells (PRBC)</option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Platelets">Platelet Concentrate (RDP/SDP)</option>
                  <option value="Plasma">Fresh Frozen Plasma (FFP)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Units Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency Classification *
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white"
                >
                  <option value="Normal">Routine / Elective Scheduled</option>
                  <option value="Urgent">Urgent (Needed within 12-24 Hours)</option>
                  <option value="Critical Emergency">Immediate Emergency (Cross-match expedited)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Blood Centre / Hospital
              </label>
              <select
                value={centreId}
                onChange={(e) => setCentreId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white"
              >
                {bloodCentres.map((centre) => (
                  <option key={centre.id} value={centre.id}>
                    {centre.name} ({centre.locality})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requester / Attendant Name *
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone (10 digits) *
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Contact Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Phone', 'SMS', 'WhatsApp (Future)'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setContactPreference(ch)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-colors ${
                      contactPreference === ch
                        ? 'bg-teal-50 border-[#0F766E] text-[#0F766E] font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinical Context / Ward (Optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={2}
                placeholder="Mention hospital ward, IPD number, or surgery schedule..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            {/* Privacy Controls */}
            <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E]">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy & Geolocation Shielding</span>
              </div>
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareApproximateOnly}
                  onChange={(e) => setShareApproximateOnly(e.target.checked)}
                  className="mt-0.5 rounded text-[#0F766E] focus:ring-[#0F766E]"
                />
                <span>
                  <strong>Share approximate area only ({userLocation.approximateArea}).</strong>
                  <span className="block text-slate-500 text-[11px]">
                    Do not transmit precise GPS coordinates or street numbers to volunteer donors.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentToShareWithDonors}
                  onChange={(e) => setConsentToShareWithDonors(e.target.checked)}
                  className="mt-0.5 rounded text-[#0F766E] focus:ring-[#0F766E]"
                />
                <span>
                  <strong>Allow opted-in community donors in this city to view requisition details.</strong>
                  <span className="block text-slate-500 text-[11px]">
                    Only donors who have explicitly opted in will be notified in demonstration mode.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCancelAndClear}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel & Clear
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Continue to Review Screen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Review Screen (Mandatory Consent & Transparency) */}
        {step === 2 && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Mandatory Verification Step:</strong>
                Please review exactly what information will be shared, with whom, and the stated purpose before confirming.
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
                <span>Information That Will Be Shared</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="p-3 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Blood Group & Component:</span>
                  <strong className="text-red-700 font-bold text-sm">
                    {bloodGroup} ({component})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Quantity & Urgency:</span>
                  <strong>{units} Unit(s) • {urgency}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Target Centre:</span>
                  <strong>{resolvedCentreName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contact Channel:</span>
                  <strong>{contactPreference} ({contactPhone})</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[11px]">Geographic Area Disclosed:</span>
                  <strong className="text-slate-800">
                    {shareApproximateOnly ? `Approximate Area (${userLocation.approximateArea})` : 'Exact Location'}
                  </strong>
                  <span className="text-[10px] text-teal-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>High-precision GPS coordinates are masked for your privacy.</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 font-bold text-slate-800">
                Who Receives This Request
              </div>
              <div className="p-3 space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>The on-duty stock desk at <strong>{resolvedCentreName}</strong>.</span>
                </div>
                {consentToShareWithDonors && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <span>Opted-in community volunteer donors registered in {userLocation.city || 'Darbhanga'}.</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>No commercial advertisers, third-party brokers, or unauthorized entities.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 font-bold text-slate-800">
                Purpose of Data Use
              </div>
              <div className="p-3 text-slate-700">
                Solely to coordinate replacement blood units or donor cross-matching under National Blood Transfusion Council (NBTC) guidelines.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Edit</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>I Confirm and Authorize Sharing</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Demo Submission Notice & WhatsApp Transparency */}
        {step === 3 && (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-center">
            <div className="w-14 h-14 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800">
                Requisition Registered: {submittedRequestId}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your enquiry for {units} unit(s) of {bloodGroup} {component} has been queued in your local demo dashboard.
              </p>
            </div>

            {/* MANDATORY WHATSAPP & REAL INTEGRATION DISCLAIMER */}
            <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>DEMONSTRATION NOTICE — NO ACTUAL WHATSAPP NOTIFICATION SENT</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                As required by healthcare platform safety guidelines, <strong>SehatSetu currently runs in demonstration mode</strong>.
                No real WhatsApp messages, SMS alerts, or automated dispatches have been transmitted to blood banks or volunteers.
              </p>
              <div className="pt-1 text-[11px] text-amber-900/80">
                <strong>Next Real-World Steps:</strong> Real donor alerting and inventory reservation require official connection to the Government of India e-RaktKosh API and an authorized Meta WhatsApp Business Cloud API subscription.
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1">
              <div className="font-bold text-slate-700">What to do next:</div>
              <div className="text-slate-600">
                1. Visit the blood bank counter in person with a doctor’s requisition slip and a donor replacement candidate if required.<br />
                2. For urgent stock at DMCH Model Blood Centre, contact <strong>06272-233234</strong>.
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCancelAndClear}
                className="w-full py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-sm"
              >
                View in My Requests & Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
