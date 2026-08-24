import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stethoscope, User, FileText, CheckCircle2, Clock, ArrowRight, Activity } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { CaseSummary } from '../../types/case';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';

import { Button } from '../../components/common/Button';

import { UserPlus } from 'lucide-react';
import { DoctorAddPatientModal } from '../../components/modals/DoctorAddPatientModal';

export const DoctorDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cases, setCases] = useState<Partial<CaseSummary>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCases = () => {
    setIsLoading(true);
    doctorService.getPendingCases().then((res) => {
      setCases(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const doctorName = user?.name || 'Dr. Sharma';
  const { language } = useLanguage();

  const getDoctorGreeting = () => {
    if (language === 'hi') {
      return `नमस्ते, ${doctorName}`;
    }
    const hour = new Date().getHours();
    let prefix = 'Good morning';
    if (hour >= 12 && hour < 17) {
      prefix = 'Good afternoon';
    } else if (hour >= 17) {
      prefix = 'Good evening';
    }
    return `${prefix}, ${doctorName}`;
  };

  return (
    <div className="space-y-6">
      {/* Clinician Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-[24px] bg-gradient-to-r from-white via-[#F7FBFC] to-[#D7EAEE]/40 border border-[#9CD1CE]/50 shadow-card-soft flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#1D837F] uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-[#3EAEB1]" />
            {t('doctor.portalTitle')}
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[#102A43]">
            {getDoctorGreeting()}
          </h2>

          <p className="text-xs text-slate-600">
            {t('doctor.pendingCasesCount', { count: cases.length })}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            + Add Patient Case
          </Button>

          <Button icon={<FileText className="w-4 h-4" />} onClick={() => navigate('/doctor/cases')}>
            {t('doctor.viewPatientQueue')}
          </Button>
        </div>
      </div>

      <DoctorAddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCases}
      />


      {/* Quick Clinical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">{t('doctor.pendingReviews')}</span>
            <span className="text-2xl font-extrabold text-[#102A43]">{cases.length}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">{t('doctor.verifiedToday')}</span>
            <span className="text-2xl font-extrabold text-[#102A43]">14</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D7EAEE] text-[#1D837F] flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">{t('doctor.consultationsScheduled')}</span>
            <span className="text-2xl font-extrabold text-[#102A43]">8</span>
          </div>
        </Card>
      </div>

      {/* Pending Cases Queue List */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
            <User className="w-5 h-5 text-[#3EAEB1]" />
            {t('doctor.recentCases')}
          </h3>
          <button
            onClick={() => navigate('/doctor/cases')}
            className="text-xs font-bold text-[#1D837F] hover:underline inline-flex items-center gap-1"
          >
            {t('doctor.viewAllQueue')}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#D7EAEE] hover:border-[#3EAEB1] transition-all shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white font-bold flex items-center justify-center text-sm">
                  {c.patient?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#102A43]">{c.patient?.full_name}</h4>
                  <p className="text-xs text-slate-500">
                    {c.patient?.sex}, {c.patient?.dob} • {t('summary.chiefComplaint')}: {c.case_taking?.chief_complaint}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {t('doctor.submitted')}
                </span>
                <Button size="sm" onClick={() => navigate(`/doctor/cases/${c.id}/review`)}>
                  {t('doctor.reviewCase')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
