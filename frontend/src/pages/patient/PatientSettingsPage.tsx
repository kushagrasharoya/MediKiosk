import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Globe, Volume2, ShieldCheck, ArrowLeft, CheckCircle2, Moon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const PatientSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const {
    audioHelpEnabled,
    setAudioHelpEnabled,
    darkMode,
    setDarkMode,
    reducedMotion,
    setReducedMotion,
    saveSettings,
  } = useSettings();

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSaveSettings = () => {
    saveSettings();
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1D837F] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs font-semibold text-slate-500">System & Visual Settings</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#3EAEB1]" />
          MediKiosk Application Settings
        </h2>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Application settings saved successfully!</span>
        </div>
      )}

      <Card className="p-8 space-y-6">
        {/* Language Selection */}
        <div className="space-y-3 pb-6 border-b border-[#D7EAEE]">
          <h3 className="text-sm font-bold text-[#1D837F] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#3EAEB1]" />
            UI Language Preference
          </h3>
          <div className="flex gap-4">
            <div
              onClick={() => setLanguage('en')}
              className={`flex-1 p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                language === 'en'
                  ? 'border-[#3EAEB1] bg-[#D7EAEE]/40 font-bold shadow-xs'
                  : 'border-[#D7EAEE] bg-white hover:border-[#9CD1CE]'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="lang"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="text-[#1D837F] cursor-pointer"
                />
                <span className="text-xs text-[#102A43]">English (Default)</span>
              </div>
              <span className="text-xs text-slate-500">EN</span>
            </div>

            <div
              onClick={() => setLanguage('hi')}
              className={`flex-1 p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                language === 'hi'
                  ? 'border-[#3EAEB1] bg-[#D7EAEE]/40 font-bold shadow-xs'
                  : 'border-[#D7EAEE] bg-white hover:border-[#9CD1CE]'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="lang"
                  checked={language === 'hi'}
                  onChange={() => setLanguage('hi')}
                  className="text-[#1D837F] cursor-pointer"
                />
                <span className="text-xs text-[#102A43]">हिंदी (Hindi)</span>
              </div>
              <span className="text-xs text-slate-500">HI</span>
            </div>
          </div>
        </div>

        {/* Audio & Text-to-Speech */}
        <div className="space-y-3 pb-6 border-b border-[#D7EAEE]">
          <h3 className="text-sm font-bold text-[#1D837F] flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#3EAEB1]" />
            Audio Assistance & Voice Output
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#102A43] block">Automatic Text-to-Speech Help</span>
              <span className="text-[11px] text-slate-500">Read page instructions aloud when visiting new intake steps.</span>
            </div>
            <button
              type="button"
              onClick={() => setAudioHelpEnabled(!audioHelpEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                audioHelpEnabled ? 'bg-[#1D837F]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  audioHelpEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Preferences</Button>
        </div>

      </Card>
    </div>
  );
};
