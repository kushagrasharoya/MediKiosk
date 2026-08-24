import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Home,
  Mic,
  FileText,
  Clock,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { role, logout } = useAuth();

  if (!isOpen) return null;

  const isPatient = role === 'patient';

  const patientNavItems = [
    { to: '/patient/dashboard', label: t('nav.home'), icon: Home },
    { to: '/patient/interview', label: t('nav.interview'), icon: Mic },
    { to: '/patient/documents', label: t('nav.documents'), icon: FileText },
    { to: '/patient/timeline', label: t('nav.timeline'), icon: Clock },
    { to: '/patient/summary', label: t('nav.summary'), icon: Sparkles },
    { to: '/patient/doctor-review', label: t('nav.doctorReview'), icon: Stethoscope },
    { to: '/patient/consent', label: t('nav.consent'), icon: ShieldCheck },
    { to: '/patient/settings', label: t('nav.settings'), icon: Settings },
  ];

  const doctorNavItems = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: Home },
    { to: '/doctor/cases', label: 'Patient Queue', icon: FileText },
    { to: '/doctor/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isPatient ? patientNavItems : doctorNavItems;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex flex-col w-72 max-w-full bg-white/95 backdrop-blur-xl border-r border-[#9CD1CE] h-full p-5 z-10 justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#1D837F]">MediKiosk</h1>
                <p className="text-[10px] font-medium text-[#3EAEB1]">{t('app.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] text-white shadow-md'
                        : 'text-[#102A43] hover:bg-[#D7EAEE]/50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#D7EAEE]">
          <button
            onClick={async () => {
              onClose();
              await logout();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
