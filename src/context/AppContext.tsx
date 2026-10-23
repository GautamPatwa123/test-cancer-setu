import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  Language,
  UserRole,
  PatientProfile,
  BloodCentre,
  AmbulanceProvider,
  NgoListing,
  GovernmentScheme,
  HospitalListing,
  BloodRequest,
  AmbulanceRequest,
  AssistanceApplication,
  MedicalDoc,
  AuditLog,
  RequestStatus,
  AmbulanceStatus,
  AssistanceStatus,
  BloodGroup,
  BloodComponent,
  UserLocation,
  VolunteerDonor,
  HealthcareReminder,
  ReminderStatus,
  Theme,
} from '../types/index.ts';
import {
  INITIAL_PATIENT,
  INITIAL_BLOOD_CENTRES,
  INITIAL_AMBULANCES,
  INITIAL_DOCUMENTS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_AMBULANCE_REQUESTS,
  INITIAL_ASSISTANCE_APPLICATIONS,
  INITIAL_NGOS,
  INITIAL_GOVT_SCHEMES,
  INITIAL_HOSPITALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_VOLUNTEER_DONORS,
  INITIAL_REMINDERS,
  INDIAN_STATES_CITIES,
} from '../data/mockData.ts';
import {
  generateSecureShareToken,
  maskPreciseCoordinates,
  formatApproximateArea,
  playNotificationChime,
  calculateAdherenceRate,
  calculateDistanceKm,
} from '../utils/healthLogic.ts';
import { translations } from '../translations/index.ts';

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdminAuthenticated: boolean;
  adminLogin: (pinOrPassword: string) => { success: boolean; message: string };
  adminLogout: () => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  publicQrPreviewToken: string | null;
  setPublicQrPreviewToken: (token: string | null) => void;

  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  requestBrowserLocation: () => Promise<{ success: boolean; message: string }>;
  setManualLocation: (state: string, city: string, locality?: string) => void;
  clearLocation: () => void;

  volunteerDonors: VolunteerDonor[];
  toggleDonorOptIn: (donorId: string) => void;
  registerVolunteerDonor: (data: Omit<VolunteerDonor, 'id' | 'lastActive'>) => VolunteerDonor;

  patient: PatientProfile;
  updatePatientProfile: (updated: Partial<PatientProfile>) => void;
  toggleSharedField: (field: keyof PatientProfile['sharedFields']) => void;
  regenerateQrToken: () => void;
  revokeQrToken: () => void;

  bloodCentres: BloodCentre[];
  ambulances: AmbulanceProvider[];
  documents: MedicalDoc[];
  bloodRequests: BloodRequest[];
  ambulanceRequests: AmbulanceRequest[];
  assistanceApplications: AssistanceApplication[];
  ngos: NgoListing[];
  govtSchemes: GovernmentScheme[];
  hospitals: HospitalListing[];
  auditLogs: AuditLog[];
  reminders: HealthcareReminder[];

  createReminder: (data: Omit<HealthcareReminder, 'id' | 'createdAt' | 'status'>) => HealthcareReminder;
  updateReminderStatus: (id: string, newStatus: ReminderStatus) => void;
  deleteReminder: (id: string) => void;
  triggerReminderNotification: (reminder: HealthcareReminder) => Promise<{ permission: string; triggered: boolean }>;
  testNotificationAlert: (customTitle?: string, customBody?: string) => Promise<{ permission: string; triggered: boolean }>;

  createBloodRequest: (data: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>) => BloodRequest;
  updateBloodRequestStatus: (requestId: string, newStatus: RequestStatus, note?: string) => void;

  createAmbulanceRequest: (data: Omit<AmbulanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>) => AmbulanceRequest;
  updateAmbulanceRequestStatus: (requestId: string, newStatus: AmbulanceStatus, note?: string) => void;

  createAssistanceApplication: (data: Omit<AssistanceApplication, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>) => AssistanceApplication;
  updateAssistanceStatus: (appId: string, newStatus: AssistanceStatus, note?: string) => void;

  uploadDocument: (doc: Omit<MedicalDoc, 'id' | 'uploadedAt'>) => MedicalDoc;
  updateDocumentAiExplanation: (docId: string, explanation: MedicalDoc['aiExplanation']) => void;

  resetAllDemoData: () => void;
  showResetConfirmModal: boolean;
  setShowResetConfirmModal: (show: boolean) => void;
}

