import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Check } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const ConsentStatusCard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseSummary, updateConsent } = useCase();
  const [isToggling, setIsToggling] = useState(false);

  const activeConsent = caseSummary?.consents?.find(c => c.consent_type === 'clinical_intake') || caseSummary?.consents?.[0];
  const isGranted = activeConsent ? activeConsent.granted : true;

  const handleToggleConsent = async () => {
    setIsToggling(true);
    try {
      await updateConsent({
        consent_type: 'clinical_intake',
        granted: !isGranted,
        method: 'digital',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-10 h-10 rounded-2xl bg-[#D7EAEE] text-[#1D837F] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#102A43]">{t('consent.title')}</h3>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isGranted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isGranted ? <Check className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
              {isGranted ? t('consent.granted') : t('consent.notGranted')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{t('consent.desc')}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-[#102A43]">
            Allow doctor consultation access
          </span>
          <button
            onClick={handleToggleConsent}
            disabled={isToggling}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isGranted ? 'bg-[#1D837F]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isGranted ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/patient/consent')}
          className="text-xs shrink-0"
        >
          {t('consent.manage')}
        </Button>
      </div>
    </Card>
  );
};

