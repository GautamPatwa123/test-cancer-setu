import {
  LayoutDashboard,
  HeartPulse,
  Droplets,
  Ambulance,
  Menu,
  Navigation,
  Bell,
} from 'lucide-react';
import { PageId } from '../../types/index.ts';
import { useApp } from '../../context/AppContext.tsx';

interface MobileNavProps {
  onOpenSidebar: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenSidebar }) => {
  const { currentPage, setCurrentPage, reminders } = useApp();
  const pendingCount = reminders.filter((r) => r.status === 'pending').length;

  const items: { id: PageId; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'find-care', label: 'Find Care', icon: <Navigation className="w-5 h-5" /> },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </div>
      ),
    },
    { id: 'blood', label: 'Blood', icon: <Droplets className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-3 py-1.5 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
              isActive ? 'text-[#0F766E] font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenSidebar}
        className="flex flex-col items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
        aria-label="More navigation items"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">More</span>
      </button>
    </nav>
  );
};
