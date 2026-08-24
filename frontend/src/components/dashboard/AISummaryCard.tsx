import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const AISummaryCard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseSummary } = useCase();

  const caseTaking = caseSummary?.case_taking;

  return (
    <Card className="flex flex-col justify-between h-full space-y-4">


      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3EAEB1]" />
            {t('summary.title')}
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] px-2.5 py-0.5 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3" />
            {t('summary.aiBadge')}
          </span>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-2 p-2.5 mb-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{t('summary.doctorNotice')}</span>
        </div>

        <div className="space-y-3 text-xs text-[#102A43]">
          <div>
            <span className="font-bold text-[#1D837F] block">
              {t('summary.chiefComplaint')}:
            </span>
            <p className="text-slate-600 line-clamp-2 mt-0.5">
              {caseTaking?.chief_complaint || 'Chest pain and breathlessness during walking for 3 days.'}
            </p>
          </div>

          <div>
            <span className="font-bold text-[#1D837F] block">
              {t('summary.history')}:
            </span>
            <p className="text-slate-600 line-clamp-2 mt-0.5">
              {caseTaking?.history || 'Pain started on Monday, was mild in the morning, increases on exertion.'}
            </p>
          </div>

          <div>
            <span className="font-bold text-[#1D837F] block">
              {t('summary.medications')}:
            </span>
            <p className="text-slate-600 line-clamp-1 mt-0.5 font-medium">
              Amlodipine 5mg once daily, Metformin 500mg
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate('/patient/summary')}
        className="w-full mt-2"
      >
        {t('summary.viewFull')}
      </Button>
    </Card>
  );
};
