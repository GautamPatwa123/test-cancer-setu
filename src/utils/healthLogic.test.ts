import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBloodCompatible,
  calculateUrgencyPriority,
  generateSecureShareToken,
  validateShareToken,
  canTransitionBloodStatus,
  canTransitionAmbulanceStatus,
  isValidIndianPhone,
  calculateDistanceKm,
  maskPhoneNumber,
  maskPreciseCoordinates,
  formatApproximateArea,
  isDonorContactable,
  calculateAdherenceRate,
  formatTimeDisplay,
} from './healthLogic.ts';

test('isBloodCompatible checks transfusion compatibility correctly', () => {
  // O- is universal donor for RBCs
  assert.equal(isBloodCompatible('O-', 'AB+'), true);
  assert.equal(isBloodCompatible('O-', 'O+'), true);
  assert.equal(isBloodCompatible('O-', 'B-'), true);

  // AB+ can receive from anyone
  assert.equal(isBloodCompatible('A+', 'AB+'), true);
  assert.equal(isBloodCompatible('B+', 'AB+'), true);

  // O- cannot receive from A+ or B+
  assert.equal(isBloodCompatible('A+', 'O-'), false);
  assert.equal(isBloodCompatible('B+', 'O-'), false);
});

test('calculateUrgencyPriority classifies chest pain as Emergency', () => {
  const result = calculateUrgencyPriority('Sudden severe chest pain radiating to left arm', 'Severe', 1);
  assert.equal(result, 'Emergency');
});

test('calculateUrgencyPriority classifies persistent lump as Prompt', () => {
  const result = calculateUrgencyPriority('Painless neck lump noticed recently', 'Moderate', 25);
  assert.equal(result, 'Prompt');
});

test('generateSecureShareToken produces valid token and expiry', () => {
  const { token, expiryIso } = generateSecureShareToken('Rahul');
  assert.equal(validateShareToken(token), true);
  assert.ok(token.startsWith('SH-RAHU-'));
  assert.ok(new Date(expiryIso).getTime() > Date.now());
});

test('canTransitionBloodStatus obeys workflow rules', () => {
  assert.equal(canTransitionBloodStatus('Submitted', 'Awaiting Provider Confirmation'), true);
  assert.equal(canTransitionBloodStatus('Awaiting Provider Confirmation', 'Confirmed by Provider'), true);
  assert.equal(canTransitionBloodStatus('Closed', 'Submitted'), false);
});

test('isValidIndianPhone validates 10-digit Indian numbers', () => {
  assert.equal(isValidIndianPhone('9876543210'), true);
  assert.equal(isValidIndianPhone('+91 98765 43210'), true);
  assert.equal(isValidIndianPhone('12345'), false);
  assert.equal(isValidIndianPhone('2876543210'), false); // starts with 2
});

test('calculateDistanceKm computes distance accurately and handles missing coordinates', () => {
  // Distance between DMCH Benta (26.1485, 85.8942) and Tower Chowk Darbhanga (26.1578, 85.8995)
  // ~1.2 km in straight line
  const d1 = calculateDistanceKm(26.1485, 85.8942, 26.1578, 85.8995);
  assert.ok(d1 !== null && d1 >= 1.0 && d1 <= 1.5, `Expected ~1.2km, got ${d1}`);

  // Same coordinates should yield 0
  const d2 = calculateDistanceKm(26.1485, 85.8942, 26.1485, 85.8942);
  assert.equal(d2, 0);

  // Missing or NaN coordinates should return null (preventing false distance displays)
  assert.equal(calculateDistanceKm(undefined, 85.89, 26.15, 85.90), null);
  assert.equal(calculateDistanceKm(26.15, 85.89, undefined, undefined), null);
});

test('maskPhoneNumber shields donor private numbers from requesters', () => {
  const masked1 = maskPhoneNumber('+91 98765 43210');
  assert.ok(masked1.includes('•••'), 'Must mask middle digits');
  assert.ok(masked1.endsWith('210'), 'May reveal last digits for recognition');
  assert.equal(masked1.includes('7654'), false, 'Must not leak entire private number');

  const masked2 = maskPhoneNumber('9431812345');
  assert.ok(masked2.includes('•••'));
  assert.equal(masked2.includes('1812'), false);
});

test('maskPreciseCoordinates rounds coordinates to protect residential privacy', () => {
  const result = maskPreciseCoordinates(26.1485291, 85.8942183);
  assert.equal(result.approxLat, 26.15);
  assert.equal(result.approxLon, 85.89);
});

test('formatApproximateArea returns clean privacy-preserving string', () => {
  assert.equal(formatApproximateArea('Darbhanga', 'Bihar'), 'Darbhanga, Bihar');
  assert.equal(
    formatApproximateArea('Darbhanga', 'Bihar', 'Benta'),
    'Benta, Darbhanga, Bihar'
  );
});

test('isDonorContactable enforces separate opt-in consent rule', () => {
  assert.equal(isDonorContactable({ optedIn: true }), true);
  assert.equal(isDonorContactable({ optedIn: false }), false);
  assert.equal(isDonorContactable({}), false);
});

test('calculateAdherenceRate calculates correct percentage for medicine reminders', () => {
  const dummyReminders: any[] = [
    { id: '1', type: 'medicine', status: 'taken' },
    { id: '2', type: 'medicine', status: 'pending' },
    { id: '3', type: 'appointment', status: 'pending' },
  ];
  // 1 out of 2 medicines taken = 50%
  assert.equal(calculateAdherenceRate(dummyReminders), 50);

  const allTaken: any[] = [
    { id: '1', type: 'medicine', status: 'taken' },
    { id: '2', type: 'medicine', status: 'taken' },
  ];
  assert.equal(calculateAdherenceRate(allTaken), 100);

  const noneScheduled: any[] = [];
  assert.equal(calculateAdherenceRate(noneScheduled), 100);
});

test('formatTimeDisplay formats 24h and AM/PM strings cleanly', () => {
  assert.equal(formatTimeDisplay('08:30'), '08:30 AM');
  assert.equal(formatTimeDisplay('20:15'), '08:15 PM');
  assert.equal(formatTimeDisplay('08:30 AM'), '08:30 AM');
  assert.equal(formatTimeDisplay('12:00'), '12:00 PM');
});


