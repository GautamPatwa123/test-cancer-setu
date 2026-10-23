import React, { useState } from 'react';
import {
  Droplets,
  Search,
  RotateCcw,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Send,
  Info,
  Calendar,
  Building,
  X,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { BloodGroup, BloodComponent, BloodCentre } from '../../types/index.ts';
import { Badge } from '../common/Badge.tsx';
import { DemoDataNotice } from '../common/DemoDataNotice.tsx';
import { EmergencyBanner } from '../common/EmergencyBanner.tsx';
import { BloodRequestModal } from './BloodRequestModal.tsx';

export const BloodAvailability: React.FC = () => {
  const {
    bloodCentres,
    patient,
    userLocation,
    setManualLocation,
    setCurrentPage,
    language,
  } = useApp();

  // Search Filters
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('B+');
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent | 'ALL'>('Packed Red Cells');
  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState<'Normal' | 'Urgent' | 'Critical Emergency'>('Urgent');
  const [bloodScope, setBloodScope] = useState<'city' | 'state' | 'all'>(userLocation.city ? 'city' : 'all');

  // Request Modal State
  const [selectedCentreForRequest, setSelectedCentreForRequest] = useState<BloodCentre | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['Whole Blood', 'Packed Red Cells', 'Platelets', 'Plasma'];

  const activeCity = userLocation.city?.trim().toLowerCase();
  const activeState = userLocation.state?.trim().toLowerCase();

  const filteredCentres = bloodCentres.filter((c) => {
    // Location filter
    if (bloodScope === 'city' && activeCity) {
      if (!c.city || c.city.toLowerCase() !== activeCity) return false;
    } else if (bloodScope === 'state' && activeState) {
      if (!c.state || c.state.toLowerCase() !== activeState) return false;
    }

    if (selectedLocality !== 'ALL' && !c.locality.toLowerCase().includes(selectedLocality.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSelectedGroup('ALL');
    setSelectedComponent('ALL');
    setSelectedLocality('ALL');
  };

  const handleOpenRequestModal = (centre: BloodCentre) => {
    setSelectedCentreForRequest(centre);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              Find Blood and Blood Centres
            </h2>
            <DemoDataNotice label="DEMO STOCK ONLY" />
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Search for participating blood centres and submit availability enquiries.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('requests')}
          className="self-start sm:self-center text-xs font-bold text-[#0F766E] bg-teal-50 hover:bg-teal-100/70 border border-teal-200 px-3 py-2 rounded-lg transition-colors"
        >
          Track Submitted Enquiries
        </button>
      </div>

      <EmergencyBanner />

      {/* SEARCH PANEL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0F766E]" />
            <span className="font-bold text-sm text-[#172B3A]">Search & Filter Blood Centres</span>
          </div>
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="ALL">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Component */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Component Needed</label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="ALL">All Components</option>
              {components.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          {/* Locality in Darbhanga */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Locality in Darbhanga</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="ALL">All Localities</option>
              <option value="Benta">Benta / DMCH Campus</option>
              <option value="Laheriasarai">Laheriasarai / Collectorate</option>
              <option value="Bela">Bela / NH-27 Bypass</option>
              <option value="Tower Chowk">Tower Chowk / Sadar</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="Normal">Routine / Scheduled (24-48h)</option>
              <option value="Urgent">Urgent (Within 6-12h)</option>
              <option value="Critical Emergency">Immediate Trauma / Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS LISTING */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700">
            Showing {filteredCentres.length} Participating Blood Centres{' '}
            {userLocation.city
              ? `in ${userLocation.city}${bloodScope === 'state' ? ` (${userLocation.state})` : ''}`
              : userLocation.state
              ? `in ${userLocation.state}`
              : 'across demonstration hubs'}
          </span>
          <div className="flex items-center gap-2">
            {bloodScope !== 'all' && (
              <button
                onClick={() => setBloodScope('all')}
                className="text-[11px] font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                Show All Hubs
              </button>
            )}
            <span className="text-[11px] text-slate-500">Stock refreshed every 15 minutes</span>
          </div>
        </div>

        {filteredCentres.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-800">
                No participating blood centres found in {userLocation.city || 'this area'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                In this demonstration prototype, authorized blood bank listings are registered in selected pilot hubs (such as Gwalior, Morena, Darbhanga, Patna, Lucknow, New Delhi, Kolkata). No blood centres matched your current location.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {userLocation.state && bloodScope === 'city' && (
                <button
                  onClick={() => setBloodScope('state')}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold transition-colors border border-teal-200"
                >
                  Search all of {userLocation.state}
                </button>
              )}
              <button
                onClick={() => {
                  setManualLocation('Madhya Pradesh', 'Gwalior');
                  setBloodScope('city');
                  handleClearFilters();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-2xs"
              >
                View Gwalior Blood Hub
              </button>
              <button
                onClick={() => {
                  setManualLocation('Madhya Pradesh', 'Morena');
                  setBloodScope('city');
                  handleClearFilters();
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                View Morena Blood Hub
              </button>
              <button
                onClick={() => {
                  setBloodScope('all');
                  handleClearFilters();
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-2xs"
              >
                Show All Demonstration Blood Banks
              </button>
              <button
                onClick={() => setCurrentPage('find-care')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                Change Location in Care Hub
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCentres.map((centre) => {
              const activeGroup: BloodGroup = selectedGroup === 'ALL' ? 'B+' : selectedGroup;
              const activeComp: BloodComponent = selectedComponent === 'ALL' ? 'Packed Red Cells' : selectedComponent;
              const stockCount = centre.stock[activeGroup]?.[activeComp] ?? 0;

              return (
                <div
                  key={centre.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{centre.name}</span>
                          {centre.isGovernment && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                              Govt Model
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{centre.locality}</span>
                        </p>
                      </div>
                      <Badge variant="verified">Authorized</Badge>
                    </div>

                    {/* Stock highlight box */}
                    <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-slate-500">
                          Simulated stock for <strong className="text-slate-800">{activeGroup}</strong> ({activeComp}):
                        </div>
                        <div className="text-lg font-extrabold text-red-600">
                          {stockCount} Units <span className="text-xs font-normal text-slate-500">documented</span>
                        </div>
                      </div>
                      <DemoDataNotice label="SIMULATED DEMO DATA" />
                    </div>

                    {/* Key Contact & address */}
                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{centre.phone}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Last updated: {centre.lastUpdated}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      Subject to direct donor cross-match
                    </span>
                    <button
                      onClick={() => handleOpenRequestModal(centre)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Request Availability</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDUCATIONAL & REGULATORY INFO PANEL */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Info className="w-4 h-4 text-[#0F766E]" />
            <span>National Blood Transfusion Guidelines (NBTC India)</span>
          </div>
          <button
            onClick={() => setCurrentPage('find-care')}
            className="text-xs text-[#0F766E] font-bold hover:underline flex items-center gap-1"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Search Nearby Blood Banks with GPS</span>
          </button>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Blood is a regulated biological product in India. Transfusions are supplied solely through licensed blood centres in accordance with Drugs & Cosmetics Act standards. No platform can reserve blood units without a valid medical doctor's requisition form and mandatory pre-transfusion cross-matching. For national emergency blood enquiries, contact the National Blood Helpline at <strong>104</strong> or <strong>1075</strong>.
        </p>
      </div>

      {/* PRIVACY-PRESERVING 3-STEP BLOOD REQUISITION MODAL */}
      <BloodRequestModal
        isOpen={!!selectedCentreForRequest}
        onClose={() => setSelectedCentreForRequest(null)}
        preselectedCentreId={selectedCentreForRequest?.id}
        preselectedCentreName={selectedCentreForRequest?.name}
        initialBloodGroup={selectedGroup !== 'ALL' ? selectedGroup : undefined}
      />
    </div>
  );
};
