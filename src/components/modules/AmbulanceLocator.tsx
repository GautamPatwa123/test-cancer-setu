import React, { useState } from 'react';
import {
  Ambulance,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { AmbulanceProvider, AmbulanceRequest } from '../../types/index.ts';
import { Badge } from '../common/Badge.tsx';
import { EmergencyBanner } from '../common/EmergencyBanner.tsx';
import { DemoDataNotice } from '../common/DemoDataNotice.tsx';

export const AmbulanceLocator: React.FC = () => {
  const { ambulances, createAmbulanceRequest, patient, userLocation, setManualLocation, setCurrentPage, language } = useApp();

  const [pickupLoc, setPickupLoc] = useState<string>(
    userLocation.approximateArea || (userLocation.city ? `${userLocation.city} Area` : 'Local Area')
  );
  const [destLoc, setDestLoc] = useState<string>(
    userLocation.city ? `${userLocation.city} Medical Center` : 'Nearest District Hospital'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [specialNeeds, setSpecialNeeds] = useState<string>('Continuous Oxygen Required');
  const [contactPhone, setContactPhone] = useState<string>('+91 98765 43210');
  const [ambulanceScope, setAmbulanceScope] = useState<'city' | 'state' | 'all'>(userLocation.city ? 'city' : 'all');

  const [activeAmbulanceForBooking, setActiveAmbulanceForBooking] = useState<AmbulanceProvider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeCreatedRequest, setActiveCreatedRequest] = useState<AmbulanceRequest | null>(null);

  const categories = [
    'ALL',
    'Basic Life Support (BLS)',
    'Advanced Cardiac (ALS)',
    'Patient Transport (PTS)',
    'Neonatal ICU',
  ];

  const activeCity = userLocation.city?.trim().toLowerCase();
  const activeState = userLocation.state?.trim().toLowerCase();

  const filteredAmbulances = ambulances.filter((a) => {
    // Location filtering
    if (ambulanceScope === 'city' && activeCity) {
      if (!a.city || a.city.toLowerCase() !== activeCity) return false;
    } else if (ambulanceScope === 'state' && activeState) {
      if (!a.state || a.state.toLowerCase() !== activeState) return false;
    }

    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    return true;
  });

  const handleBookDemoAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAmbulanceForBooking) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = createAmbulanceRequest({
        patientId: patient.id,
        patientName: patient.name,
        pickupLocation: pickupLoc,
        destination: destLoc,
        category: activeAmbulanceForBooking.category,
        providerId: activeAmbulanceForBooking.id,
        providerName: activeAmbulanceForBooking.name,
        specialNeeds,
        contactPhone,
      });

      setIsSubmitting(false);
      setActiveCreatedRequest(created);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#123047] tracking-tight">
              Ambulance Assistance
            </h2>
            <DemoDataNotice label="DEMO FLEET" />
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Explore listed ambulance providers and create a demonstration request.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('requests')}
          className="self-start sm:self-center text-xs font-bold text-[#0F766E] bg-teal-50 hover:bg-teal-100/70 border border-teal-200 px-3 py-2 rounded-lg transition-colors"
        >
          View Active Dispatch Requests
        </button>
      </div>

      <EmergencyBanner />

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          Trip Routing & Vehicle Preferences (Darbhanga Zone)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sample Pickup Location
            </label>
            <input
              type="text"
              value={pickupLoc}
              onChange={(e) => setPickupLoc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              placeholder="E.g. Donar, Laheriasarai, Allpatti"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Destination Healthcare Center
            </label>
            <input
              type="text"
              value={destLoc}
              onChange={(e) => setDestLoc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              placeholder="E.g. DMCH Emergency, Paras Global"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ambulance Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Vehicle Types' : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Accessibility / Special Equipment
            </label>
            <input
              type="text"
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              placeholder="Oxygen, Stretcher, Neonatal incubator"
            />
          </div>
        </div>
      </div>

      {/* MAP & PROVIDER CARDS SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (5 cols): Stylized Illustrative Regional Map */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#0F766E]" />
              <span className="font-bold text-xs sm:text-sm text-slate-900">
                {userLocation.city ? `${userLocation.city} Regional Coverage Map` : 'Regional Emergency Coverage Map'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              Demo Coordinate Grid
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-square bg-[#E6F5F2]/40 rounded-xl border border-teal-200/60 overflow-hidden p-2 select-none">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Rivers / Canal (Bagmati river tributary in Darbhanga) */}
              <path
                d="M 10 70 Q 150 140 260 90 T 390 150"
                fill="none"
                stroke="#BAE6FD"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.6"
              />
              <text x="280" y="85" fill="#0284C7" fontSize="10" fontWeight="bold">Bagmati River Arc</text>

              {/* Major Roads / Highways (NH-27 Bypass, VIP Road, DMCH Road) */}
              <line x1="20" y1="200" x2="380" y2="200" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="6,4" />
              <text x="24" y="192" fill="#64748B" fontSize="9" fontWeight="bold">NH-27 East-West Corridor</text>

              <line x1="180" y1="20" x2="220" y2="380" stroke="#CBD5E1" strokeWidth="5" />
              <text x="225" y="320" fill="#64748B" fontSize="9">Laheriasarai Road</text>

              {/* District Hubs */}
              {/* 1. DMCH Campus */}
              <circle cx="160" cy="140" r="16" fill="#0F766E" fillOpacity="0.2" stroke="#0F766E" strokeWidth="2" />
              <circle cx="160" cy="140" r="6" fill="#0F766E" />
              <text x="130" y="125" fill="#0F766E" fontSize="10" fontWeight="extrabold">DMCH Campus (Benta)</text>

              {/* 2. Tower Chowk */}
              <circle cx="210" cy="210" r="12" fill="#123047" fillOpacity="0.15" stroke="#123047" strokeWidth="1.5" />
              <circle cx="210" cy="210" r="5" fill="#123047" />
              <text x="220" y="214" fill="#123047" fontSize="9" fontWeight="bold">Tower Chowk</text>

              {/* 3. Donar */}
              <circle cx="290" cy="180" r="10" fill="#B45309" fillOpacity="0.15" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="290" cy="180" r="4" fill="#B45309" />
              <text x="270" y="170" fill="#B45309" fontSize="9" fontWeight="bold">Donar</text>

              {/* 4. Laheriasarai Collectorate */}
              <circle cx="200" cy="330" r="12" fill="#4338CA" fillOpacity="0.15" stroke="#4338CA" strokeWidth="1.5" />
              <circle cx="200" cy="330" r="5" fill="#4338CA" />
              <text x="140" y="345" fill="#4338CA" fontSize="9" fontWeight="bold">Laheriasarai</text>

              {/* 5. Allpatti (Patient Base) */}
              <circle cx="120" cy="250" r="14" fill="#15803D" fillOpacity="0.2" stroke="#15803D" strokeWidth="2" />
              <circle cx="120" cy="250" r="6" fill="#15803D" />
              <text x="80" y="275" fill="#15803D" fontSize="10" fontWeight="extrabold">Your Locality (Allpatti)</text>

              {/* Simulated Ambulance Vehicle Pins */}
              <g transform="translate(150, 155)">
                <circle cx="0" cy="0" r="10" fill="#DC2626" />
                <text x="-4" y="3" fill="#FFFFFF" fontSize="9" fontWeight="bold">A1</text>
              </g>

              <g transform="translate(190, 310)">
                <circle cx="0" cy="0" r="10" fill="#D97706" />
                <text x="-4" y="3" fill="#FFFFFF" fontSize="9" fontWeight="bold">A2</text>
              </g>

              <g transform="translate(280, 195)">
                <circle cx="0" cy="0" r="10" fill="#D97706" />
                <text x="-4" y="3" fill="#FFFFFF" fontSize="9" fontWeight="bold">A3</text>
              </g>

              <g transform="translate(110, 230)">
                <circle cx="0" cy="0" r="10" fill="#059669" />
                <text x="-4" y="3" fill="#FFFFFF" fontSize="9" fontWeight="bold">A4</text>
              </g>
            </svg>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                <span>Patient Locality</span>
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                <span>DMCH Hospital Hub</span>
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                <span>Ambulance Unit</span>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic text-center">
            Note: Demonstration fleet simulator. Does not dispatch real vehicles or track live drivers.
          </p>
        </div>

        {/* RIGHT COLUMN (7 cols): Provider Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">
              Available Units ({filteredAmbulances.length} Verified Providers){' '}
              {userLocation.city
                ? `in ${userLocation.city}${ambulanceScope === 'state' ? ` (${userLocation.state})` : ''}`
                : userLocation.state
                ? `in ${userLocation.state}`
                : ''}
            </span>
            <div className="flex items-center gap-2">
              {ambulanceScope !== 'all' && (
                <button
                  onClick={() => setAmbulanceScope('all')}
                  className="text-[11px] font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Show All Hubs
                </button>
              )}
              <span className="text-[11px] text-slate-500">
                {userLocation.city ? `Near ${userLocation.city}` : 'Demo Directory'}
              </span>
            </div>
          </div>

          {filteredAmbulances.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Ambulance className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">
                  No participating ambulance providers found in {userLocation.city || 'this area'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  In this demonstration prototype, ambulance providers are registered in selected pilot hubs (such as Gwalior, Morena, Darbhanga, Patna, Lucknow, New Delhi, Kolkata). No ambulance vehicles are currently listed for {userLocation.city || 'this location'}.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {userLocation.state && ambulanceScope === 'city' && (
                  <button
                    onClick={() => setAmbulanceScope('state')}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold transition-colors border border-teal-200"
                  >
                    Search all of {userLocation.state}
                  </button>
                )}
                <button
                  onClick={() => {
                    setManualLocation('Madhya Pradesh', 'Gwalior');
                    setAmbulanceScope('city');
                    setSelectedCategory('ALL');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  View Gwalior Fleets
                </button>
                <button
                  onClick={() => {
                    setManualLocation('Madhya Pradesh', 'Morena');
                    setAmbulanceScope('city');
                    setSelectedCategory('ALL');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  View Morena Fleets
                </button>
                <button
                  onClick={() => {
                    setAmbulanceScope('all');
                    setSelectedCategory('ALL');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Show All Demonstration Fleets
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
            <div className="space-y-3">
              {filteredAmbulances.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-[#0F766E] transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{unit.name}</h4>
                        <Badge variant={unit.category.includes('ALS') ? 'danger' : 'warning'}>
                          {unit.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{unit.locality} • approx. {unit.distanceKm} km away</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs font-bold text-slate-800 block">
                        {unit.baseFare}
                      </span>
                      <Badge variant={unit.availability === 'Available' ? 'success' : 'warning'}>
                        {unit.availability}
                      </Badge>
                    </div>
                  </div>

                  {/* Equipment chips */}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      On-Board Medical Equipment
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {unit.equipment.map((eq, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{unit.phone}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveAmbulanceForBooking(unit);
                        setActiveCreatedRequest(null);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Ambulance className="w-3.5 h-3.5" />
                      <span>Request Assistance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REQUEST FLOW REVIEW & SUBMISSION MODAL */}
      {activeAmbulanceForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveAmbulanceForBooking(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close ambulance dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {!activeCreatedRequest ? (
              <form onSubmit={handleBookDemoAmbulance} className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Confirm Demonstration Ambulance Request
                    </h3>
                    <p className="text-xs text-slate-500">
                      Selected Provider: {activeAmbulanceForBooking.name}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl leading-relaxed">
                  <strong>PROTOTYPE DISCLAIMER:</strong> This is a simulation for competition review. No real ambulance vehicle has been dispatched. In life-threatening emergencies, dial <strong>112</strong> immediately.
                </div>

                {/* Review Request Fields */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pickup Locality</label>
                    <input
                      type="text"
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Destination Hospital</label>
                    <input
                      type="text"
                      value={destLoc}
                      onChange={(e) => setDestLoc(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Vehicle Category</label>
                      <input
                        type="text"
                        disabled
                        value={activeAmbulanceForBooking.category}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Estimated Base Fare</label>
                      <input
                        type="text"
                        disabled
                        value={activeAmbulanceForBooking.baseFare}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Special Medical Needs</label>
                    <input
                      type="text"
                      value={specialNeeds}
                      onChange={(e) => setSpecialNeeds(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveAmbulanceForBooking(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {isSubmitting ? 'Routing Request...' : 'Submit Demo Ambulance Request'}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Status Display */
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Demo Ambulance Request Logged!
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1.5 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Request ID:</span>
                    <strong className="text-slate-900">{activeCreatedRequest.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status:</span>
                    <Badge variant="warning">{activeCreatedRequest.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pickup:</span>
                    <span className="text-slate-800">{activeCreatedRequest.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="text-slate-800">{activeCreatedRequest.destination}</span>
                  </div>
                </div>

                <p className="text-xs text-red-600 font-semibold max-w-sm mx-auto">
                  Notice: No real vehicle was dispatched. This workflow is logged in your 'My Requests' table.
                </p>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveAmbulanceForBooking(null)}
                    className="px-4 py-2 text-xs font-medium border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setActiveAmbulanceForBooking(null);
                      setCurrentPage('requests');
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] rounded-lg shadow-sm hover:bg-[#0d655e]"
                  >
                    Track in My Requests
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
