import React from 'react';
import {
  ShieldAlert,
  Phone,
  Droplets,
  Heart,
  AlertTriangle,
  Building2,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from '../common/Logo.tsx';

interface PublicProfileViewerProps {
  token: string;
  onExit: () => void;
}

export const PublicProfileViewer: React.FC<PublicProfileViewerProps> = ({ token, onExit }) => {
  const { patient } = useApp();

  const isValidToken = patient.qrToken === token && patient.qrActive;
  const isExpired = new Date(patient.qrTokenExpiry).getTime() < Date.now();

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col items-center justify-center p-4">
      {/* Top Brand Bar */}
      <div className="max-w-md w-full mb-4 flex items-center justify-between">
        <Logo size="sm" showTagline={false} />
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Emergency View</span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-7 relative overflow-hidden space-y-5">
        <div className="bg-[#B91C1C] text-white p-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency First Responder Summary</span>
        </div>

        {isValidToken && !isExpired ? (
          <div className="space-y-4">
            {/* Header with Name & Blood Group */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-[#123047]">
                  {patient.sharedFields.alias ? patient.name : 'Emergency Patient'}
                </h2>
                <p className="text-xs text-slate-500">
                  {patient.age}y • {patient.gender} • Darbhanga, Bihar
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Token: {token}
                </p>
              </div>

              {patient.sharedFields.bloodGroup && (
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-extrabold shadow-sm shrink-0">
                  <span className="text-[10px] uppercase font-bold text-red-100">Blood</span>
                  <span className="text-sm">{patient.bloodGroup}</span>
                </div>
              )}
            </div>

            {/* Crucial Shared Fields */}
            <div className="divide-y divide-slate-100 text-xs space-y-2">
              {patient.sharedFields.allergies && (
                <div className="pt-2">
                  <span className="font-bold text-red-700 block">Critical Drug Allergies:</span>
                  <p className="text-slate-800 font-semibold mt-0.5">
                    {patient.allergies.join(', ') || 'No known allergies reported'}
                  </p>
                </div>
              )}

              {patient.sharedFields.conditions && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block">Chronic Conditions:</span>
                  <p className="text-slate-700 mt-0.5">{patient.chronicConditions.join(', ')}</p>
                </div>
              )}

              {patient.sharedFields.medications && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block">Current Medications:</span>
                  <p className="text-slate-700 mt-0.5">{patient.currentMedications.join(', ')}</p>
                </div>
              )}

              {patient.sharedFields.emergencyContact && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block">Next-of-Kin Emergency Contact:</span>
                  <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <strong className="text-slate-900">{patient.emergencyContact.name}</strong>
                      <span className="text-slate-500 text-[11px] block">
                        Relationship: {patient.emergencyContact.relationship}
                      </span>
                    </div>
                    <a
                      href={`tel:${patient.emergencyContact.phone}`}
                      className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#0d655e] text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Contact</span>
                    </a>
                  </div>
                </div>
              )}

              {patient.sharedFields.preferredHospital && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block">Preferred Facility:</span>
                  <p className="text-slate-700 mt-0.5">{patient.preferredHospital}</p>
                </div>
              )}

              {patient.sharedFields.medicalSummary && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700 block">Physician Summary:</span>
                  <p className="text-slate-600 italic mt-0.5">{patient.medicalSummary}</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Notice:</strong> This emergency card displays only data explicitly selected by the patient. In a life-threatening crisis, dial 112 or DMCH emergency at 06272-233234.
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <Lock className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Emergency Link Expired or Revoked
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              This tokenized emergency link ({token}) is no longer active. The patient has revoked access or the 48-hour authorization window has expired.
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onExit}
            className="text-xs font-bold text-[#0F766E] hover:underline"
          >
            Go to SehatSetu Home Portal
          </button>
        </div>
      </div>
    </div>
  );
};
