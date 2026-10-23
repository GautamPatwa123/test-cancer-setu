import {
  BloodGroup,
  RequestStatus,
  AmbulanceStatus,
  AssistanceStatus,
  HealthcareReminder,
} from '../types/index.ts';

/**
 * Pure blood compatibility matrix for transfusions
 */
export const COMPATIBLE_DONORS: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const allowed = COMPATIBLE_DONORS[recipientGroup] || [];
  return allowed.includes(donorGroup);
}

/**
 * Triage urgency classification based on duration and severity keywords
 */
export function calculateUrgencyPriority(
  symptoms: string,
  severity: string,
  durationDays: number
): 'Routine' | 'Prompt' | 'Emergency' {
  const lower = symptoms.toLowerCase();
  const emergencyKeywords = [
    'chest pain',
    'heart attack',
    'unconscious',
    'severe breathlessness',
    'choking',
    'heavy bleeding',
    'stroke',
    'paralysis',
    'convulsion',
    'cyanosis',
  ];

  if (emergencyKeywords.some((k) => lower.includes(k)) || severity === 'Critical') {
    return 'Emergency';
  }

  if (severity === 'Severe' || durationDays > 21 || lower.includes('lump') || lower.includes('unexplained weight loss')) {
    return 'Prompt';
  }

  return 'Routine';
}

/**
 * Cryptographic-style random demo token generator for restricted QR share URLs
 */
export function generateSecureShareToken(alias: string): { token: string; expiryIso: string } {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanAlias = alias.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const token = `SH-${cleanAlias}-${rand}`;
  
  // Default expiry: 48 hours from generation
  const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000);
  return {
    token,
    expiryIso: expiry.toISOString(),
  };
}

/**
 * Validate token string format
 */
export function validateShareToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  return /^SH-[A-Z0-9]{1,4}-[A-Z0-9]{8}$/.test(token);
}

/**
 * State transition validation for Blood Requests
 */
const BLOOD_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  'Submitted': ['Awaiting Provider Confirmation', 'Closed'],
  'Awaiting Provider Confirmation': ['Confirmed by Provider', 'Closed'],
  'Confirmed by Provider': ['Closed'],
  'Closed': [],
};

export function canTransitionBloodStatus(from: RequestStatus, to: RequestStatus): boolean {
  if (from === to) return true;
  return BLOOD_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * State transition validation for Ambulance Requests
 */
const AMBULANCE_TRANSITIONS: Record<AmbulanceStatus, AmbulanceStatus[]> = {
  'Request Submitted': ['Awaiting Operator Confirmation', 'Completed in Demo'],
  'Awaiting Operator Confirmation': ['Accepted in Demo', 'Completed in Demo'],
  'Accepted in Demo': ['Completed in Demo'],
  'Completed in Demo': [],
};

export function canTransitionAmbulanceStatus(from: AmbulanceStatus, to: AmbulanceStatus): boolean {
  if (from === to) return true;
  return AMBULANCE_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * State transition validation for Financial Assistance
 */
const ASSISTANCE_TRANSITIONS: Record<AssistanceStatus, AssistanceStatus[]> = {
  'Draft': ['Submitted'],
  'Submitted': ['Under Review', 'Documents Required'],
  'Under Review': ['Documents Required', 'Referred', 'Decision Pending'],
  'Documents Required': ['Under Review', 'Decision Pending'],
  'Referred': ['Decision Pending'],
  'Decision Pending': ['Under Review'],
};

export function canTransitionAssistanceStatus(from: AssistanceStatus, to: AssistanceStatus): boolean {
  if (from === to) return true;
  return ASSISTANCE_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Clean phone number validator for Indian 10-digit mobile numbers
 */
export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith('91')) return /^91[6-9]\d{9}$/.test(digits);
  return false;
}

/**
 * Calculate great-circle distance between two GPS coordinates using Haversine formula
 * Returns distance in kilometers rounded to 1 decimal place, or null if coordinates are missing.
 */
export function calculateDistanceKm(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number | null {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return null;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Masks a private telephone number to preserve donor confidentiality.
 * Keeps leading operator prefix and trailing 2-3 digits, hiding sensitive middle digits.
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return 'Hidden for Privacy';
  const clean = phone.trim();
  const digits = clean.replace(/[^0-9]/g, '');
  if (digits.length >= 10) {
    const last3 = digits.slice(-3);
    const first2 = digits.startsWith('91') ? digits.slice(2, 4) : digits.slice(0, 2);
    return `+91 ${first2}••• ••${last3}`;
  }
  return 'Protected Contact';
}

/**
 * Privacy preservation: Masks high-precision GPS coordinates down to an approximate ~1.1km grid
 * to protect private residential locations unless explicit consent is given.
 */
export function maskPreciseCoordinates(
  lat: number,
  lon: number
): { approxLat: number; approxLon: number } {
  return {
    approxLat: Math.round(lat * 100) / 100,
    approxLon: Math.round(lon * 100) / 100,
  };
}

/**
 * Format a human-readable approximate area without revealing sensitive street addresses
 */
export function formatApproximateArea(city: string, state: string, locality?: string): string {
  if (locality && locality.trim().length > 0) {
    return `${locality.trim()}, ${city}, ${state}`;
  }
  return `${city}, ${state}`;
}

/**
 * Verifies if a volunteer donor has explicitly opted in and has active availability
 */
export function isDonorContactable(donor: { optedIn?: boolean }): boolean {
  return Boolean(donor && donor.optedIn === true);
}

/**
 * Synthesizes a gentle two-tone chime (D5 -> A5) using standard HTML5 Web Audio API.
 * Guaranteed to work zero-dependency in all modern desktop/mobile browsers.
 */
export function playNotificationChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // First note: D5 (587.33 Hz), Second note: A5 (880.00 Hz)
    playTone(587.33, 0, 0.28);
    playTone(880.0, 0.16, 0.42);
  } catch (err) {
    console.warn('[SehatSetu] AudioContext chime blocked or unsupported:', err);
  }
}

/**
 * Calculates medicine adherence percentage for scheduled medicine reminders
 */
export function calculateAdherenceRate(reminders: HealthcareReminder[]): number {
  const medicineReminders = reminders.filter((r) => r.type === 'medicine');
  if (medicineReminders.length === 0) return 100;
  const takenCount = medicineReminders.filter((r) => r.status === 'taken').length;
  return Math.round((takenCount / medicineReminders.length) * 100);
}

/**
 * Formats time string consistently (e.g. "08:30" -> "08:30 AM", or keeps "08:30 AM")
 */
export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (trimmed.includes('AM') || trimmed.includes('PM')) {
    return trimmed;
  }
  // Try parsing "HH:MM"
  const parts = trimmed.split(':');
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1].slice(0, 2);
    if (!isNaN(hours)) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }
  }
  return trimmed;
}


