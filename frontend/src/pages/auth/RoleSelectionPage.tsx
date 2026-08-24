import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Stethoscope, Activity, ArrowRight } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const RoleSelectionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#D7EAEE] via-[#F7FBFC] to-[#9FD8E1]/30 select-none">
      {/* Brand Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-xl shadow-[#3EAEB1]/30 mb-2">
          <Activity className="w-9 h-9 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1D837F] tracking-tight">
          MediKiosk
        </h1>
        <p className="text-sm font-semibold text-[#3EAEB1]">
          {t('app.subtitle')}
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        <h2 className="text-xl font-bold text-[#102A43] text-center">
          {t('auth.roleSelectionTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Card */}
          <Card
            onClick={() => navigate('/login/patient')}
            className="p-8 cursor-pointer hover:border-[#3EAEB1] hover:scale-[1.02] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D7EAEE] text-[#1D837F] flex items-center justify-center group-hover:bg-[#1D837F] group-hover:text-white transition-colors shadow-sm">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#102A43]">
                {t('auth.patientRole')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('auth.patientDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1D837F] pt-6 group-hover:text-[#3EAEB1]">
              <span>Continue as Patient</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Doctor Card */}
          <Card
            onClick={() => navigate('/login/doctor')}
            className="p-8 cursor-pointer hover:border-[#3EAEB1] hover:scale-[1.02] transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#9FD8E1]/40 text-[#1D837F] flex items-center justify-center group-hover:bg-[#1D837F] group-hover:text-white transition-colors shadow-sm">
                <Stethoscope className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#102A43]">
                {t('auth.doctorRole')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('auth.doctorDesc')}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#1D837F] pt-6 group-hover:text-[#3EAEB1]">
              <span>Continue as Doctor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
