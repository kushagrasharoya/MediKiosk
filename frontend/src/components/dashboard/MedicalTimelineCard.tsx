import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, FileText, FlaskConical, Stethoscope, ExternalLink } from 'lucide-react';
import { Card } from '../common/Card';

export const MedicalTimelineCard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const timelineEvents = [
    {
      id: '1',
      date: '12 Aug 2026',
      title: t('timeline.prescription'),
      icon: FileText,
      color: 'text-[#3EAEB1]',
      bg: 'bg-[#3EAEB1]',
    },
    {
      id: '2',
      date: '28 Jul 2026',
      title: t('timeline.labReport'),
      icon: FlaskConical,
      color: 'text-[#1D837F]',
      bg: 'bg-[#1D837F]',
    },
    {
      id: '3',
      date: '05 Jun 2026',
      title: t('timeline.discharge'),
      icon: FileText,
      color: 'text-amber-500',
      bg: 'bg-amber-500',
    },
    {
      id: '4',
      date: '20 May 2026',
      title: t('timeline.consultation'),
      icon: Stethoscope,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500',
    },
  ];

  return (
    <Card className="flex flex-col justify-between h-full space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3EAEB1]" />
            {t('timeline.title')}
          </h3>
          <button
            onClick={() => navigate('/patient/timeline')}
            className="text-xs font-semibold text-[#1D837F] hover:text-[#3EAEB1] inline-flex items-center gap-1"
          >
            {t('timeline.viewAll')}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Vertical Timeline List */}
        <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#9CD1CE]/50">
          {timelineEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-4 top-1 w-3 h-3 rounded-full ${event.bg} ring-4 ring-white shrink-0`}
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-[#1D837F]">
                    {event.date}
                  </div>
                  <div className="text-xs font-semibold text-[#102A43] flex items-center gap-1.5 mt-0.5">
                    <Icon className={`w-3.5 h-3.5 ${event.color}`} />
                    <span>{event.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming appointment callout */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#D7EAEE]/60 to-[#9FD8E1]/40 border border-[#9CD1CE]/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#1D837F] uppercase tracking-wider block">
            {t('timeline.upcoming')}
          </span>
          <span className="text-xs font-bold text-[#102A43] flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#3EAEB1]" />
            28 Aug 2026 • 10:30 AM
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
          Confirmed
        </span>
      </div>
    </Card>
  );
};
