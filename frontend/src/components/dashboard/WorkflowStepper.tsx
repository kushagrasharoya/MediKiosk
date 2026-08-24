import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mic, FileUp, Sparkles, Stethoscope, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCase } from '../../context/CaseContext';

export const WorkflowStepper: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseSummary } = useCase();

  // Determine current workflow step status dynamically
  const isInterviewDone = Boolean(caseSummary?.case_taking?.chief_complaint);
  const isDocsUploaded = Boolean(caseSummary?.documents && caseSummary.documents.length > 0);
  const isSubmitted = caseSummary?.status === 'submitted' || caseSummary?.status === 'verified';
  const isVerified = caseSummary?.status === 'verified';

  const steps = [
    {
      id: 1,
      title: t('workflow.step1Title'),
      desc: t('workflow.step1Desc'),
      icon: Mic,
      status: isInterviewDone ? 'completed' : 'current',
      route: '/patient/interview',
    },
    {
      id: 2,
      title: t('workflow.step2Title'),
      desc: t('workflow.step2Desc'),
      icon: FileUp,
      status: isDocsUploaded ? 'completed' : (isInterviewDone ? 'current' : 'pending'),
      route: '/patient/documents',
    },
    {
      id: 3,
      title: t('workflow.step3Title'),
      desc: t('workflow.step3Desc'),
      icon: Sparkles,
      status: isSubmitted ? 'completed' : (isDocsUploaded ? 'current' : 'pending'),
      route: '/patient/summary',
    },
    {
      id: 4,
      title: t('workflow.step4Title'),
      desc: t('workflow.step4Desc'),
      icon: Stethoscope,
      status: isVerified ? 'completed' : (isSubmitted ? 'current' : 'pending'),
      route: '/patient/doctor-review',
    },
    {
      id: 5,
      title: t('workflow.step5Title'),
      desc: t('workflow.step5Desc'),
      icon: CheckCircle2,
      status: isVerified ? 'current' : 'pending',
      route: '/patient/consultation',
    },
  ];

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-3 min-w-[760px]">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => navigate(step.route)}
                className={`flex-1 flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100/60'
                    : isCurrent
                    ? 'bg-gradient-to-r from-white to-[#D7EAEE]/40 border-[#3EAEB1] text-[#1D837F] shadow-card-soft ring-2 ring-[#3EAEB1]/20 font-medium'
                    : 'bg-white/60 border-[#D7EAEE] text-slate-400 hover:border-[#9CD1CE]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white shadow-sm'
                      : 'bg-[#D7EAEE] text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold truncate leading-tight">
                    {step.title}
                  </div>
                  <div className="text-[10px] truncate text-slate-500 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
