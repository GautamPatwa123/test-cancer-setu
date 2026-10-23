import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Sidebar } from './components/common/Sidebar.tsx';
import { MobileNav } from './components/common/MobileNav.tsx';
import { ResetModal } from './components/common/ResetModal.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { PatientOverview } from './components/dashboard/PatientOverview.tsx';
import { AiHealthAssistant } from './components/modules/AiHealthAssistant.tsx';
import { BloodAvailability } from './components/modules/BloodAvailability.tsx';
import { AmbulanceLocator } from './components/modules/AmbulanceLocator.tsx';
import { MedicalDocuments } from './components/modules/MedicalDocuments.tsx';
import { QrHealthProfile } from './components/modules/QrHealthProfile.tsx';
import { NgoAssistance } from './components/modules/NgoAssistance.tsx';
import { HospitalsInsurance } from './components/modules/HospitalsInsurance.tsx';
import { MyRequests } from './components/modules/MyRequests.tsx';
import { AdminDashboard } from './components/modules/AdminDashboard.tsx';
import { UserProfileSettings } from './components/modules/UserProfileSettings.tsx';
import { PublicProfileViewer } from './components/modules/PublicProfileViewer.tsx';
import { FindCareNearMe } from './components/modules/FindCareNearMe.tsx';
import { RemindersModule } from './components/modules/RemindersModule.tsx';

function AppContent() {
  const { currentPage, setCurrentPage } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [scannedToken, setScannedToken] = useState<string | null>(null);

  // Check URL parameters for ?token=... or ?autostart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setScannedToken(token);
    } else if (params.get('autostart') === '1') {
      setCurrentPage('overview');
    }
  }, [setCurrentPage]);

  // If a QR token is in URL, render public emergency profile
  if (scannedToken) {
    return (
      <PublicProfileViewer
        token={scannedToken}
        onExit={() => {
          setScannedToken(null);
          window.history.replaceState({}, '', window.location.pathname);
          setCurrentPage('overview');
        }}
      />
    );
  }

  // Public Landing Page view
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage />
        <ResetModal />
      </>
    );
  }

  // Main Dashboard Applet Shell
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#172B3A] flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Desktop Sidebar (approx 250px wide) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-xs bg-white h-full shadow-2xl flex flex-col">
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
          <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {currentPage === 'overview' && <PatientOverview />}
            {currentPage === 'find-care' && <FindCareNearMe />}
            {currentPage === 'reminders' && <RemindersModule />}
            {currentPage === 'ai-assistant' && <AiHealthAssistant />}
            {currentPage === 'blood' && <BloodAvailability />}
            {currentPage === 'ambulance' && <AmbulanceLocator />}
            {currentPage === 'documents' && <MedicalDocuments />}
            {currentPage === 'qr-profile' && <QrHealthProfile />}
            {currentPage === 'ngo-assistance' && <NgoAssistance />}
            {currentPage === 'hospitals' && <HospitalsInsurance />}
            {currentPage === 'requests' && <MyRequests />}
            {currentPage === 'admin' && <AdminDashboard />}
            {currentPage === 'profile-settings' && <UserProfileSettings />}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenSidebar={() => setMobileSidebarOpen(true)} />

      {/* Global Confirmation Modal */}
      <ResetModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