const STORAGE_KEY = 'sehatsetu_data_v2';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Admin authentication state & modal
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_admin_auth`) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Theme state: light or dark
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('sehatsetu_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem('sehatsetu_theme', nextTheme);
    } catch {}
    if (typeof document !== 'undefined') {
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [theme]);

  // User location preference (neutral prompt by default, or browser GPS after explicit button click)
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user_location`);
      return saved
        ? JSON.parse(saved)
        : {
            type: 'manual',
            state: '',
            city: '',
            approximateArea: 'Location not set',
            isPermissionGranted: false,
          };
    } catch {
      return {
        type: 'manual',
        state: '',
        city: '',
        approximateArea: 'Location not set',
        isPermissionGranted: false,
      };
    }
  });

  const [selectedCity, setSelectedCity] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_user_location`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.city && parsed.state) {
          return `${parsed.city}, ${parsed.state}`;
        } else if (parsed.city) {
          return parsed.city;
        } else if (parsed.state) {
          return parsed.state;
        }
      }
    } catch {}
    return 'Select Location';
  });

  const [publicQrPreviewToken, setPublicQrPreviewToken] = useState<string | null>(null);

  // Volunteer donor community registry with opt-in status
  const [volunteerDonors, setVolunteerDonors] = useState<VolunteerDonor[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_donors`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((d: VolunteerDonor) => d.id));
        const missing = INITIAL_VOLUNTEER_DONORS.filter((d) => !existingIds.has(d.id));
        return [...parsed, ...missing];
      }
      return INITIAL_VOLUNTEER_DONORS;
    } catch {
      return INITIAL_VOLUNTEER_DONORS;
    }
  });

  // Load from local storage or defaults
  const [patient, setPatient] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_patient`);
      return saved ? JSON.parse(saved) : INITIAL_PATIENT;
    } catch {
      return INITIAL_PATIENT;
    }
  });

  const [bloodCentres, setBloodCentres] = useState<BloodCentre[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_blood_centres`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((b: BloodCentre) => b.id));
        const missing = INITIAL_BLOOD_CENTRES.filter((b) => !existingIds.has(b.id));
        return [...parsed, ...missing];
      }
      return INITIAL_BLOOD_CENTRES;
    } catch {
      return INITIAL_BLOOD_CENTRES;
    }
  });

  const [ambulances, setAmbulances] = useState<AmbulanceProvider[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ambulances`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((a: AmbulanceProvider) => a.id));
        const missing = INITIAL_AMBULANCES.filter((a) => !existingIds.has(a.id));
        return [...parsed, ...missing];
      }
      return INITIAL_AMBULANCES;
    } catch {
      return INITIAL_AMBULANCES;
    }
  });

  const [documents, setDocuments] = useState<MedicalDoc[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_blood_requests`);
      return saved ? JSON.parse(saved) : INITIAL_BLOOD_REQUESTS;
    } catch {
      return INITIAL_BLOOD_REQUESTS;
    }
  });

  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ambulance_requests`);
      return saved ? JSON.parse(saved) : INITIAL_AMBULANCE_REQUESTS;
    } catch {
      return INITIAL_AMBULANCE_REQUESTS;
    }
  });

  const [assistanceApplications, setAssistanceApplications] = useState<AssistanceApplication[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_assistance_apps`);
      return saved ? JSON.parse(saved) : INITIAL_ASSISTANCE_APPLICATIONS;
    } catch {
      return INITIAL_ASSISTANCE_APPLICATIONS;
    }
  });

  const [hospitals, setHospitals] = useState<HospitalListing[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_hospitals`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((h: HospitalListing) => h.id));
        const missing = INITIAL_HOSPITALS.filter((h) => !existingIds.has(h.id));
        return [...parsed, ...missing];
      }
      return INITIAL_HOSPITALS;
    } catch {
      return INITIAL_HOSPITALS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_audit_logs`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [reminders, setReminders] = useState<HealthcareReminder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reminders`);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  // Persistent storage side-effects
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user_location`, JSON.stringify(userLocation));
      localStorage.setItem(`${STORAGE_KEY}_donors`, JSON.stringify(volunteerDonors));
      localStorage.setItem(`${STORAGE_KEY}_patient`, JSON.stringify(patient));
      localStorage.setItem(`${STORAGE_KEY}_blood_centres`, JSON.stringify(bloodCentres));
      localStorage.setItem(`${STORAGE_KEY}_ambulances`, JSON.stringify(ambulances));
      localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
      localStorage.setItem(`${STORAGE_KEY}_blood_requests`, JSON.stringify(bloodRequests));
      localStorage.setItem(`${STORAGE_KEY}_ambulance_requests`, JSON.stringify(ambulanceRequests));
      localStorage.setItem(`${STORAGE_KEY}_assistance_apps`, JSON.stringify(assistanceApplications));
      localStorage.setItem(`${STORAGE_KEY}_hospitals`, JSON.stringify(hospitals));
      localStorage.setItem(`${STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_reminders`, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  }, [
    userLocation,
    volunteerDonors,
    patient,
    bloodCentres,
    ambulances,
    documents,
    bloodRequests,
    ambulanceRequests,
    assistanceApplications,
    hospitals,
    auditLogs,
    reminders,
  ]);

  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || translations['en'][key] || String(key);
  };

  const addAuditLog = (entityType: AuditLog['entityType'], action: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }),
      action,
      entityType,
      actor: userRole === 'admin' ? 'Dr. Anand Verma (Admin)' : `${patient.name} (Patient)`,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const adminLogin = (pinOrPassword: string): { success: boolean; message: string } => {
    const clean = pinOrPassword.trim();
    if (clean === '749001' || clean === 'admin123' || clean === '123456') {
      setIsAdminAuthenticated(true);
      setUserRole('admin');
      setIsAdminLoginModalOpen(false);
      try {
        localStorage.setItem(`${STORAGE_KEY}_admin_auth`, 'true');
      } catch {}
      addAuditLog('Security', 'ADMIN_PORTAL_AUTHENTICATED', 'Authorized administrator login with verified PIN 749001.');
      return { success: true, message: 'Authentication successful. Welcome to Regional Operations Command.' };
    }
    addAuditLog('Security', 'ADMIN_LOGIN_FAILED', 'Failed PIN entry attempt on protected Administrator Portal.');
    return { success: false, message: 'Invalid administrative security PIN. Please use demo PIN: 749001.' };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setUserRole('patient');
    try {
      localStorage.removeItem(`${STORAGE_KEY}_admin_auth`);
    } catch {}
    addAuditLog('Security', 'ADMIN_SESSION_TERMINATED', 'Administrator session logged out. Switched to patient view.');
    if (currentPage === 'admin') {
      setCurrentPage('overview');
    }
  };

  const requestBrowserLocation = async (): Promise<{ success: boolean; message: string }> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return {
        success: false,
        message: 'Browser geolocation is not available on this device. You can select your Indian state and city manually below.',
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const { approxLat, approxLon } = maskPreciseCoordinates(latitude, longitude);

          // Find closest matching city in Indian states and cities database
          let closestCity = '';
          let closestState = '';
          let minDistance = Infinity;

          for (const s of INDIAN_STATES_CITIES) {
            for (const c of s.cities) {
              const d = calculateDistanceKm(latitude, longitude, c.lat, c.lon);
              if (d !== null && d < minDistance) {
                minDistance = d;
                closestCity = c.name;
                closestState = s.state;
              }
            }
          }

          let approxLabel = `Approx. Area (${approxLat.toFixed(2)}° N, ${approxLon.toFixed(2)}° E)`;
          let detectedCity = '';
          let detectedState = '';

          // If within ~65km of a mapped Indian city, pair it with that city & state
          if (minDistance <= 65 && closestCity && closestState) {
            detectedCity = closestCity;
            detectedState = closestState;
            approxLabel = `${closestCity}, ${closestState} (GPS)`;
          }

          const newLoc: UserLocation = {
            type: 'geolocation',
            state: detectedState,
            city: detectedCity,
            approximateArea: approxLabel,
            latitude,
            longitude,
            accuracyMeters: Math.round(accuracy),
            timestamp: new Date().toISOString(),
            isPermissionGranted: true,
          };
          setUserLocation(newLoc);
          if (detectedCity && detectedState) {
            setSelectedCity(`${detectedCity}, ${detectedState}`);
          } else {
            setSelectedCity(approxLabel);
          }
          addAuditLog(
            'Security',
            'GPS_LOCATION_ACCESSED',
            `User authorized browser geolocation via 'Use my location' button. Approximate grid (${approxLat}, ${approxLon}) used for nearby care distances.`
          );
          resolve({ success: true, message: `Location detected: ${approxLabel}` });
        },
        (err) => {
          // Never replace a failed or unavailable location with Darbhanga or another guessed location
          let msg = 'Location request was declined. You can select your Indian state and city manually below.';
          if (err.code === err.PERMISSION_DENIED) {
            msg = 'Location request was declined. You can select your Indian state and city manually below.';
          } else if (err.code === err.TIMEOUT) {
            msg = 'Location request timed out. You can select your Indian state and city manually below.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            msg = 'Location position unavailable. You can select your Indian state and city manually below.';
          }
          addAuditLog('Security', 'GPS_PERMISSION_DENIED', `Browser geolocation request was not granted (${err.message}). Manual fallback active.`);
          resolve({ success: false, message: msg });
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    });
  };

  const setManualLocation = (state: string, city: string, locality?: string) => {
    const cleanState = (state || '').trim();
    const cleanCity = (city || '').trim();
    const area = formatApproximateArea(cleanCity, cleanState, locality);

    // Look up approximate coordinates from all Indian states and cities
    let lat: number | undefined;
    let lon: number | undefined;

    if (cleanCity) {
      for (const s of INDIAN_STATES_CITIES) {
        if (!cleanState || s.state.toLowerCase() === cleanState.toLowerCase()) {
          const match = s.cities.find((c) => c.name.toLowerCase() === cleanCity.toLowerCase());
          if (match) {
            lat = match.lat;
            lon = match.lon;
            break;
          }
        }
      }
    }

    const newLoc: UserLocation = {
      type: 'manual',
      state: cleanState,
      city: cleanCity,
      approximateArea: area || (cleanCity ? cleanCity : 'Location set'),
      latitude: lat,
      longitude: lon,
      isPermissionGranted: false,
    };
    setUserLocation(newLoc);
    setSelectedCity(cleanCity && cleanState ? `${cleanCity}, ${cleanState}` : cleanCity || cleanState || 'Select Location');
    addAuditLog('Profile', 'MANUAL_LOCATION_SET', `User manually chose ${area || cleanCity || cleanState}.`);
  };

  const clearLocation = () => {
    const cleared: UserLocation = {
      type: 'manual',
      state: '',
      city: '',
      approximateArea: 'Location not set',
      isPermissionGranted: false,
    };
    setUserLocation(cleared);
    setSelectedCity('Select Location');
    addAuditLog('Security', 'LOCATION_CLEARED', 'Location cleared. Reset to neutral prompt.');
  };

  const toggleDonorOptIn = (donorId: string) => {
    setVolunteerDonors((prev) =>
      prev.map((d) => {
        if (d.id !== donorId) return d;
        const nextOpt = !d.optedIn;
        addAuditLog(
          'Security',
          'DONOR_OPT_IN_STATUS',
          `Volunteer donor ${d.alias} availability changed to: ${nextOpt ? 'Opted-In (Active)' : 'Withdrawn / Paused'}`
        );
        return {
          ...d,
          optedIn: nextOpt,
          lastActive: nextOpt ? 'Active today' : 'Availability paused',
        };
      })
    );
  };

  const registerVolunteerDonor = (data: Omit<VolunteerDonor, 'id' | 'lastActive'>): VolunteerDonor => {
    const newDonor: VolunteerDonor = {
      ...data,
      id: `DONOR-VOL-${Date.now()}`,
      lastActive: 'Registered today',
    };
    setVolunteerDonors((prev) => [newDonor, ...prev]);
    addAuditLog(
      'Blood',
      'VOLUNTEER_DONOR_REGISTERED',
      `Registered volunteer donor ${data.alias} for blood group ${data.bloodGroup} in ${data.approximateArea}. Private phone protected.`
    );
    return newDonor;
  };

  const updatePatientProfile = (updated: Partial<PatientProfile>) => {
    setPatient((prev) => ({ ...prev, ...updated }));
    addAuditLog('Profile', 'PROFILE_UPDATED', 'Patient medical profile fields updated');
  };

  const toggleSharedField = (field: keyof PatientProfile['sharedFields']) => {
    setPatient((prev) => ({
      ...prev,
      sharedFields: {
        ...prev.sharedFields,
        [field]: !prev.sharedFields[field],
      },
    }));
    addAuditLog('Security', 'QR_PERMISSIONS_CHANGED', `Field "${String(field)}" toggled in emergency QR profile`);
  };

  const regenerateQrToken = () => {
    const { token, expiryIso } = generateSecureShareToken(patient.name);
    setPatient((prev) => ({
      ...prev,
      qrToken: token,
      qrTokenExpiry: expiryIso,
      qrActive: true,
    }));
    addAuditLog('Security', 'QR_TOKEN_REGENERATED', `New emergency token ${token} created with 48hr expiry`);
  };

  const revokeQrToken = () => {
    setPatient((prev) => ({
      ...prev,
      qrActive: false,
    }));
    addAuditLog('Security', 'QR_TOKEN_REVOKED', 'Active QR share link revoked. Access blocked.');
  };

  const createBloodRequest = (data: Omit<BloodRequest, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>): BloodRequest => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newReq: BloodRequest = {
      ...data,
      id: `REQ-BLD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: 'Submitted',
          timestamp: now,
          note: `Availability enquiry submitted for ${data.units} unit(s) of ${data.bloodGroup} ${data.component}.`,
          actor: data.patientName,
        },
      ],
    };

    setBloodRequests((prev) => [newReq, ...prev]);
    addAuditLog('Blood', 'BLOOD_REQUEST_CREATED', `${newReq.id} created for ${data.bloodGroup} ${data.component} at ${data.centreName}`);
    return newReq;
  };

  const updateBloodRequestStatus = (requestId: string, newStatus: RequestStatus, note?: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setBloodRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const historyItem = {
          status: newStatus,
          timestamp: now,
          note: note || `Status transitioned to ${newStatus}.`,
          actor: userRole === 'admin' ? 'Dr. Verma (Nodal Officer)' : patient.name,
        };
        return {
          ...req,
          status: newStatus,
          updatedAt: now,
          history: [...req.history, historyItem],
        };
      })
    );
    addAuditLog('Blood', 'BLOOD_STATUS_UPDATED', `${requestId} marked as ${newStatus}`);
  };

  const createAmbulanceRequest = (data: Omit<AmbulanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>): AmbulanceRequest => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newReq: AmbulanceRequest = {
      ...data,
      id: `REQ-AMB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Request Submitted',
      estimatedArrivalMinutes: 12,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: 'Request Submitted',
          timestamp: now,
          note: `Pickup requested at ${data.pickupLocation} to ${data.destination}.`,
          actor: data.patientName,
        },
      ],
    };

    setAmbulanceRequests((prev) => [newReq, ...prev]);
    addAuditLog('Ambulance', 'AMBULANCE_DISPATCH_REQUESTED', `${newReq.id} placed for ${data.category} unit (${data.providerName})`);
    return newReq;
  };

  const updateAmbulanceRequestStatus = (requestId: string, newStatus: AmbulanceStatus, note?: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setAmbulanceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const historyItem = {
          status: newStatus,
          timestamp: now,
          note: note || `Status updated to ${newStatus}.`,
          actor: userRole === 'admin' ? 'Dispatch Nodal Desk' : 'Emergency Driver',
        };
        return {
          ...req,
          status: newStatus,
          updatedAt: now,
          history: [...req.history, historyItem],
        };
      })
    );
    addAuditLog('Ambulance', 'AMBULANCE_STATUS_UPDATED', `${requestId} updated to ${newStatus}`);
  };

  const createAssistanceApplication = (
    data: Omit<AssistanceApplication, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'status'>
  ): AssistanceApplication => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newApp: AssistanceApplication = {
      ...data,
      id: `APP-NGO-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: 'Submitted',
          timestamp: now,
          note: `Application filed under category: ${data.category} for treatment at ${data.hospitalName}.`,
          actor: data.patientName,
        },
      ],
    };

    setAssistanceApplications((prev) => [newApp, ...prev]);
    addAuditLog('Assistance', 'ASSISTANCE_APPLICATION_FILED', `${newApp.id} submitted for ${data.category} support`);
    return newApp;
  };

  const updateAssistanceStatus = (appId: string, newStatus: AssistanceStatus, note?: string) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setAssistanceApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const historyItem = {
          status: newStatus,
          timestamp: now,
          note: note || `Review stage changed to ${newStatus}.`,
          actor: userRole === 'admin' ? 'Health Committee Reviewer' : 'Assigned Case Worker',
        };
        return {
          ...app,
          status: newStatus,
          updatedAt: now,
          history: [...app.history, historyItem],
        };
      })
    );
    addAuditLog('Assistance', 'ASSISTANCE_STATUS_UPDATED', `${appId} updated to ${newStatus}`);
  };

  const uploadDocument = (doc: Omit<MedicalDoc, 'id' | 'uploadedAt'>): MedicalDoc => {
    const now = new Date().toISOString().slice(0, 10);
    const newDoc: MedicalDoc = {
      ...doc,
      id: `DOC-2026-${Math.floor(100 + Math.random() * 900)}`,
      uploadedAt: now,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addAuditLog('Document', 'DOCUMENT_UPLOADED', `Document "${newDoc.fileName}" registered to patient profile`);
    return newDoc;
  };

  const updateDocumentAiExplanation = (docId: string, explanation: MedicalDoc['aiExplanation']) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, aiExplanation: explanation } : doc))
    );
    addAuditLog('Document', 'AI_REPORT_EXPLAINED', `Plain-language summary generated for ${docId}`);
  };

  const createReminder = (data: Omit<HealthcareReminder, 'id' | 'createdAt' | 'status'>): HealthcareReminder => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const prefix = data.type === 'medicine' ? 'REM-MED' : 'REM-APT';
    const newRem: HealthcareReminder = {
      ...data,
      id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: now,
    };
    setReminders((prev) => [newRem, ...prev]);
    addAuditLog(
      'Reminder',
      'REMINDER_CREATED',
      `New ${data.type} reminder set for "${data.title}" at ${data.time} (${data.date})`
    );
    if (data.audioChimeEnabled) {
      playNotificationChime();
    }
    return newRem;
  };

  const updateReminderStatus = (id: string, newStatus: ReminderStatus) => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setReminders((prev) =>
      prev.map((rem) => {
        if (rem.id !== id) return rem;
        return {
          ...rem,
          status: newStatus,
          lastTakenTimestamp: newStatus === 'taken' || newStatus === 'completed' ? now : rem.lastTakenTimestamp,
        };
      })
    );
    addAuditLog('Reminder', 'REMINDER_STATUS_UPDATED', `Reminder ${id} marked as ${newStatus}`);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((rem) => rem.id !== id));
    addAuditLog('Reminder', 'REMINDER_DELETED', `Reminder ${id} removed from schedule`);
  };

  const triggerReminderNotification = async (
    reminder: HealthcareReminder
  ): Promise<{ permission: string; triggered: boolean }> => {
    if (reminder.audioChimeEnabled) {
      playNotificationChime();
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        let perm = Notification.permission;
        if (perm === 'default') {
          perm = await Notification.requestPermission();
        }

        if (perm === 'granted') {
          const bodyText =
            reminder.type === 'medicine'
              ? `Time to take ${reminder.title} (${reminder.dosageOrDoctor})`
              : `Upcoming appointment: ${reminder.title} with ${reminder.dosageOrDoctor} at ${reminder.time}`;

          new Notification('SehatSetu Healthcare Reminder', {
            body: bodyText,
            icon: '/favicon.ico',
            tag: `reminder-${reminder.id}`,
          });

          addAuditLog('Reminder', 'BROWSER_NOTIFICATION_SENT', `Triggered browser notification for "${reminder.title}"`);
          return { permission: perm, triggered: true };
        }
        return { permission: perm, triggered: false };
      } catch (err) {
        console.warn('[SehatSetu] Browser notification error:', err);
        return { permission: 'denied', triggered: false };
      }
    }
    return { permission: 'unsupported', triggered: false };
  };

  const testNotificationAlert = async (
    customTitle = 'SehatSetu Test Alert',
    customBody = 'Medicine reminder test: Audio chime & notification active!'
  ): Promise<{ permission: string; triggered: boolean }> => {
    playNotificationChime();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        let perm = Notification.permission;
        if (perm === 'default') {
          perm = await Notification.requestPermission();
        }

        if (perm === 'granted') {
          new Notification(customTitle, {
            body: customBody,
            icon: '/favicon.ico',
            tag: `test-chime-${Date.now()}`,
          });
          addAuditLog('Reminder', 'TEST_NOTIFICATION_FIRED', 'Test chime played and browser alert delivered');
          return { permission: perm, triggered: true };
        }
        return { permission: perm, triggered: false };
      } catch (err) {
        console.warn('[SehatSetu] Notification error:', err);
        return { permission: 'denied', triggered: false };
      }
    }
    return { permission: 'unsupported', triggered: false };
  };

  const resetAllDemoData = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_user_location`);
      localStorage.removeItem(`${STORAGE_KEY}_donors`);
      localStorage.removeItem(`${STORAGE_KEY}_patient`);
      localStorage.removeItem(`${STORAGE_KEY}_blood_centres`);
      localStorage.removeItem(`${STORAGE_KEY}_ambulances`);
      localStorage.removeItem(`${STORAGE_KEY}_documents`);
      localStorage.removeItem(`${STORAGE_KEY}_blood_requests`);
      localStorage.removeItem(`${STORAGE_KEY}_ambulance_requests`);
      localStorage.removeItem(`${STORAGE_KEY}_assistance_apps`);
      localStorage.removeItem(`${STORAGE_KEY}_hospitals`);
      localStorage.removeItem(`${STORAGE_KEY}_audit_logs`);
      localStorage.removeItem(`${STORAGE_KEY}_reminders`);
    } catch {}

    setUserLocation({
      type: 'manual',
      state: '',
      city: '',
      approximateArea: 'Location not set',
      isPermissionGranted: false,
    });
    setSelectedCity('Select Location');
    setVolunteerDonors(INITIAL_VOLUNTEER_DONORS);
    setPatient(INITIAL_PATIENT);
    setBloodCentres(INITIAL_BLOOD_CENTRES);
    setAmbulances(INITIAL_AMBULANCES);
    setDocuments(INITIAL_DOCUMENTS);
    setBloodRequests(INITIAL_BLOOD_REQUESTS);
    setAmbulanceRequests(INITIAL_AMBULANCE_REQUESTS);
    setAssistanceApplications(INITIAL_ASSISTANCE_APPLICATIONS);
    setHospitals(INITIAL_HOSPITALS);
    setReminders(INITIAL_REMINDERS);
    setAuditLogs([
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
        action: 'DATA_RESET_DEFAULT',
        entityType: 'Security',
        actor: 'Administrator',
        details: 'All demonstration records restored to factory prototype baseline.',
      },
    ]);
    setShowResetConfirmModal(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        theme,
        setTheme,
        toggleTheme,
        selectedCity,
        setSelectedCity,
        publicQrPreviewToken,
        setPublicQrPreviewToken,
        userLocation,
        setUserLocation,
        requestBrowserLocation,
        setManualLocation,
        clearLocation,
        volunteerDonors,
        toggleDonorOptIn,
        registerVolunteerDonor,
        patient,
        updatePatientProfile,
        toggleSharedField,
        regenerateQrToken,
        revokeQrToken,
        bloodCentres,
        ambulances,
        documents,
        bloodRequests,
        ambulanceRequests,
        assistanceApplications,
        ngos: INITIAL_NGOS,
        govtSchemes: INITIAL_GOVT_SCHEMES,
        hospitals,
        auditLogs,
        reminders,
        createReminder,
        updateReminderStatus,
        deleteReminder,
        triggerReminderNotification,
        testNotificationAlert,
        createBloodRequest,
        updateBloodRequestStatus,
        createAmbulanceRequest,
        updateAmbulanceRequestStatus,
        createAssistanceApplication,
        updateAssistanceStatus,
        uploadDocument,
        updateDocumentAiExplanation,
        resetAllDemoData,
        showResetConfirmModal,
        setShowResetConfirmModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
