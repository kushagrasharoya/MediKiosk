import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
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
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-white/70 backdrop-blur-xl border-r border-[#9CD1CE]/40 min-h-screen p-5 justify-between select-none shadow-sm">
        <div className="space-y-6">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] flex items-center justify-center text-white shadow-md shadow-[#3EAEB1]/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1D837F] leading-none">
                MediKiosk
              </h1>
              <p className="text-[11px] font-medium text-[#3EAEB1] mt-1">
                {t('app.subtitle')}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] text-white shadow-md shadow-[#3EAEB1]/20 font-semibold'
                        : 'text-[#102A43] hover:bg-[#D7EAEE]/50 hover:text-[#1D837F]'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="pt-4 border-t border-[#D7EAEE]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to log out of MediKiosk? Your active session will be ended securely.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
