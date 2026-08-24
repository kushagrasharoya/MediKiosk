import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, FlaskConical, FileCheck, Plus, ExternalLink } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const RecentDocumentsCard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseSummary } = useCase();

  const documents = caseSummary?.documents || [];

  const getDocIcon = (filename: string) => {
    const lower = filename.toLowerCase();
    if (lower.includes('lab') || lower.includes('report')) {
      return <FlaskConical className="w-4 h-4 text-[#3EAEB1]" />;
    }
    if (lower.includes('discharge') || lower.includes('summary')) {
      return <FileCheck className="w-4 h-4 text-[#1D837F]" />;
    }
    return <FileText className="w-4 h-4 text-[#61BACA]" />;
  };

  return (
    <Card className="flex flex-col justify-between h-full space-y-4">


      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3EAEB1]" />
            {t('documents.title')}
          </h3>
          <button
            onClick={() => navigate('/patient/documents')}
            className="text-xs font-semibold text-[#1D837F] hover:text-[#3EAEB1] inline-flex items-center gap-1"
          >
            {t('documents.seeAll')}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-6 px-4 bg-[#D7EAEE]/20 rounded-xl border border-dashed border-[#9CD1CE]">
            <p className="text-xs text-slate-500 font-medium">
              {t('documents.emptyState')}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {documents.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate('/patient/documents')}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D7EAEE] hover:border-[#9CD1CE] transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#D7EAEE]/50 flex items-center justify-center shrink-0">
                    {getDocIcon(doc.filename)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#102A43] truncate">
                      {doc.filename}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(doc.uploaded_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                  {t('documents.uploaded')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={() => navigate('/patient/documents')}
        className="w-full mt-2"
        icon={<Plus className="w-4 h-4" />}
      >
        {t('documents.scanNew')}
      </Button>
    </Card>
  );
};
