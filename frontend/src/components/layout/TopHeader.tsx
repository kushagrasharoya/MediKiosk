import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Globe, Volume2, VolumeX, User as UserIcon, CheckCircle2, Menu, MoreVertical, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface TopHeaderProps {
  onOpenMobileNav: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileNav }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const { isSpeaking, speak, stop } = useSpeechSynthesis();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  const handleToggleAudioHelp = () => {
    if (isSpeaking) {
      stop();
    } else {
      const isDoctor = role === 'doctor';
      const pageInstructions = isDoctor
        ? t('header.audioHelpDoctor')
        : t('header.audioHelpPatient');
      speak(pageInstructions, language);
    }
  };


  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 bg-white/60 backdrop-blur-md border-b border-[#9CD1CE]/30">
      {/* Left / Mobile menu trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-[#102A43] hover:bg-[#D7EAEE]/60 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Language selector */}
        <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#9CD1CE]/50 shadow-sm text-xs font-medium text-[#102A43]">
          <Globe className="w-4 h-4 text-[#3EAEB1]" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-transparent border-none outline-none font-medium cursor-pointer text-[#102A43]"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        {/* Audio Help */}
        <button
          onClick={handleToggleAudioHelp}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            isSpeaking
              ? 'bg-[#3EAEB1] text-white border-[#3EAEB1] animate-pulse'
              : 'bg-white/90 text-[#1D837F] border-[#9CD1CE]/50 hover:bg-[#D7EAEE]/40'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#3EAEB1]" />}
          <span>{isSpeaking ? t('header.stopAudio') : t('header.audioHelp')}</span>
        </button>
      </div>

      {/* User Info Pill - Top Right */}
      <div className="relative">
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-[#9CD1CE]/50 shadow-card-soft cursor-pointer hover:border-[#3EAEB1] transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#61BACA] to-[#3EAEB1] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name ? user.name.charAt(0) : <UserIcon className="w-5 h-5" />}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#102A43] leading-tight">
              {user?.name || 'Rahul Kumar'}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {user?.dob ? '52 Y / Male' : 'Patient'}
              {user?.abhaId && <span className="ml-1 text-[#1D837F]">• {user.abhaId}</span>}
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t('header.verified')}
          </span>
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </div>

        {/* User Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl border border-[#9CD1CE]/60 shadow-xl py-2 z-50">
            <div className="px-4 py-2 border-b border-[#D7EAEE]">
              <p className="text-xs font-bold text-[#102A43]">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                navigate(role === 'patient' ? '/patient/profile' : '/doctor/settings');
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-[#102A43] hover:bg-[#D7EAEE]/50 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-[#3EAEB1]" />
              <span>Profile & Details</span>
            </button>
            <button
              onClick={() => {
                setShowProfileMenu(false);
                navigate(role === 'patient' ? '/patient/settings' : '/doctor/settings');
              }}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-[#102A43] hover:bg-[#D7EAEE]/50 transition-colors"
            >
              <SettingsIcon className="w-4 h-4 text-[#3EAEB1]" />
              <span>Settings</span>
            </button>
            <div className="border-t border-[#D7EAEE] mt-1 pt-1">
              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  await logout();
                  navigate('/login');
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
