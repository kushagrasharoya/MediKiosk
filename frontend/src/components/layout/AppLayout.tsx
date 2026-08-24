import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';
import { Shield, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AppLayout: React.FC = () => {
  const { t } = useTranslation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#D7EAEE]/40 via-[#F7FBFC] to-[#D7EAEE]/30">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        {/* Security & ABDM Strip at Bottom */}
        <footer className="py-3 px-6 text-center text-xs text-slate-500 border-t border-[#9CD1CE]/30 bg-white/40 backdrop-blur-xs flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-[#1D837F]">
            <Shield className="w-3.5 h-3.5 text-[#3EAEB1]" />
            {t('app.securityNotice')}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-1 font-medium text-emerald-700">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {t('app.abdmIntegrated')}
          </span>
        </footer>
      </div>
    </div>
  );
};
