export type Language = 'en' | 'hi';

export type UserRole = 'patient' | 'admin';

export type PageId =
  | 'landing'
  | 'overview'
  | 'find-care'
  | 'reminders'
  | 'ai-assistant'
  | 'blood'
  | 'ambulance'
  | 'documents'
  | 'qr-profile'
  | 'ngo-assistance'
  | 'hospitals'
  | 'requests'
  | 'admin'
  | 'profile-settings';

export interface UserLocation {
  type: 'geolocation' | 'manual';
  state: string;
  city: string;
  locality?: string;
  approximateArea: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  timestamp?: string;
  isPermissionGranted: boolean;
}

export interface VolunteerDonor {
  id: string;
  alias: string;
  bloodGroup: BloodGroup;
  city: string;
  state: string;
  approximateArea: string;
  phoneMasked: string;
  optedIn: boolean;
  lastActive: string;
  verifiedDonor: boolean;
  notes: string;
}

export interface CareProviderItem {
  id: string;
  type: 'hospital' | 'ambulance' | 'blood_bank';
  name: string;
  categoryOrSpecialty: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  phone: string;
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isDemoData: boolean;
  operatingStatusNotice: string;
  attributes: {
    emergencyAvailable?: boolean;
    icuAvailable?: boolean;
    ayushmanEmpanelled?: boolean;
    bloodStockAvailable?: boolean;
    fareEstimate?: string;
  };
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 'Whole Blood' | 'Packed Red Cells' | 'Platelets' | 'Plasma';

export type RequestStatus =
  | 'Submitted'
  | 'Awaiting Provider Confirmation'
  | 'Confirmed by Provider'
  | 'Closed';

export type AmbulanceStatus =
  | 'Request Submitted'
  | 'Awaiting Operator Confirmation'
  | 'Accepted in Demo'
  | 'Completed in Demo';

export type AssistanceStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Documents Required'
  | 'Referred'
  | 'Decision Pending';

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note: string;
  actor: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  alias: string;
  age: number;
  gender: string;
  location: string;
  district: string;
  state: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredHospital: string;
  medicalSummary: string;
  notes: string;
  qrToken: string;
  qrTokenExpiry: string;
  qrActive: boolean;
  sharedFields: {
    alias: boolean;
    bloodGroup: boolean;
    allergies: boolean;
    conditions: boolean;
    medications: boolean;
    emergencyContact: boolean;
    preferredHospital: boolean;
    medicalSummary: boolean;
  };
}

export interface BloodRequest {
  id: string;
  patientId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  urgency: 'Normal' | 'Urgent' | 'Critical Emergency';
  requiredDate: string;
  centreId: string;
  centreName: string;
  contactPreference: 'Phone' | 'SMS' | 'WhatsApp (Future)';
  patientPhone: string;
  state?: string;
  city?: string;
  approximateLocation?: string;
  sharePreciseLocation?: boolean;
  donorNotificationConsent?: boolean;
  notificationStatus?: string;
  additionalNotes?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  history: StatusHistoryItem[];
}

export interface AmbulanceRequest {
  id: string;
  patientId: string;
  patientName: string;
  pickupLocation: string;
  destination: string;
  category: 'Basic Life Support (BLS)' | 'Advanced Cardiac (ALS)' | 'Patient Transport (PTS)' | 'Neonatal ICU';
  providerId: string;
  providerName: string;
  specialNeeds?: string;
  contactPhone: string;
  status: AmbulanceStatus;
  estimatedArrivalMinutes?: number;
  createdAt: string;
  updatedAt: string;
  history: StatusHistoryItem[];
}

