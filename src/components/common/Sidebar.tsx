import React from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  Droplets,
  Ambulance,
  FileText,
  QrCode,
  HeartHandshake,
  Building2,
  Clock,
  ShieldCheck,
  Settings,
  Sparkles,
  RotateCcw,
  Home,
  Navigation,
  Bell,
} from 'lucide-react';
import { PageId } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from './Logo.tsx';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    currentPage,
    setCurrentPage,
    t,
    userRole,
    setUserRole,
    patient,
    setShowResetConfirmModal,
    bloodRequests,
    ambulanceRequests,
    reminders,
  } = useApp();

  const totalActiveRequests =
    bloodRequests.filter((r) => r.status !== 'Closed').length +
    ambulanceRequests.filter((r) => r.status !== 'Completed in Demo').length;

  const pendingRemindersCount = reminders.filter((r) => r.status === 'pending').length;

  const navItems: { id: PageId; labelKey: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'overview',
      labelKey: t('navOverview'),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'find-care',
      labelKey: t('navFindCare'),
      icon: <Navigation className="w-4 h-4 text-[#0F766E]" />,
      badge: 'Near Me',
    },
    {
      id: 'reminders',
      labelKey: t('navReminders'),
      icon: <Bell className="w-4 h-4 text-amber-500" />,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined,
    },
    {
      id: 'ai-assistant',
      labelKey: t('navAiAssistant'),
      icon: <HeartPulse className="w-4 h-4 text-[#0F766E]" />,
      badge: 'AI',
    },
    {
      id: 'blood',
      labelKey: t('navBlood'),
      icon: <Droplets className="w-4 h-4 text-red-600" />,
    },
    {
      id: 'ambulance',
      labelKey: t('navAmbulance'),
      icon: <Ambulance className="w-4 h-4 text-amber-600" />,
    },
    {
      id: 'documents',
      labelKey: t('navDocuments'),
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      badge: 'AI',
    },
    {
      id: 'qr-profile',
      labelKey: t('navQrProfile'),
      icon: <QrCode className="w-4 h-4 text-teal-600" />,
    },
    {
      id: 'ngo-assistance',
      labelKey: t('navNgo'),
      icon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
    },
    {
      id: 'hospitals',
      labelKey: t('navHospitals'),
      icon: <Building2 className="w-4 h-4 text-slate-700" />,
    },
    {
      id: 'requests',
      labelKey: t('navRequests'),
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      badge: totalActiveRequests > 0 ? totalActiveRequests : undefined,
    },
    {
      id: 'admin',
      labelKey: t('navAdmin'),
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      badge: userRole === 'admin' ? 'Active' : undefined,
    },
    {
      id: 'profile-settings',
      labelKey: t('navProfile'),
      icon: <Settings className="w-4 h-4 text-slate-500" />,
    },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] h-screen sticky top-0 flex flex-col justify-between shrink-0 select-none">
      {/* Top Header & Brand */}
      <div>
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={() => handleNavClick('landing')}
            className="text-left focus:outline-none"
            title="Go to Public Landing Page"
          >
            <Logo size="md" showTagline={true} />
          </button>
        </div>

        {/* Public Landing Link chip */}
        <div className="px-3 pt-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50/70 hover:bg-teal-100/70 text-[#0F766E] text-xs font-semibold border border-teal-200/60 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Public Landing Page</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#0F766E] text-white font-semibold shadow-xs'
                    : 'text-[#172B3A] hover:bg-slate-100 hover:text-[#0F766E]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="truncate">{item.labelKey}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E6F5F2] text-[#0F766E]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Admin Switcher Box */}
      <div className="p-3 border-t border-[#E2E8F0] bg-slate-50/70 space-y-2">
        {/* Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded-full bg-[#123047] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {userRole === 'admin' ? 'AV' : 'RS'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#172B3A] truncate">
                {userRole === 'admin' ? 'Dr. Anand Verma' : patient.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {userRole === 'admin' ? 'DMCH Nodal Desk' : `${patient.age}y • ${patient.bloodGroup} • Darbhanga`}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons: Reset Demo & Switch Role */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={() => {
              const nextRole = userRole === 'patient' ? 'admin' : 'patient';
              setUserRole(nextRole);
              setCurrentPage(nextRole === 'admin' ? 'admin' : 'overview');
            }}
            className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-[11px] font-medium text-slate-700 flex items-center justify-center gap-1 transition-colors"
            title="Toggle between Patient and Admin roles"
          >
            <span>{userRole === 'patient' ? 'Admin View' : 'Patient View'}</span>
          </button>

          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-[11px] font-medium text-amber-700 hover:text-amber-800 flex items-center justify-center gap-1 transition-colors"
            title="Reset demonstration data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
