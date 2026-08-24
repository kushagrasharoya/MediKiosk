import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, FlaskConical, Stethoscope, Calendar, ArrowLeft, Filter } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const PatientTimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');

  const timelineEvents = [
    {
      id: '1',
      date: '12 Aug 2026',
      title: 'Prescription Added',
      category: 'prescription',
      desc: 'Cardiology consultation prescription uploaded (Amlodipine 5mg)',
      icon: FileText,
      color: 'text-[#3EAEB1]',
      badge: 'Prescription',
    },
    {
      id: '2',
      date: '28 Jul 2026',
      title: 'Lab Report Uploaded',
      category: 'lab',
      desc: 'Complete Blood Count (CBC) & Lipid Profile report',
      icon: FlaskConical,
      color: 'text-[#1D837F]',
      badge: 'Lab Report',
    },
    {
      id: '3',
      date: '05 Jun 2026',
      title: 'Discharge Summary Added',
      category: 'discharge',
      desc: 'Hospital discharge summary post acute observation',
      icon: FileText,
      color: 'text-amber-500',
      badge: 'Discharge',
    },
    {
      id: '4',
      date: '20 May 2026',
      title: 'Previous Consultation',
      category: 'consultation',
      desc: 'Routine outpatient consultation with Dr. Sharma',
      icon: Stethoscope,
      color: 'text-emerald-500',
      badge: 'Consultation',
    },
  ];

  const filteredEvents = filter === 'all' ? timelineEvents : timelineEvents.filter(e => e.category === filter);

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
        <span className="text-xs font-semibold text-slate-500">Medical Timeline</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#3EAEB1]" />
          Patient Medical History Timeline
        </h2>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#9CD1CE]/50 shadow-xs text-xs font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all ${filter === 'all' ? 'bg-[#1D837F] text-white' : 'text-slate-600 hover:bg-[#D7EAEE]'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('prescription')}
            className={`px-3 py-1 rounded-lg transition-all ${filter === 'prescription' ? 'bg-[#1D837F] text-white' : 'text-slate-600 hover:bg-[#D7EAEE]'}`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => setFilter('lab')}
            className={`px-3 py-1 rounded-lg transition-all ${filter === 'lab' ? 'bg-[#1D837F] text-white' : 'text-slate-600 hover:bg-[#D7EAEE]'}`}
          >
            Labs
          </button>
        </div>
      </div>

      {/* Upcoming Appointment */}
      <Card className="p-4 bg-gradient-to-r from-white via-[#F7FBFC] to-[#D7EAEE]/40 border-l-4 border-l-[#1D837F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D837F] text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#1D837F] uppercase tracking-wider block">Upcoming Consultation</span>
              <h4 className="text-sm font-bold text-[#102A43]">Cardiology Consultation with Dr. Ananya Sharma</h4>
              <p className="text-xs text-slate-500">28 Aug 2026 • 10:30 AM • OPD Room 4</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Confirmed
          </span>
        </div>
      </Card>

      {/* Vertical Timeline Card */}
      <Card className="p-8">
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#9CD1CE]">
          {filteredEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative flex items-start gap-4">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#1D837F] ring-4 ring-white flex items-center justify-center text-white text-[10px] shrink-0">
                  •
                </div>
                <div className="flex-1 p-4 rounded-xl bg-white border border-[#D7EAEE] shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1D837F]">{event.date}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {event.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${event.color}`} />
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-600">{event.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
