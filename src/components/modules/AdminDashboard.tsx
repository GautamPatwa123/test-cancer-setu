import React, { useState } from 'react';
import {
  ShieldCheck,
  Droplets,
  Ambulance,
  HeartHandshake,
  FileText,
  Building2,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Badge } from '../common/Badge.tsx';
import { DemoDataNotice } from '../common/DemoDataNotice.tsx';
import { RequestStatus, AmbulanceStatus, AssistanceStatus } from '../../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const {
    bloodRequests,
    ambulanceRequests,
    assistanceApplications,
    documents,
    hospitals,
    ambulances,
    bloodCentres,
    auditLogs,
    updateBloodRequestStatus,
    updateAmbulanceRequestStatus,
    updateAssistanceStatus,
    setShowResetConfirmModal,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'blood' | 'ambulance' | 'assistance' | 'audit'>('overview');

  // Synthetic admin stats
  const totalUsers = 124; // Simulated district user base
  const totalRequests = bloodRequests.length + ambulanceRequests.length + assistanceApplications.length;
  const totalProviders = hospitals.length + ambulances.length + bloodCentres.length;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-[#123047] text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full">
                Administrator View
              </span>
              <span className="text-xs text-slate-300">
                DMCH Regional Health Coordination Desk
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              SehatSetu Operations Command
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Simulated administrative control center for district healthcare triage, blood availability routing, and NGO caseworkers in Darbhanga, Bihar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Baseline</span>
            </button>
          </div>
        </div>
      </div>

      <DemoDataNotice label="ADMINISTRATIVE PROTOTYPE — SYNTHETIC DISTRICT FIGURES" />

      {/* SYNTHETIC STATISTICS TILES (7 Requested Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Demo Users</span>
          <div className="text-xl font-extrabold text-[#123047] mt-0.5">{totalUsers}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Active accounts</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Requests</span>
          <div className="text-xl font-extrabold text-[#0F766E] mt-0.5">{totalRequests}</div>
          <span className="text-[10px] text-slate-400">All modules</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Blood Enquiries</span>
          <div className="text-xl font-extrabold text-red-600 mt-0.5">{bloodRequests.length}</div>
          <span className="text-[10px] text-red-700">Bank routed</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Ambulance Calls</span>
          <div className="text-xl font-extrabold text-amber-600 mt-0.5">{ambulanceRequests.length}</div>
          <span className="text-[10px] text-amber-800">Dispatch logs</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">NGO Grants</span>
          <div className="text-xl font-extrabold text-rose-600 mt-0.5">{assistanceApplications.length}</div>
          <span className="text-[10px] text-rose-700">Casework review</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Providers Listed</span>
          <div className="text-xl font-extrabold text-indigo-600 mt-0.5">{totalProviders}</div>
          <span className="text-[10px] text-indigo-700">Verified centers</span>
        </div>
      </div>

      {/* ADMIN WORKFLOW TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Operations Overview
        </button>

        <button
          onClick={() => setActiveTab('blood')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'blood'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Manage Blood Requests ({bloodRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('ambulance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ambulance'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Ambulance Dispatch Desk ({ambulanceRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('assistance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'assistance'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          NGO Review Desk ({assistanceApplications.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#123047] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          System Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent System Alerts */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-[#172B3A]">
              District Health Operations & Verification Health
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">DMCH Model Blood Centre Integrated:</strong>
                  Stock component sync operating normally. Daily verification logged by Dr. Verma.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Unverified Provider Audit:</strong>
                  Mithila Hospital empanelment pending Ayushman Mitra documentation upload.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Role-Based Access Control (RBAC):</strong>
                  Patient health records are encrypted and isolated. Only authorized case-workers and treating facilities receive tokenized access upon explicit patient consent.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Role Simulation Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-sm text-[#172B3A]">Demonstration Controls</h3>
            <p className="text-slate-500 leading-relaxed">
              Use the sub-tabs above to test simulated state transitions (e.g. approve an ambulance dispatch, advance a blood availability inquiry, or approve a cancer care assistance grant).
            </p>
            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
              <strong>Tip for Evaluators:</strong> Changes made here immediately update in the patient's view and 'My Requests' page.
            </div>
          </div>
        </div>
      )}

      {/* BLOOD REQUESTS MANAGER TAB */}
      {activeTab === 'blood' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              Simulate Blood Enquiry Status Progression
            </h3>
            <div className="divide-y divide-slate-100">
              {bloodRequests.map((b) => (
                <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{b.id}</strong>
                      <Badge variant="warning">{b.status}</Badge>
                      <span className="text-slate-500">{b.bloodGroup} {b.component} ({b.units} units)</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Target: {b.centreName} • Patient: {b.patientName} ({b.patientPhone})
                    </p>
                  </div>

                  {/* Status transition buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {b.status === 'Submitted' && (
                      <button
                        onClick={() => updateBloodRequestStatus(b.id, 'Awaiting Provider Confirmation', 'Nodal desk queued request with blood bank stock manager.')}
                        className="px-2.5 py-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600"
                      >
                        Advance to "Awaiting"
                      </button>
                    )}
                    {b.status === 'Awaiting Provider Confirmation' && (
                      <button
                        onClick={() => updateBloodRequestStatus(b.id, 'Confirmed by Provider', 'DMCH blood bank confirmed donor unit ready for cross-match.')}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Confirm Availability
                      </button>
                    )}
                    {b.status === 'Confirmed by Provider' && (
                      <button
                        onClick={() => updateBloodRequestStatus(b.id, 'Closed', 'Blood units successfully dispatched to surgery ward.')}
                        className="px-2.5 py-1.5 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800"
                      >
                        Close / Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AMBULANCE DISPATCH TAB */}
      {activeTab === 'ambulance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              Simulate Ambulance Dispatch Operations
            </h3>
            <div className="divide-y divide-slate-100">
              {ambulanceRequests.map((a) => (
                <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{a.id}</strong>
                      <Badge variant="warning">{a.status}</Badge>
                      <span className="text-slate-500">{a.category}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Pickup: {a.pickupLocation} → {a.destination} ({a.providerName})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === 'Request Submitted' && (
                      <button
                        onClick={() => updateAmbulanceRequestStatus(a.id, 'Awaiting Operator Confirmation', 'Operator received dispatch ping.')}
                        className="px-2.5 py-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600"
                      >
                        Ping Operator
                      </button>
                    )}
                    {a.status === 'Awaiting Operator Confirmation' && (
                      <button
                        onClick={() => updateAmbulanceRequestStatus(a.id, 'Accepted in Demo', 'Driver assigned with oxygen unit: BR-07-P-8821.')}
                        className="px-2.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                      >
                        Accept Dispatch
                      </button>
                    )}
                    {a.status === 'Accepted in Demo' && (
                      <button
                        onClick={() => updateAmbulanceRequestStatus(a.id, 'Completed in Demo', 'Patient arrived safely at DMCH Emergency Gate.')}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ASSISTANCE REVIEW DESK TAB */}
      {activeTab === 'assistance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              Review NGO and Financial Support Applications
            </h3>
            <div className="divide-y divide-slate-100">
              {assistanceApplications.map((app) => (
                <div key={app.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900">{app.id}</strong>
                      <Badge variant="info">{app.status}</Badge>
                      <span className="text-slate-700 font-semibold">{app.category}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Need: {app.treatmentNeed} • Center: {app.hospitalName} • Est: ₹{app.estimatedCost.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === 'Submitted' && (
                      <button
                        onClick={() => updateAssistanceStatus(app.id, 'Under Review', 'Case worker appointed for preliminary income verification.')}
                        className="px-2.5 py-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600"
                      >
                        Take Under Review
                      </button>
                    )}
                    {app.status === 'Under Review' && (
                      <button
                        onClick={() => updateAssistanceStatus(app.id, 'Documents Required', 'Requested DMCH biopsy histology slip.')}
                        className="px-2.5 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
                      >
                        Request Documents
                      </button>
                    )}
                    {app.status === 'Documents Required' && (
                      <button
                        onClick={() => updateAssistanceStatus(app.id, 'Decision Pending', 'All documents submitted; forwarded to NGO board.')}
                        className="px-2.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                      >
                        Advance to Board
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            System Security & Action Audit Trail
          </h3>
          <div className="divide-y divide-slate-100 font-mono text-[11px]">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">{log.timestamp}</span>
                  <span className="font-bold text-[#0F766E]">[{log.entityType}]</span>
                  <span className="font-bold text-slate-900">{log.action}:</span>
                  <span className="text-slate-600">{log.details}</span>
                </div>
                <span className="text-slate-400 text-[10px] shrink-0">Actor: {log.actor}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