export interface AssistanceApplication {
  id: string;
  patientId: string;
  patientName: string;
  applicantId: string;
  category: 'Oncology / Cancer Care' | 'Cardiac Surgery' | 'Dialysis Support' | 'Rare Disease / Pediatric';
  treatmentNeed: string;
  hospitalName: string;
  supportType: 'Financial Aid' | 'Medicine Subsidy' | 'Ration & Travel Grant' | 'Ayushman Gap Funding';
  estimatedCost: number;
  requiredDocuments: {
    incomeCertificate: boolean;
    rationCard: boolean;
    medicalDiagnosisReport: boolean;
    hospitalCostEstimate: boolean;
  };
  notes?: string;
  consentGiven: boolean;
  status: AssistanceStatus;
  createdAt: string;
  updatedAt: string;
  history: StatusHistoryItem[];
}

export interface MedicalDoc {
  id: string;
  patientId: string;
  title: string;
  fileName: string;
  category: 'Prescription' | 'Laboratory Report' | 'Imaging Report' | 'Discharge Summary' | 'Other';
  fileSize: string;
  uploadedAt: string;
  notes: string;
  tags: string[];
  extractedText?: string;
  aiExplanation?: {
    documentType: string;
    keyFindings: string[];
    medicalTermsExplained: { term: string; meaning: string }[];
    questionsForDoctor: string[];
    importantLimitations: string;
    source: string;
  };
}

export interface BloodCentre {
  id: string;
  name: string;
  locality: string;
  city?: string;
  state?: string;
  address: string;
  phone: string;
  verified: boolean;
  lastUpdated: string;
  isGovernment: boolean;
  latitude?: number;
  longitude?: number;
  isDemoData?: boolean;
  stock: Record<BloodGroup, Record<BloodComponent, number>>;
}

export interface AmbulanceProvider {
  id: string;
  name: string;
  locality: string;
  address?: string;
  city?: string;
  state?: string;
  phone: string;
  category: 'Basic Life Support (BLS)' | 'Advanced Cardiac (ALS)' | 'Patient Transport (PTS)' | 'Neonatal ICU';
  equipment: string[];
  availability: 'Available' | 'On Call' | 'Busy';
  verified: boolean;
  lastVerified: string;
  baseFare: string;
  distanceKm: number;
  latitude?: number;
  longitude?: number;
  isDemoData?: boolean;
}

export interface NgoListing {
  id: string;
  name: string;
  areaServed: string;
  category: string;
  contact: string;
  website: string;
  eligibility: string;
  focusArea: string;
  verified: boolean;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  ministry: string;
  coverageAmount: string;
  beneficiaryType: string;
  eligibility: string;
  howToApply: string;
  verified: boolean;
}

export interface HospitalListing {
  id: string;
  name: string;
  address: string;
  locality: string;
  city?: string;
  state?: string;
  type: 'Government' | 'Private' | 'Charitable';
  specialties: string[];
  contact: string;
  insuranceEmpanelled: string[];
  governmentSchemes: string[];
  cashlessDeskPhone: string;
  verificationStatus: 'Verified' | 'Pending Verification' | 'Demo Information';
  lastVerified: string;
  bedCount: number;
  hasEmergencyIcu: boolean;
  latitude?: number;
  longitude?: number;
  isDemoData?: boolean;
}

export type ReminderType = 'medicine' | 'appointment';
export type ReminderRecurrence = 'daily' | 'twice_daily' | 'weekly' | 'once';
export type ReminderStatus = 'pending' | 'taken' | 'missed' | 'completed';

export interface HealthcareReminder {
  id: string;
  patientId: string;
  type: ReminderType;
  title: string;
  dosageOrDoctor: string;
  time: string; // e.g. "08:30" or "08:30 AM"
  date: string; // e.g. "2026-10-22"
  recurrence: ReminderRecurrence;
  facilityName?: string;
  notes?: string;
  status: ReminderStatus;
  lastTakenTimestamp?: string;
  audioChimeEnabled: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType: 'Blood' | 'Ambulance' | 'Assistance' | 'Document' | 'Profile' | 'Security' | 'Reminder';
  actor: string;
  details: string;
}

export type Theme = 'light' | 'dark';


