import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, User, Stethoscope, Globe, Volume2, ShieldCheck, CheckCircle2, Save, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SupportedLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const DoctorSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [doctorName, setDoctorName] = useState(user?.name || 'Dr. Ananya Sharma');
  const [email, setEmail] = useState(user?.email || 'dr.sharma@medikiosk.health');
  const [specialization, setSpecialization] = useState('Cardiology & Internal Medicine');
  const [regNumber, setRegNumber] = useState('MCI-2014-987654');
  const [opdUnit, setOpdUnit] = useState('MediKiosk Central OPD - Room 4');

  const [autoExpandSummary, setAutoExpandSummary] = useState(true);
  const [notifyNewCases, setNotifyNewCases] = useState(true);
  const [defaultNotesTemplate, setDefaultNotesTemplate] = useState(
    'Patient intake summary reviewed. Clinical history and reported symptoms evaluated. Ready for consultation.'
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#3EAEB1]" />
          {t('doctor.settingsTitle')}
        </h2>
        <p className="text-xs text-slate-600">{t('doctor.settingsSubtitle')}</p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t('doctor.settingsSaved')}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Info Card */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#1D837F] flex items-center gap-2 pb-2 border-b border-[#D7EAEE]">
            <User className="w-4 h-4 text-[#3EAEB1]" />
            {t('doctor.profileSection')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#102A43] block mb-1">
                {t('doctor.doctorName')}
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">
                {t('doctor.medicalEmail')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">
                {t('doctor.specialization')}
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">
                {t('doctor.regNumber')}
              </label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-[#102A43] block mb-1">
                {t('doctor.opdUnit')}
              </label>
              <input
                type="text"
                value={opdUnit}
                onChange={(e) => setOpdUnit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>
          </div>
        </Card>

        {/* Language & Interface Preference */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#1D837F] flex items-center gap-2 pb-2 border-b border-[#D7EAEE]">
            <Globe className="w-4 h-4 text-[#3EAEB1]" />
            Language & Regional Interface
          </h3>

          <div className="flex gap-4">
            <label
              className={`flex-1 p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                language === 'en'
                  ? 'border-[#3EAEB1] bg-[#D7EAEE]/40 font-bold'
                  : 'border-[#D7EAEE] bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="doctor-lang"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="text-[#1D837F]"
                />
                <span className="text-xs text-[#102A43]">English (Default)</span>
              </div>
              <span className="text-xs text-slate-500">EN</span>
            </label>

            <label
              className={`flex-1 p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                language === 'hi'
                  ? 'border-[#3EAEB1] bg-[#D7EAEE]/40 font-bold'
                  : 'border-[#D7EAEE] bg-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="doctor-lang"
                  checked={language === 'hi'}
                  onChange={() => setLanguage('hi')}
                  className="text-[#1D837F]"
                />
                <span className="text-xs text-[#102A43]">हिंदी (Hindi)</span>
              </div>
              <span className="text-xs text-slate-500">HI</span>
            </label>
          </div>
        </Card>

        {/* Clinical Review Preferences */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#1D837F] flex items-center gap-2 pb-2 border-b border-[#D7EAEE]">
            <Stethoscope className="w-4 h-4 text-[#3EAEB1]" />
            {t('doctor.reviewPrefs')}
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#102A43] block">
                  {t('doctor.autoExpand')}
                </span>
                <span className="text-slate-500">
                  Automatically show full HPI and vitals when opening a patient case.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoExpandSummary(!autoExpandSummary)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoExpandSummary ? 'bg-[#1D837F]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoExpandSummary ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#102A43] block">
                  {t('doctor.notifications')}
                </span>
                <span className="text-slate-500">
                  Receive audio alert when a patient submits a new intake case.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotifyNewCases(!notifyNewCases)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifyNewCases ? 'bg-[#1D837F]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifyNewCases ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">
                {t('doctor.defaultTemplate')}
              </label>
              <textarea
                rows={3}
                value={defaultNotesTemplate}
                onChange={(e) => setDefaultNotesTemplate(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] resize-none"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" icon={<Save className="w-4 h-4" />}>
            {t('doctor.savePreferences')}
          </Button>
        </div>
      </form>
    </div>
  );
};
