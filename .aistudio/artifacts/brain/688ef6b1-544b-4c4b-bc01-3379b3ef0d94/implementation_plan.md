# Reminders Module: Medicine Intake & Appointment Notifications

An integrated healthcare schedule and adherence reminder engine for the **SehatSetu Healthcare Access Platform**, empowering patients and caregivers to schedule medicine dosage timings and doctor appointment alerts with one-click intake verification, Web Audio chime alerts, and browser notifications.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design choices were confirmed by the user during the Phase 1 clarification interview:
> - **Reminder Types**: Supports both **Medicine Dosage** (daily/routine intake tracking) and **Doctor Appointments** (hospital visits, diagnostic tests).
> - **Patient Overview Dashboard Placement**: A dedicated, prominent **"Today's Healthcare Schedule"** card featuring one-click "Mark as Taken" action buttons and countdown badges.
> - **Notification Style**: **Browser Web Notifications API** paired with an in-app gentle two-tone chime synthesizer (using the HTML5 Web Audio API) and visual toast fallback.

---

## 1. Overview & Core Concept

### What It Does
The Reminders module gives patients in Tier 2/3 cities (like Darbhanga, Bihar) a frictionless schedule manager to track daily medicine regimens (such as blood pressure tablets, diabetes insulin, or oncology supplements) and hospital OPD appointments (like follow-ups at DMCH or local clinics).

### Target Audience & Persona
- **Patients & Family Caregivers** managing chronic illnesses (e.g., hypertension, diabetes, post-operative recovery).
- **Rural Attendants** who need simple, high-visibility schedule cards with clear time indicators without confusing settings menus.

### Key Value Delivered
- **Zero Missed Doses**: High-contrast, single-click "Taken" buttons directly on the primary dashboard.
- **Appointment Preparedness**: Displays hospital department, room number, doctor name, and date countdown.
- **Multimodal Alerts**: Browser notification popups, gentle synthesized audio chimes, and in-app visual alert cards.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Patient Overview Dashboard Glance**:
   - The user opens the home dashboard and immediately sees the **"Today's Healthcare Schedule"** panel.
   - Pending medication doses display medicine name, dosage (e.g., "5mg after breakfast"), and scheduled time.
   - Clicking **"Mark as Taken"** immediately marks the dose complete, updates adherence percentage, and silences pending alarms.
2. **Upcoming Appointment View**:
   - Scheduled hospital visits show doctor name, department (e.g., "DMCH Medicine OPD Room 12"), date, and notes.
3. **Adding a New Reminder**:
   - Clicking **"+ Add Reminder"** opens a modal with a toggle between **Medicine Dose** and **Doctor Appointment**.
   - For medicines: medicine name, dosage instructions (before/after meals), time, frequency (daily, twice daily, weekly).
   - For appointments: doctor/clinic name, hospital location, appointment date/time, and clinical purpose.
4. **Interactive Alerting & Sound Chime**:
   - An interactive "Test Alert & Audio Chime" button lets users test browser notifications and audio chimes safely.
   - When a reminder matures, a native browser notification fires with sound, and an in-app banner notifies the user.

### Visual Identity & Layout Math
- **Aesthetic**: Follows SehatSetu's trusted clinical teal and deep slate palette (`#0F766E` primary, `#123047` dark slate, `#F7FAFC` canvas).
- **Typography**: Clean sans-serif hierarchy using `Plus Jakarta Sans` with `tabular-nums` for timestamps and dosage metrics.
- **Zero-Pill Discipline**: Status labels and dates use clean unboxed text with subtle typographic separators (`·`), avoiding cluttered badge sandwiches.
- **Container Math**: Card padding is 20px (`p-5`), outer margin 24px (`space-y-6`), and button horizontal padding is $2\times$ vertical (`py-2 px-4`).

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Alternatives Considered |
| :--- | :--- | :--- |
| **Audio Notification** | Synthesized Web Audio API (sine/triangle chime) | Zero external MP3 asset dependency; guaranteed to play instantly without network latency or 404 broken asset failures. |
| **Notification API** | Web Notifications API with permission request flow | Native desktop/mobile OS notifications. Gracefully falls back to in-app banners if user denies browser permission. |
| **Persistence** | `localStorage` via unified `AppContext` | Immediate client-side persistence across sessions, consistent with SehatSetu's offline-tolerant architecture. |
| **Adherence Metric** | Simple weekly completion percentage | Gives patients immediate positive reinforcement without intrusive clinical guilt mechanics. |

---

## 4. Technical Architecture & System Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SehatSetu Application                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Patient Overview Dashboard ]          [ Reminders Module View ]   │
│   ┌─────────────────────────────┐         ┌────────────────────────┐   │
│   │ Today's Schedule Card       │ ◄────── │ Full Schedule Table    │   │
│   │ • Next Medicine (Take Now)  │         │ • Medication Regimen   │   │
│   │ • Upcoming DMCH Visit       │         │ • Clinic Appointments  │   │
│   │ • Adherence Rate Tracker    │         │ • New Reminder Modal   │   │
│   └──────────────┬──────────────┘         └───────────┬────────────┘   │
│                  │                                    │                │
│                  ▼                                    ▼                │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                        AppContext                              │   │
│   │  • reminders state & CRUD actions                              │   │
│   │  • markReminderTaken() / rescheduleReminder()                  │   │
│   │  • playNotificationChime() (Web Audio API Synthesizer)         │   │
│   │  • triggerBrowserNotification()                                │   │
│   │  • localStorage persistence (sehatsetu_data_v2_reminders)      │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Implementation Checklist
1. **Type Definitions (`src/types/index.ts`)**:
   - Add `HealthcareReminder` interface with fields for type (`medicine` | `appointment`), title, dosageOrDoctor, time, date, recurrence, status (`pending` | `taken` | `missed`), and audio preferences.
   - Update `PageId` union to include `'reminders'`.
2. **Data & Utilities (`src/data/mockData.ts` & `src/utils/healthLogic.ts`)**:
   - Provide realistic baseline demo reminders for Rahul Sharma (Amlodipine 5mg morning dose, DMCH Cardiology OPD visit).
   - Add Web Audio API chime helper function (`playNotificationChime()`).
3. **State Management (`src/context/AppContext.tsx`)**:
   - Add reminder CRUD methods (`addReminder`, `updateReminderStatus`, `deleteReminder`).
   - Add browser notification trigger with permission check.
4. **Patient Overview Dashboard (`src/components/dashboard/PatientOverview.tsx`)**:
   - Integrate the **"Today's Healthcare Schedule"** widget with quick-take actions and appointment reminders.
5. **Full Reminders Module (`src/components/modules/RemindersModule.tsx`)**:
   - Complete management interface with tabs, reminder creation modal, notification test button, and adherence stats.
6. **Navigation & Translations (`src/components/common/Sidebar.tsx`, `Header.tsx`, `MobileNav.tsx`, `src/translations/index.ts`)**:
   - Add 'Reminders' to desktop and mobile navigation menus with active count badges and English/Hindi bilingual labels.
