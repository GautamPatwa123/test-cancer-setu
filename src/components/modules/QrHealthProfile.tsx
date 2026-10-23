import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  ShieldCheck,
  Eye,
  RotateCcw,
  Download,
  AlertTriangle,
  Lock,
  Phone,
  Check,
  X,
  ExternalLink,
  ShieldAlert,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Badge } from '../common/Badge.tsx';

export const QrHealthProfile: React.FC = () => {
  const {
    patient,
    toggleSharedField,
    regenerateQrToken,
    revokeQrToken,
    setPublicQrPreviewToken,
    setCurrentPage,
  } = useApp();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Generate QR code whenever token or active state changes
  useEffect(() => {
    if (!patient.qrActive) {
      setQrDataUrl('');
      return;
    }

    const shareUrl = `${window.location.origin}/?token=${patient.qrToken}`;
    QRCode.toDataURL(shareUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#123047',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));
  }, [patient.qrToken, patient.qrActive]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?token=${patient.qrToken}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `SehatSetu_Emergency_QR_${patient.alias}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const isExpired = new Date(patient.qrTokenExpiry).getTime() < Date.now();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              QR Health Profile
            </h2>
            <Badge variant="info">Restricted Tokenized Link</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Create a shareable emergency health summary for demonstration purposes.
          </p>
        </div>

        <button
          onClick={() => setShowPreviewModal(true)}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Shared Profile</span>
        </button>
      </div>

      {/* NOTICE: Not a certified medical record */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demonstration Privacy Safeguard:</strong> The QR code does NOT contain your raw medical records. It points to a temporary, revocable emergency summary token. Only fields you explicitly check below will be visible to a scanning paramedic or ER doctor. This demo QR is not an official certified emergency medical ID.
        </div>
      </div>

      {/* TWO COLUMN GRID: Left = QR Card & Actions; Right = Field Permission Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: QR Code Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs text-center space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-800">Emergency Access Token</span>
            <Badge variant={patient.qrActive ? 'success' : 'danger'}>
              {patient.qrActive ? 'Active' : 'Revoked'}
            </Badge>
          </div>

          {/* QR Display Frame */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto relative shadow-inner">
            {patient.qrActive && qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="SehatSetu Emergency QR Code"
                className="w-56 h-56 mx-auto rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-100 rounded-lg text-slate-400 p-4">
                <ShieldAlert className="w-12 h-12 text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-600">Access Revoked</p>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Generate a new token to create an active emergency QR code.
                </p>
              </div>
            )}
          </div>

          {/* Token info */}
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-mono font-bold text-slate-700">Token: {patient.qrToken}</p>
            <p className="text-[11px]">
              Validity: 48 Hours • {patient.qrActive ? 'Secured with random seed' : 'Inactive'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleDownloadQr}
              disabled={!patient.qrActive}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download QR</span>
            </button>

            <button
              onClick={handleCopyLink}
              disabled={!patient.qrActive}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={regenerateQrToken}
              className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Generate New Token</span>
            </button>

            {patient.qrActive ? (
              <button
                onClick={revokeQrToken}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Revoke Demo Link</span>
              </button>
            ) : (
              <button
                onClick={regenerateQrToken}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Re-activate Link</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Explicit Field Sharing Configuration */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-[#172B3A]">
                Configure Emergency Shared Fields
              </h3>
              <p className="text-xs text-slate-500">
                Choose precisely what first responders and physicians see upon scanning.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#0F766E]">Granular Privacy</span>
          </div>

          <div className="space-y-3">
            {/* Alias */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Patient Alias & Age</strong>
                <span className="text-[11px] text-slate-500">{patient.alias} ({patient.age}y, {patient.gender})</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.alias}
                onChange={() => toggleSharedField('alias')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Blood Group */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Blood Group</strong>
                <span className="text-[11px] text-slate-500">{patient.bloodGroup} (Vital for emergency transfusion)</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.bloodGroup}
                onChange={() => toggleSharedField('bloodGroup')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Allergies */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Known Critical Drug Allergies</strong>
                <span className="text-[11px] text-slate-500">{patient.allergies.join(', ') || 'None recorded'}</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.allergies}
                onChange={() => toggleSharedField('allergies')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Chronic Conditions */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Chronic Conditions</strong>
                <span className="text-[11px] text-slate-500">{patient.chronicConditions.join(', ') || 'None recorded'}</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.conditions}
                onChange={() => toggleSharedField('conditions')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Medications */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Current Regular Medications</strong>
                <span className="text-[11px] text-slate-500">{patient.currentMedications.join(', ') || 'None'}</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.medications}
                onChange={() => toggleSharedField('medications')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Next-of-Kin Emergency Contact</strong>
                <span className="text-[11px] text-slate-500">{patient.emergencyContact.name} ({patient.emergencyContact.relationship}) • {patient.emergencyContact.phone}</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.emergencyContact}
                onChange={() => toggleSharedField('emergencyContact')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Preferred Hospital */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Preferred Hospital in Darbhanga</strong>
                <span className="text-[11px] text-slate-500">{patient.preferredHospital}</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.preferredHospital}
                onChange={() => toggleSharedField('preferredHospital')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>

            {/* Medical Summary */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <strong className="text-xs text-slate-800 block">Clinical Summary Notes</strong>
                <span className="text-[11px] text-slate-500">{patient.medicalSummary}</span>
              </div>
              <input
                type="checkbox"
                checked={patient.sharedFields.medicalSummary}
                onChange={() => toggleSharedField('medicalSummary')}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW SHARED PROFILE MODAL (What first responder sees) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close preview modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-teal-100 text-[#0F766E] rounded-xl">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  First Responder View Preview
                </h3>
                <p className="text-xs text-slate-500">
                  This exact card renders when an authorized emergency contact scans your QR.
                </p>
              </div>
            </div>

            {patient.qrActive ? (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {patient.sharedFields.alias ? patient.name : 'Patient Summary'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Darbhanga, Bihar • Token: {patient.qrToken}
                    </p>
                  </div>
                  {patient.sharedFields.bloodGroup && (
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                      {patient.bloodGroup}
                    </div>
                  )}
                </div>

                <div className="divide-y divide-slate-200 text-xs">
                  {patient.sharedFields.allergies && (
                    <div className="py-2">
                      <span className="font-bold text-red-700 block">Critical Allergies:</span>
                      <span className="text-slate-700 font-medium">{patient.allergies.join(', ') || 'None'}</span>
                    </div>
                  )}

                  {patient.sharedFields.conditions && (
                    <div className="py-2">
                      <span className="font-bold text-slate-700 block">Chronic Conditions:</span>
                      <span className="text-slate-700">{patient.chronicConditions.join(', ')}</span>
                    </div>
                  )}

                  {patient.sharedFields.medications && (
                    <div className="py-2">
                      <span className="font-bold text-slate-700 block">Current Medications:</span>
                      <span className="text-slate-700">{patient.currentMedications.join(', ')}</span>
                    </div>
                  )}

                  {patient.sharedFields.emergencyContact && (
                    <div className="py-2">
                      <span className="font-bold text-slate-700 block">Emergency Contact:</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-slate-800">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</span>
                        <a
                          href={`tel:${patient.emergencyContact.phone}`}
                          className="px-2.5 py-1 bg-[#0F766E] text-white font-bold rounded-lg text-[11px] flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {patient.sharedFields.preferredHospital && (
                    <div className="py-2">
                      <span className="font-bold text-slate-700 block">Preferred Healthcare Hub:</span>
                      <span className="text-slate-800">{patient.preferredHospital}</span>
                    </div>
                  )}

                  {patient.sharedFields.medicalSummary && (
                    <div className="py-2">
                      <span className="font-bold text-slate-700 block">Physician Summary:</span>
                      <span className="text-slate-600 italic">{patient.medicalSummary}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">
                QR access is currently revoked. No data will be shown to a scanner.
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
