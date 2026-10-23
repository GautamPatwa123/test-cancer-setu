import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Building2,
  Ambulance,
  Droplets,
  HeartHandshake,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Phone,
  Clock,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Lock,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INDIAN_STATES_CITIES } from '../../data/mockData.ts';
import { calculateDistanceKm, isDonorContactable } from '../../utils/healthLogic.ts';
import { BloodGroup, HospitalListing, AmbulanceProvider, BloodCentre, VolunteerDonor } from '../../types/index.ts';
import { BloodRequestModal } from './BloodRequestModal.tsx';
import { EmergencyBanner } from '../common/EmergencyBanner.tsx';

type ServiceCategory = 'all' | 'hospitals' | 'ambulances' | 'blood' | 'donors';

export const FindCareNearMe: React.FC = () => {
  const {
    t,
    language,
    userLocation,
    requestBrowserLocation,
    setManualLocation,
    clearLocation,
    hospitals,
    ambulances,
    bloodCentres,
    volunteerDonors,
    toggleDonorOptIn,
    registerVolunteerDonor,
    setCurrentPage,
  } = useApp();

  // Location selector UI modal / expander
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(!userLocation.isPermissionGranted && !userLocation.city);
  const [locPermissionPending, setLocPermissionPending] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);

  // Manual state / city picker - start neutral ("Select a state", "Enter or select a city") unless user has saved location
  const [selectedState, setSelectedState] = useState<string>(userLocation.state || '');
  const [selectedCity, setSelectedCity] = useState<string>(userLocation.city || '');
  const [selectedLocality, setSelectedLocality] = useState<string>(userLocation.locality || '');
  const [cityDropdownOpen, setCityDropdownOpen] = useState<boolean>(false);
  const [searchScope, setSearchScope] = useState<'city' | 'state' | 'all'>('city');

  // Synchronize local form inputs when active userLocation changes
  useEffect(() => {
    if (userLocation.state) setSelectedState(userLocation.state);
    if (userLocation.city) setSelectedCity(userLocation.city);
    if (userLocation.locality) setSelectedLocality(userLocation.locality);
  }, [userLocation.state, userLocation.city, userLocation.locality]);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedBloodGroupFilter, setSelectedBloodGroupFilter] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyIcuEmergency, setOnlyIcuEmergency] = useState<boolean>(false);

  // AI Search helper toggle
  const [aiSearchAssistantActive, setAiSearchAssistantActive] = useState<boolean>(false);
  const [aiInterpretation, setAiInterpretation] = useState<{
    detectedCategory?: string;
    isEmergency?: boolean;
    advice?: string;
    parsedKeywords?: string[];
  } | null>(null);

  // Blood Request Modal state
  const [bloodModalOpen, setBloodModalOpen] = useState<boolean>(false);
  const [selectedCentreForRequest, setSelectedCentreForRequest] = useState<BloodCentre | undefined>(undefined);

  // Donor Opt-In Registration Modal
  const [showDonorOptInModal, setShowDonorOptInModal] = useState<boolean>(false);
  const [newDonorAlias, setNewDonorAlias] = useState<string>('');
  const [newDonorBloodGroup, setNewDonorBloodGroup] = useState<BloodGroup>('B+');
  const [newDonorPhone, setNewDonorPhone] = useState<string>('');
  const [newDonorArea, setNewDonorArea] = useState<string>(userLocation.city ? `${userLocation.city} Area` : 'Local Area');
  const [newDonorConsent, setNewDonorConsent] = useState<boolean>(false);

  // Available cities for currently selected state
  const citiesForSelectedState = useMemo(() => {
    if (!selectedState) return [];
    const s = INDIAN_STATES_CITIES.find((item) => item.state.toLowerCase() === selectedState.toLowerCase());
    return s ? s.cities : [];
  }, [selectedState]);

  // City suggestions matching the user's typed search query in the city field
  const filteredCitySuggestions = useMemo(() => {
    if (!selectedCity.trim()) return citiesForSelectedState;
    const q = selectedCity.toLowerCase().trim();
    return citiesForSelectedState.filter((c) => c.name.toLowerCase().includes(q));
  }, [citiesForSelectedState, selectedCity]);

  // Handle explicit Browser Geolocation request (ONLY upon user button click)
  const handleUseMyLocation = async () => {
    setLocPermissionPending(true);
    setLocationStatusMessage(null);
    const result = await requestBrowserLocation();
    setLocPermissionPending(false);
    setLocationStatusMessage(result.message);
    if (result.success) {
      setSearchScope('city');
      setShowLocationDialog(false);
    }
  };

  // Handle Manual Location Save (supports any typed Indian city)
  const handleSaveManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState || !selectedCity.trim()) return;
    setManualLocation(selectedState, selectedCity.trim(), selectedLocality.trim());
    setSearchScope('city');
    setLocationStatusMessage(`Manual location saved: ${selectedCity.trim()}, ${selectedState}`);
    setShowLocationDialog(false);
    setCityDropdownOpen(false);
  };

  // Quick Demo Location Shortcut handler
  const handleSelectDemoLocation = (state: string, city: string, locality?: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    setSelectedLocality(locality || '');
    setManualLocation(state, city, locality);
    setSearchScope('city');
    setLocationStatusMessage(`Active location set to ${city}, ${state}`);
    setShowLocationDialog(false);
    setCityDropdownOpen(false);
  };

  // Handle Natural Language / AI Search Interpretation
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setAiInterpretation(null);
      return;
    }

    const isEmergency =
      q.includes('chest pain') ||
      q.includes('heart attack') ||
      q.includes('unconscious') ||
      q.includes('stroke') ||
      q.includes('bleeding') ||
      q.includes('critical');

    const keywords: string[] = [];
    if (q.includes('icu') || q.includes('ventilator')) keywords.push('ICU / Critical Care');
    if (q.includes('cardiac') || q.includes('heart')) keywords.push('Cardiology');
    if (q.includes('blood') || q.includes('platelet') || q.includes('prbc')) keywords.push('Blood Transfusion');
    if (q.includes('ambulance') || q.includes('als') || q.includes('bls')) keywords.push('Ambulance Transport');

    let detectedCat: ServiceCategory = 'all';
    if (q.includes('hospital') || q.includes('doctor') || q.includes('clinic')) detectedCat = 'hospitals';
    else if (q.includes('ambulance') || q.includes('van') || q.includes('driver')) detectedCat = 'ambulances';
    else if (q.includes('blood') || q.includes('plasma') || q.includes('platelet')) detectedCat = 'blood';
    else if (q.includes('donor')) detectedCat = 'donors';

    if (detectedCat !== 'all') {
      setActiveCategory(detectedCat);
    }

    setAiInterpretation({
      detectedCategory: detectedCat !== 'all' ? detectedCat : undefined,
      isEmergency,
      advice: isEmergency
        ? 'CRITICAL WARNING: Acute life-threatening symptoms detected. Dial 112 immediately. Do not delay emergency hospital arrival.'
        : `Organized results based on matching local providers in ${userLocation.city || userLocation.state || 'registered pilot hubs'}.`,
      parsedKeywords: keywords,
    });
  };

  // Combined Provider List with location filtering and accurate distance calculation
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const userLat = userLocation.latitude;
    const userLon = userLocation.longitude;
    const activeCity = userLocation.city?.trim().toLowerCase();
    const activeState = userLocation.state?.trim().toLowerCase();

    // 1. Hospitals
    const hospitalItems = hospitals
      .filter((h) => {
        if (activeCategory !== 'all' && activeCategory !== 'hospitals') return false;
        if (onlyVerified && h.verificationStatus !== 'Verified') return false;
        if (onlyIcuEmergency && !h.hasEmergencyIcu) return false;

        // Location filtering: strict city match unless broadened to state or all
        if (searchScope === 'city' && activeCity) {
          if (!h.city || h.city.toLowerCase() !== activeCity) return false;
        } else if (searchScope === 'state' && activeState) {
          if (!h.state || h.state.toLowerCase() !== activeState) return false;
        }

        if (!q) return true;
        return (
          h.name.toLowerCase().includes(q) ||
          h.locality.toLowerCase().includes(q) ||
          h.specialties.some((s) => s.toLowerCase().includes(q)) ||
          h.insuranceEmpanelled.some((i) => i.toLowerCase().includes(q))
        );
      })
      .map((h) => ({
        id: h.id,
        kind: 'hospital' as const,
        title: h.name,
        category: `${h.type} Hospital • ${h.bedCount} Beds`,
        locality: h.locality,
        address: h.address,
        phone: h.contact,
        hasEmergencyIcu: h.hasEmergencyIcu,
        specialties: h.specialties.slice(0, 3),
        distanceKm: calculateDistanceKm(userLat, userLon, h.latitude, h.longitude),
        isVerified: h.verificationStatus === 'Verified',
        isDemoData: true,
        statusNotice: 'Demonstration Hospital Listing — Call hospital desk to confirm real beds',
        cashlessDesk: h.cashlessDeskPhone,
        raw: h,
      }));

    // 2. Ambulances
    const ambulanceItems = ambulances
      .filter((a) => {
        if (activeCategory !== 'all' && activeCategory !== 'ambulances') return false;
        if (onlyVerified && !a.verified) return false;

        // Location filtering: strict city match unless broadened to state or all
        if (searchScope === 'city' && activeCity) {
          if (!a.city || a.city.toLowerCase() !== activeCity) return false;
        } else if (searchScope === 'state' && activeState) {
          if (!a.state || a.state.toLowerCase() !== activeState) return false;
        }

        if (!q) return true;
        return (
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.locality.toLowerCase().includes(q) ||
          a.equipment.some((eq) => eq.toLowerCase().includes(q))
        );
      })
      .map((a) => ({
        id: a.id,
        kind: 'ambulance' as const,
        title: a.name,
        category: a.category,
        locality: a.locality,
        address: a.address || `${a.locality}, ${a.city || (userLocation.city || 'India')}`,
        phone: a.phone,
        hasEmergencyIcu: a.category.includes('ALS') || a.category.includes('Neonatal'),
        specialties: a.equipment.slice(0, 3),
        distanceKm: calculateDistanceKm(userLat, userLon, a.latitude, a.longitude),
        isVerified: a.verified,
        isDemoData: true,
        statusNotice: 'Demonstration Fleet Simulator — No real GPS dispatch or driver alert',
        fare: a.baseFare,
        raw: a,
      }));

    // 3. Blood Centres
    const bloodItems = bloodCentres
      .filter((b) => {
        if (activeCategory !== 'all' && activeCategory !== 'blood') return false;
        if (onlyVerified && !b.verified) return false;

        // Location filtering: strict city match unless broadened to state or all
        if (searchScope === 'city' && activeCity) {
          if (!b.city || b.city.toLowerCase() !== activeCity) return false;
        } else if (searchScope === 'state' && activeState) {
          if (!b.state || b.state.toLowerCase() !== activeState) return false;
        }

        if (selectedBloodGroupFilter !== 'all') {
          const bg = selectedBloodGroupFilter as BloodGroup;
          const totalUnits = Object.values(b.stock[bg] || {}).reduce((sum, n) => sum + n, 0);
          if (totalUnits <= 0) return false;
        }
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q)
        );
      })
      .map((b) => ({
        id: b.id,
        kind: 'blood' as const,
        title: b.name,
        category: b.isGovernment ? 'Government Model Blood Centre' : 'Red Cross / Hospital Blood Bank',
        locality: b.locality,
        address: b.address,
        phone: b.phone,
        hasEmergencyIcu: false,
        specialties: ['PRBC Separation', 'Platelet Agitation', 'Component Storage'],
        distanceKm: calculateDistanceKm(userLat, userLon, b.latitude, b.longitude),
        isVerified: b.verified,
        isDemoData: true,
        statusNotice: 'Simulated Inventory — Offline cross-matching & donor replacement mandatory',
        stock: b.stock,
        raw: b,
      }));

    // Combine and sort by distance if available
    const combined = [...hospitalItems, ...ambulanceItems, ...bloodItems];
    combined.sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm !== null) return -1;
      if (b.distanceKm !== null) return 1;
      return 0;
    });

    return combined;
  }, [
    hospitals,
    ambulances,
    bloodCentres,
    userLocation,
    searchScope,
    searchQuery,
    activeCategory,
    selectedBloodGroupFilter,
    onlyVerified,
    onlyIcuEmergency,
  ]);

  // Filtered Donors with location filtering
  const filteredDonors = useMemo(() => {
    const activeCity = userLocation.city?.trim().toLowerCase();
    const activeState = userLocation.state?.trim().toLowerCase();

    return volunteerDonors.filter((d) => {
      // Location filtering
      if (searchScope === 'city' && activeCity) {
        if (!d.city || d.city.toLowerCase() !== activeCity) return false;
      } else if (searchScope === 'state' && activeState) {
        if (!d.state || d.state.toLowerCase() !== activeState) return false;
      }

      if (selectedBloodGroupFilter !== 'all' && d.bloodGroup !== selectedBloodGroupFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.alias.toLowerCase().includes(q) ||
          d.bloodGroup.toLowerCase().includes(q) ||
          d.approximateArea.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [volunteerDonors, userLocation, searchScope, selectedBloodGroupFilter, searchQuery]);

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonorAlias.trim() || !newDonorPhone.trim() || !newDonorConsent) return;

    registerVolunteerDonor({
      alias: newDonorAlias.trim(),
      bloodGroup: newDonorBloodGroup,
      city: userLocation.city || selectedCity || 'Local City',
      state: userLocation.state || selectedState || 'Local State',
      approximateArea: newDonorArea.trim() || `${userLocation.city || 'Local'} Area`,
      phoneMasked: `+91 ${newDonorPhone.slice(0, 2)}••• ••${newDonorPhone.slice(-3)}`,
      optedIn: true,
      verifiedDonor: false,
      notes: 'Volunteer registered in demo registry. Contact numbers are masked for privacy.',
    });

    setShowDonorOptInModal(false);
    setNewDonorAlias('');
    setNewDonorPhone('');
    setNewDonorConsent(false);
  };

  return (
    <div className="space-y-6">
      {/* National Emergency Alert Banner */}
      <EmergencyBanner />

      {/* Main Location Header & Explanation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E6F5F2] text-[#0F766E] flex items-center justify-center shrink-0">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#172B3A]">
                  {language === 'hi' ? 'निकटतम स्वास्थ्य सेवा खोजें' : 'Find Care Near Me'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[#0F766E] font-bold text-[10px]">
                  Location-Aware
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Search verified hospitals, emergency ambulances, blood banks, and community donors near your location.
              </p>
            </div>
          </div>

          {/* Current Location Badge & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              <span className="font-semibold">{userLocation.approximateArea}</span>
              {userLocation.type === 'geolocation' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-[#0F766E] font-bold">
                  GPS
                </span>
              )}
            </div>

            <button
              onClick={() => setShowLocationDialog(!showLocationDialog)}
              className="px-3 py-1.5 rounded-xl border border-teal-300 hover:bg-teal-50 text-[#0F766E] text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>{t('changeLocation')}</span>
            </button>

            <button
              onClick={clearLocation}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs flex items-center gap-1 transition-colors"
              title="Clear stored coordinates and reset to default region"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('clearLocation')}</span>
            </button>
          </div>
        </div>

        {/* Location Notice / Explanation Banner */}
        <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
          <Info className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-[#0F766E]">Privacy First: </strong>
            {t('locationNotice')} You can also choose your Indian state and city manually at any time.
          </div>
        </div>

        {/* Collapsible Location Picker Dialog */}
        {showLocationDialog && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Choose How to Set Your Location
              </h3>
              <button
                onClick={() => setShowLocationDialog(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            {/* Quick Demo Location Shortcuts */}
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interactive Demonstration Hubs</span>
                </span>
                <span className="text-[10px] text-slate-400">1-click demo selection</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { city: 'Gwalior', state: 'Madhya Pradesh', desc: 'JAH / GRMC Medical College, Birla Hospital, Morar Hospital' },
                  { city: 'Morena', state: 'Madhya Pradesh', desc: 'District Hospital (Zila Chikitsalaya), GMC Morena' },
                  { city: 'Darbhanga', state: 'Bihar', desc: 'DMCH & Paras Global' },
                  { city: 'Patna', state: 'Bihar', desc: 'AIIMS Patna & PMCH' },
                  { city: 'New Delhi', state: 'Delhi (NCT)', desc: 'AIIMS New Delhi' },
                ].map((demo) => {
                  const isActive =
                    userLocation.city?.toLowerCase() === demo.city.toLowerCase() &&
                    userLocation.state?.toLowerCase() === demo.state.toLowerCase();
                  return (
                    <button
                      key={`${demo.city}-${demo.state}`}
                      type="button"
                      onClick={() => handleSelectDemoLocation(demo.state, demo.city)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#0F766E] text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-teal-50 hover:border-teal-300 text-slate-700 border border-slate-200'
                      }`}
                      title={demo.desc}
                    >
                      <MapPin className={`w-3 h-3 ${isActive ? 'text-white' : 'text-[#0F766E]'}`} />
                      <span>{demo.city}, {demo.state === 'Madhya Pradesh' ? 'MP' : demo.state === 'Bihar' ? 'BR' : 'DL'}</span>
                      {isActive && <span className="text-[10px] opacity-80">(Active)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Browser Geolocation Button */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E]">
                    <Navigation className="w-4 h-4" />
                    <span>Option 1: Device Geolocation</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tap below to request browser location. Your approximate coordinates will be used only to calculate distances to nearby emergency centers.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={locPermissionPending}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{locPermissionPending ? 'Detecting Location...' : t('useMyLocation')}</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Permission requested only when tapped. No continuous tracking.
                  </p>
                </div>
              </div>

              {/* Option 2: Manual Selection Across All India */}
              <form
                onSubmit={handleSaveManualLocation}
                className="p-4 bg-white rounded-xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Option 2: Select State & City Manually</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* State Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      State / UT *
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setSelectedState(newState);
                        if (!newState) {
                          setSelectedCity('');
                          setCityDropdownOpen(false);
                        } else {
                          setCityDropdownOpen(true);
                        }
                      }}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium focus:ring-1 focus:ring-[#0F766E]"
                    >
                      <option value="">Select a state or union territory</option>
                      {INDIAN_STATES_CITIES.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Searchable City Input */}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[10px] font-bold text-slate-500">
                        City *
                      </label>
                      {selectedCity && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCity('');
                            setCityDropdownOpen(true);
                          }}
                          className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          setCityDropdownOpen(true);
                        }}
                        onFocus={() => {
                          if (selectedState) setCityDropdownOpen(true);
                        }}
                        placeholder={selectedState ? "Enter or select a city" : "Select a state first"}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium focus:ring-1 focus:ring-[#0F766E] focus:outline-none"
                      />
                    </div>

                    {/* Suggestions list for selected state */}
                    {cityDropdownOpen && selectedState && (
                      <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                        <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                          <span>Suggestions in {selectedState}</span>
                          <button
                            type="button"
                            onClick={() => setCityDropdownOpen(false)}
                            className="text-slate-400 hover:text-slate-600 text-[10px]"
                          >
                            Close ✕
                          </button>
                        </div>
                        {filteredCitySuggestions.length > 0 ? (
                          filteredCitySuggestions.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                setSelectedCity(c.name);
                                setCityDropdownOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-teal-50 text-slate-700 hover:text-[#0F766E] flex items-center justify-between transition-colors"
                            >
                              <span className="font-medium">{c.name}</span>
                              <span className="text-[10px] text-slate-400">Select</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-2.5 py-2 text-xs text-slate-500">
                            <p>No preset match for "{selectedCity}".</p>
                            <p className="text-[10px] text-[#0F766E] font-semibold mt-0.5">
                              Custom cities supported. Press "Save Manual Location" below to use "{selectedCity}".
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                    Locality / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    placeholder="e.g. Civil Lines, Station Road, Sector 4"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-[#0F766E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedState || !selectedCity.trim()}
                  className="w-full py-2 px-3 rounded-lg bg-[#123047] hover:bg-[#1a4261] text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  Save Manual Location
                </button>
              </form>
            </div>

            {/* Status message (especially clear alert when permission is declined) */}
            {locationStatusMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
                  locationStatusMessage.includes('declined') ||
                  locationStatusMessage.includes('unavailable') ||
                  locationStatusMessage.includes('timed out')
                    ? 'bg-amber-50 border border-amber-200 text-amber-900'
                    : 'bg-teal-50 border border-teal-200 text-teal-800'
                }`}
              >
                {locationStatusMessage.includes('declined') ||
                locationStatusMessage.includes('unavailable') ||
                locationStatusMessage.includes('timed out') ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">
                  <p className="font-semibold">{locationStatusMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Bar & Smart Assistance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, specialty (e.g. Cardiology, ICU), or blood group..."
              className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => {
                setAiSearchAssistantActive(!aiSearchAssistantActive);
                handleSearchSubmit();
              }}
              className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                aiSearchAssistantActive
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle AI query interpretation"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Search Helper</span>
            </button>
          </div>
        </form>

        {/* AI Interpretation Alert (If active) */}
        {aiInterpretation && (
          <div
            className={`p-3 rounded-xl border text-xs space-y-1 ${
              aiInterpretation.isEmergency
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-teal-50/80 border-teal-200 text-teal-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {aiInterpretation.isEmergency ? 'Critical Triage Alert' : 'Search Query Interpretation'}
              </span>
            </div>
            <p className="leading-relaxed">{aiInterpretation.advice}</p>
            {aiInterpretation.parsedKeywords && aiInterpretation.parsedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {aiInterpretation.parsedKeywords.map((k) => (
                  <span
                    key={k}
                    className="px-2 py-0.5 rounded-md bg-white/70 font-semibold text-[10px] border border-black/10"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
            <div className="text-[10px] text-slate-500 pt-0.5">
              Notice: AI organizes results using existing directory listings; it does not invent facilities or dispatch vehicles.
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          {[
            { id: 'all', label: 'All Services', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'hospitals', label: 'Hospitals & Trauma', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'ambulances', label: 'Ambulances', icon: <Ambulance className="w-3.5 h-3.5" /> },
            { id: 'blood', label: 'Blood Banks', icon: <Droplets className="w-3.5 h-3.5" /> },
            { id: 'donors', label: 'Community Donors', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ServiceCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#123047] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Sub-filters (Blood Group & Emergency ICU) */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600">
          {(activeCategory === 'all' || activeCategory === 'blood' || activeCategory === 'donors') && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Blood Group:</span>
              <select
                value={selectedBloodGroupFilter}
                onChange={(e) => setSelectedBloodGroupFilter(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">Any Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-[#0F766E] focus:ring-[#0F766E]"
            />
            <span>Verified Listings Only</span>
          </label>

          {(activeCategory === 'all' || activeCategory === 'hospitals') && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyIcuEmergency}
                onChange={(e) => setOnlyIcuEmergency(e.target.checked)}
                className="rounded text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>24x7 ICU / Trauma Units</span>
            </label>
          )}
        </div>
      </div>

      {/* Main Results Container */}
      <div className="space-y-4">
        {/* If Donors Tab selected */}
        {activeCategory === 'donors' ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <span>Volunteer Blood Donor Community ({filteredDonors.length} Listed)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Private phone numbers are masked. In this demonstration, donors must separately opt in before contact is permitted.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDonorOptInModal(true)}
                  className="px-3 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Join as Volunteer Donor
                </button>
                <button
                  onClick={() => setBloodModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                >
                  Create Blood Request
                </button>
              </div>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">
                  No volunteer donors found in {userLocation.city || (userLocation.state ? userLocation.state : 'this area')}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No registered volunteer blood donors have opted in for {userLocation.city || 'this area'} yet in this demonstration prototype.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {userLocation.state && searchScope === 'city' && (
                    <button
                      onClick={() => setSearchScope('state')}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold transition-colors border border-teal-200 flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search across all of {userLocation.state}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowDonorOptInModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    Be the First to Opt-In
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDonors.map((donor) => {
                  const isContactable = isDonorContactable(donor);
                  return (
                    <div
                      key={donor.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm border border-red-100">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm">{donor.alias}</span>
                              {donor.verifiedDonor && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-green-50 text-green-700 font-bold border border-green-200">
                                  Verified Volunteer
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{donor.approximateArea}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            donor.optedIn
                              ? 'bg-teal-50 text-[#0F766E] border border-teal-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {donor.optedIn ? 'Opted-In (Active)' : 'Withdrawn / Paused'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Protected Contact:</span>
                          <span className="font-mono font-bold text-slate-700 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>{donor.phoneMasked}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Activity Status:</span>
                          <span>{donor.lastActive}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic pt-1">{donor.notes}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => toggleDonorOptIn(donor.id)}
                          className="text-xs font-medium text-slate-500 hover:text-slate-700 underline"
                        >
                          {donor.optedIn ? 'Simulate Donor Withdrawal' : 'Reactivate Availability'}
                        </button>

                        <button
                          onClick={() => setBloodModalOpen(true)}
                          disabled={!isContactable}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            isContactable
                              ? 'bg-[#0F766E] hover:bg-[#0d625c] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isContactable ? 'Send Platform Enquiry' : 'Donor Unavailable'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Standard Provider Results */
          <div className="space-y-3">
            {/* Broadened State search banner */}
            {searchScope === 'state' && userLocation.state && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">
                  <strong>Regional View: </strong>Showing healthcare providers across all of <strong>{userLocation.state}</strong>.
                </span>
                {userLocation.city && (
                  <button
                    onClick={() => setSearchScope('city')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-[#0F766E] text-xs font-bold hover:bg-teal-100/60 transition-colors shadow-2xs"
                  >
                    Narrow to {userLocation.city} only
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 gap-2">
              <span>
                Showing {searchResults.length} nearby healthcare resources{' '}
                {userLocation.city
                  ? `in ${userLocation.city}${searchScope === 'state' ? ` (${userLocation.state})` : ''}`
                  : userLocation.state
                  ? `in ${userLocation.state}`
                  : 'across demonstration pilot hubs'}
              </span>
              <span className="text-[11px] text-teal-800 font-medium flex items-center gap-1">
                {userLocation.latitude ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#0F766E]" />
                    <span>Actual coordinate distance calculated</span>
                  </>
                ) : (
                  <span>Distances approximate (Select GPS for exact km)</span>
                )}
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800">
                    No participating healthcare listings found in {userLocation.city || 'the selected location'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    This is a demonstration prototype with verified listings in selected pilot hubs (such as Gwalior, Morena, Darbhanga, Patna, Lucknow, New Delhi, Kolkata, Mumbai). No participating hospital, ambulance, or blood bank records are currently registered for {userLocation.city || 'this location'}{userLocation.state ? `, ${userLocation.state}` : ''}.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {userLocation.state && searchScope === 'city' && (
                    <button
                      onClick={() => setSearchScope('state')}
                      className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold transition-colors border border-teal-200 flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search across all of {userLocation.state}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleSelectDemoLocation('Madhya Pradesh', 'Gwalior')}
                    className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    View Gwalior Demo
                  </button>
                  <button
                    onClick={() => handleSelectDemoLocation('Madhya Pradesh', 'Morena')}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    View Morena Demo
                  </button>
                  <button
                    onClick={() => handleSelectDemoLocation('Bihar', 'Darbhanga')}
                    className="px-3.5 py-2 rounded-xl border border-teal-200 hover:bg-teal-50 text-[#0F766E] text-xs font-bold transition-colors"
                  >
                    View Darbhanga Demo
                  </button>
                  <button
                    onClick={() => setShowLocationDialog(true)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Change Search Location
                  </button>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left max-w-md mx-auto text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong>Emergency Notice: </strong>
                    If this is an acute medical emergency, dial <strong>112</strong> (All-in-one Emergency) or <strong>108</strong> (Ambulance) immediately from any phone in India. Do not wait for online directory listings.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={`${item.kind}-${item.id}`}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              item.kind === 'hospital'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : item.kind === 'ambulance'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {item.kind === 'blood' ? 'Blood Bank' : item.kind}
                          </span>

                          {item.isVerified && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Listing</span>
                            </span>
                          )}

                          {item.hasEmergencyIcu && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              24x7 ICU
                            </span>
                          )}
                        </div>

                        {/* Calculated Distance */}
                        {item.distanceKm !== null ? (
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2 py-1 rounded-lg border border-teal-200">
                              {item.distanceKm} km away
                            </span>
                          </div>
                        ) : (
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              {item.locality || item.raw.city || 'Local Area'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title & Locality */}
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.address}</span>
                      </div>

                      {/* Specialties / Details */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {item.specialties.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Prototype disclaimer notice */}
                      <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 leading-tight">
                        <span className="font-semibold text-slate-600">Listing Status: </span>
                        {item.statusNotice}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={`tel:${item.phone.split('/')[0].trim()}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>Call Facility</span>
                      </a>

                      {item.kind === 'blood' && (
                        <button
                          onClick={() => {
                            setSelectedCentreForRequest(item.raw as BloodCentre);
                            setBloodModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <Droplets className="w-3.5 h-3.5" />
                          <span>Enquire Blood</span>
                        </button>
                      )}

                      {item.kind === 'ambulance' && (
                        <button
                          onClick={() => setCurrentPage('ambulance')}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <Ambulance className="w-3.5 h-3.5" />
                          <span>Dispatch Simulator</span>
                        </button>
                      )}

                      {item.kind === 'hospital' && (
                        <button
                          onClick={() => setCurrentPage('hospitals')}
                          className="px-3 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <span>Cashless Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Volunteer Donor Registration Modal */}
      {showDonorOptInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Volunteer Blood Donor Opt-In
                </h3>
              </div>
              <button
                onClick={() => setShowDonorOptInModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterDonor} className="space-y-3">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 leading-relaxed">
                <strong>Privacy Guarantee: </strong>
                Your full phone number is never shown publicly. Only masked contact tokens are shown, and you can withdraw your availability at any time with a single click.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alias / Display Name (e.g. Ramesh K.) *
                </label>
                <input
                  type="text"
                  value={newDonorAlias}
                  onChange={(e) => setNewDonorAlias(e.target.value)}
                  placeholder="e.g. Anand K."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F766E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={newDonorBloodGroup}
                    onChange={(e) => setNewDonorBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-2 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold text-[#0F766E]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile (10 digits) *</label>
                  <input
                    type="tel"
                    value={newDonorPhone}
                    onChange={(e) => setNewDonorPhone(e.target.value)}
                    placeholder="e.g. 9431800000"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Approximate Area</label>
                <input
                  type="text"
                  value={newDonorArea}
                  onChange={(e) => setNewDonorArea(e.target.value)}
                  placeholder="e.g. Benta / Medical Campus, Darbhanga"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newDonorConsent}
                  onChange={(e) => setNewDonorConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#0F766E]"
                  required
                />
                <span>
                  I voluntarily opt in to receive emergency blood requests in this city. I understand this is a prototype registry and my private number remains protected.
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDonorOptInModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDonorConsent}
                  className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0d625c] text-white text-xs font-bold disabled:opacity-50"
                >
                  Confirm Opt-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blood Request Modal with Mandatory Review Screen & WhatsApp Disclaimer */}
      <BloodRequestModal
        isOpen={bloodModalOpen}
        onClose={() => {
          setBloodModalOpen(false);
          setSelectedCentreForRequest(undefined);
        }}
        preselectedCentreId={selectedCentreForRequest?.id}
        preselectedCentreName={selectedCentreForRequest?.name}
        initialBloodGroup={selectedBloodGroupFilter !== 'all' ? (selectedBloodGroupFilter as BloodGroup) : undefined}
      />
    </div>
  );
};
