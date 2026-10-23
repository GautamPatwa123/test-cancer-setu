import React, { useState } from 'react';
import {
  Building2,
  Search,
  RotateCcw,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BadgeCheck,
  ChevronRight,
  ExternalLink,
  Info,
  Stethoscope,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { HospitalListing } from '../../types/index.ts';
import { Badge } from '../common/Badge.tsx';
import { DemoDataNotice } from '../common/DemoDataNotice.tsx';

export const HospitalsInsurance: React.FC = () => {
  const { hospitals, selectedCity, userLocation, setManualLocation, setCurrentPage, language } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('ALL');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<HospitalListing | null>(null);
  const [hospitalScope, setHospitalScope] = useState<'city' | 'state' | 'all'>(userLocation.city ? 'city' : 'all');

  const specialtiesList = [
    'ALL',
    'General Medicine',
    'Cardiology',
    'Oncology Care Unit',
    'Orthopedics',
    'Pediatrics',
    'Critical Care & Trauma',
    'Nephrology (Dialysis Unit)',
  ];

  const insurersList = [
    'ALL',
    'Ayushman Bharat PM-JAY',
    'Star Health',
    'Tata AIG',
    'Care Health Insurance',
    'Aditya Birla Health',
    'HDFC ERGO',
  ];

  const activeCity = userLocation.city?.trim().toLowerCase();
  const activeState = userLocation.state?.trim().toLowerCase();

  const filteredHospitals = hospitals.filter((h) => {
    // Location filter
    if (hospitalScope === 'city' && activeCity) {
      if (!h.city || h.city.toLowerCase() !== activeCity) return false;
    } else if (hospitalScope === 'state' && activeState) {
      if (!h.state || h.state.toLowerCase() !== activeState) return false;
    }

    if (selectedType !== 'ALL' && h.type !== selectedType) return false;
    if (selectedSpecialty !== 'ALL' && !h.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))) return false;
    if (selectedInsurance !== 'ALL' && !h.insuranceEmpanelled.some((ins) => ins.toLowerCase().includes(selectedInsurance.toLowerCase()))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return h.name.toLowerCase().includes(q) || h.locality.toLowerCase().includes(q) || h.address.toLowerCase().includes(q);
    }
    return true;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedSpecialty('ALL');
    setSelectedInsurance('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              Hospitals and Insurance
            </h2>
            <DemoDataNotice label="REGIONAL DIRECTORY" />
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Explore hospital services, specialties, and insurance empanelment across{' '}
            {userLocation.city ? `${userLocation.city}${userLocation.state ? `, ${userLocation.state}` : ''}` : 'participating regional centers'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hospitalScope !== 'all' && (
            <button
              onClick={() => setHospitalScope('all')}
              className="text-xs font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Show All Hubs
            </button>
          )}
          <Badge variant="verified">Official Directory</Badge>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0F766E]" />
            <span className="font-bold text-sm text-[#172B3A]">Filter Hospitals by Specialty & Empanelment</span>
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
          {/* Search Query */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Name or Area</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="E.g. DMCH, Paras, Benta, Donar"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Facility Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Facilities</option>
              <option value="Government">Government / Medical College</option>
              <option value="Private">Private Multi-Specialty</option>
              <option value="Charitable">Charitable Trust</option>
            </select>
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              {specialtiesList.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Specialties' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Insurance Provider */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Empaneled Insurance</label>
            <select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            >
              {insurersList.map((ins) => (
                <option key={ins} value={ins}>
                  {ins === 'ALL' ? 'All Insurance / Schemes' : ins}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Demo Hub Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Explore Demo Hubs:
          </span>
          {[
            { city: 'Gwalior', state: 'Madhya Pradesh', short: 'Gwalior, MP' },
            { city: 'Morena', state: 'Madhya Pradesh', short: 'Morena, MP' },
            { city: 'Darbhanga', state: 'Bihar', short: 'Darbhanga, BR' },
            { city: 'Patna', state: 'Bihar', short: 'Patna, BR' },
            { city: 'New Delhi', state: 'Delhi (NCT)', short: 'Delhi' },
          ].map((demo) => {
            const isActive =
              userLocation.city?.toLowerCase() === demo.city.toLowerCase() &&
              hospitalScope === 'city';
            return (
              <button
                key={`${demo.city}-${demo.state}`}
                onClick={() => {
                  setManualLocation(demo.state, demo.city);
                  setHospitalScope('city');
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0F766E] text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 hover:bg-teal-50 hover:text-[#0F766E] text-slate-700'
                }`}
              >
                📍 {demo.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* VERIFICATION AND CASHLESS DISCLAIMER */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Cashless Desk Verification Notice:</strong> Hospital empanelment status, cashless bed availability, and scheme package caps vary based on policy terms. Always contact the hospital TPA / Ayushman Mitra counter prior to planned admission.
        </div>
      </div>

      {/* HOSPITAL CARDS LIST OR EMPTY STATE */}
      {filteredHospitals.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">
              No participating hospitals found in {userLocation.city || 'this selection'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              In this demonstration platform, verified hospital listings are registered in selected pilot hubs (such as Gwalior, Morena, Darbhanga, Patna, Lucknow, New Delhi, Kolkata). No records matched your current location or filter criteria.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {userLocation.state && hospitalScope === 'city' && (
              <button
                onClick={() => setHospitalScope('state')}
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold transition-colors border border-teal-200"
              >
                Search all of {userLocation.state}
              </button>
            )}
            <button
              onClick={() => {
                setManualLocation('Madhya Pradesh', 'Gwalior');
                setHospitalScope('city');
                handleClearFilters();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-2xs"
            >
              View Gwalior Demo
            </button>
            <button
              onClick={() => {
                setManualLocation('Madhya Pradesh', 'Morena');
                setHospitalScope('city');
                handleClearFilters();
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              View Morena Demo
            </button>
            <button
              onClick={() => {
                setHospitalScope('all');
                handleClearFilters();
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              Show All Demonstration Hospitals
            </button>
            <button
              onClick={() => setCurrentPage('find-care')}
              className="px-3.5 py-2 rounded-xl border border-teal-200 hover:bg-teal-50 text-[#0F766E] text-xs font-bold transition-colors"
            >
              Change Location in Care Hub
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{h.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{h.address}</span>
                    </p>
                  </div>
                  <Badge variant={h.type === 'Government' ? 'info' : 'neutral'}>
                    {h.type}
                  </Badge>
                </div>

                {/* Specialties */}
                <div className="my-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Available Specialties & Departments
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {h.specialties.slice(0, 4).map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-teal-50 text-[#0F766E] font-medium px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                    {h.specialties.length > 4 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{h.specialties.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Insurance empanelment preview */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <div>
                    <span className="font-bold text-slate-700">Insurance Empaneled: </span>
                    <span className="text-slate-600">{h.insuranceEmpanelled.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Govt Schemes: </span>
                    <span className="text-emerald-700 font-semibold">{h.governmentSchemes.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {h.bedCount} Beds • {h.hasEmergencyIcu ? '24/7 ICU' : 'General Ward'}
                </span>

                <button
                  onClick={() => setSelectedHospitalForModal(h)}
                  className="px-3.5 py-1.5 bg-[#0F766E] hover:bg-[#0d655e] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1"
                >
                  <span>View Full Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HOSPITAL DETAIL MODAL */}
      {selectedHospitalForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedHospitalForModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close hospital details dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <div className="p-3 bg-teal-100 text-[#0F766E] rounded-xl shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedHospitalForModal.name}</h3>
                  <Badge variant="verified">{selectedHospitalForModal.verificationStatus}</Badge>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedHospitalForModal.address}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Emergency Desk & Contact */}
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/60 text-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#0F766E]">Cashless & Ayushman Mitra Desk:</span>
                  <a
                    href="tel:06272233234"
                    className="px-2.5 py-1 bg-[#0F766E] text-white font-bold text-[11px] rounded-lg"
                  >
                    Call Helpdesk
                  </a>
                </div>
                <p className="text-slate-700">{selectedHospitalForModal.cashlessDeskPhone}</p>
              </div>

              {/* All Specialties */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2">Departments & Clinical Specialties:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedHospitalForModal.specialties.map((spec, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                      • {spec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Empaneled Insurers */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1.5">Empaneled Insurance Companies:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHospitalForModal.insuranceEmpanelled.map((ins, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>

              {/* Government Schemes */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-1.5">Active Government Healthcare Schemes:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHospitalForModal.governmentSchemes.map((sch, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      {sch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl leading-relaxed text-[11px]">
                <strong>Important Note:</strong> Coverage, eligibility, cashless admission approval, and deductible amounts must be confirmed directly with the hospital reception and your insurance TPA.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Last Verified: {selectedHospitalForModal.lastVerified}</span>
              <button
                onClick={() => setSelectedHospitalForModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
