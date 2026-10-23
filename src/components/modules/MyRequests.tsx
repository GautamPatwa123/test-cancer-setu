import React, { useState } from 'react';
import {
  Clock,
  Droplets,
  Ambulance,
  HeartHandshake,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Badge } from '../common/Badge.tsx';

export const MyRequests: React.FC = () => {
  const { bloodRequests, ambulanceRequests, assistanceApplications, documents, patient } = useApp();

  const [serviceFilter, setServiceFilter] = useState<'ALL' | 'Blood' | 'Ambulance' | 'Assistance' | 'Document'>('ALL');
  const [selectedDetailModal, setSelectedDetailModal] = useState<any | null>(null);

  // Unify all requests into a standardized table shape
  const allRequests = [
    ...bloodRequests.map((b) => ({
      id: b.id,
      service: 'Blood' as const,
      summary: `${b.units} Unit(s) of ${b.bloodGroup} ${b.component}`,
      target: b.centreName,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      status: b.status,
      raw: b,
    })),
    ...ambulanceRequests.map((a) => ({
      id: a.id,
      service: 'Ambulance' as const,
      summary: `${a.category} from ${a.pickupLocation}`,
      target: a.providerName,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      status: a.status,
      raw: a,
    })),
    ...assistanceApplications.map((app) => ({
      id: app.id,
      service: 'Assistance' as const,
      summary: `${app.category} • ₹${app.estimatedCost.toLocaleString('en-IN')}`,
      target: app.hospitalName,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      status: app.status,
      raw: app,
    })),
    ...documents.map((doc) => ({
      id: doc.id,
      service: 'Document' as const,
      summary: `${doc.title} (${doc.category})`,
      target: 'AI Translation Vault',
      createdAt: doc.uploadedAt,
      updatedAt: doc.uploadedAt,
      status: doc.aiExplanation ? 'AI Translated' : 'Uploaded',
      raw: doc,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredRequests = allRequests.filter((r) => {
    if (serviceFilter !== 'ALL' && r.service !== serviceFilter) return false;
    return true;
  });

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'Blood':
        return <Droplets className="w-4 h-4 text-red-600" />;
      case 'Ambulance':
        return <Ambulance className="w-4 h-4 text-amber-600" />;
      case 'Assistance':
        return <HeartHandshake className="w-4 h-4 text-rose-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string): any => {
    if (status.includes('Confirmed') || status.includes('Completed') || status.includes('Translated')) {
      return 'success';
    }
    if (status.includes('Awaiting') || status.includes('Under Review') || status.includes('Submitted')) {
      return 'warning';
    }
    if (status.includes('Required')) {
      return 'danger';
    }
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
            My Healthcare Requests
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time chronological tracking across blood, ambulance, document translation, and grant applications.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          Total Logs: <strong>{allRequests.length}</strong>
        </span>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Requests' },
          { id: 'Blood', label: 'Blood Enquiries' },
          { id: 'Ambulance', label: 'Ambulance Dispatches' },
          { id: 'Assistance', label: 'Financial Grants' },
          { id: 'Document', label: 'Document Translations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setServiceFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              serviceFilter === tab.id
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REQUESTS TABLE / CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Summary & Details</th>
                <th className="py-3 px-4">Healthcare Hub</th>
                <th className="py-3 px-4">Date Created</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedDetailModal(req)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                      {getServiceIcon(req.service)}
                      <span>{req.service}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {req.summary}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">
                    {req.target}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {req.createdAt}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(req.status)}>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailModal(req);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#0F766E] hover:bg-teal-50 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL WITH CHRONOLOGICAL TIMELINE */}
      {selectedDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedDetailModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close request modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-3 bg-teal-100 text-[#0F766E] rounded-xl">
                {getServiceIcon(selectedDetailModal.service)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDetailModal.service} Request Audit Detail
                </h3>
                <p className="text-xs text-slate-500">
                  ID: {selectedDetailModal.id} • Patient: {patient.name}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Category:</span>
                  <strong className="text-slate-900">{selectedDetailModal.service}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Summary:</span>
                  <span className="text-slate-800">{selectedDetailModal.summary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Healthcare Facility:</span>
                  <span className="text-slate-800">{selectedDetailModal.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <Badge variant={getStatusBadgeVariant(selectedDetailModal.status)}>
                    {selectedDetailModal.status}
                  </Badge>
                </div>
              </div>

              {/* Timeline History */}
              {selectedDetailModal.raw.history ? (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-2">Chronological Status History:</h4>
                  <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {selectedDetailModal.raw.history.map((step: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#0F766E] ring-2 ring-white" />
                        <div className="font-bold text-slate-900">{step.status}</div>
                        <div className="text-[11px] text-slate-500">{step.timestamp} • {step.actor}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{step.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-500 text-xs">
                  Direct document record securely cataloged in your medical vault.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedDetailModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
