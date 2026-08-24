import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Stethoscope, FileText, ArrowLeft, Video } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const PatientConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseSummary } = useCase();

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
        <span className="text-xs font-semibold text-slate-500">Consultation Preparation</span>
      </div>

      <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-white via-[#F7FBFC] to-[#D7EAEE]/40 border-[#9CD1CE]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1D837F]">Consultation Ready!</h2>
          <p className="text-xs text-slate-600">
            Your clinical intake summary and uploaded records have been organized and transmitted to your consulting doctor.
          </p>
        </div>

        {/* Appointment details */}
        <div className="p-6 rounded-2xl bg-white border border-[#D7EAEE] max-w-lg mx-auto text-left space-y-4 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-[#D7EAEE]">
            <div className="w-10 h-10 rounded-xl bg-[#1D837F] text-white flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#102A43]">Dr. Ananya Sharma</h4>
              <p className="text-xs text-[#3EAEB1] font-semibold">Senior Consultant Cardiologist</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Appointment Date & Time:</span>
              <span className="font-bold text-[#102A43] flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#3EAEB1]" />
                28 Aug 2026 • 10:30 AM
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Location / Token:</span>
              <span className="font-bold text-[#102A43]">OPD Room 4 • Token #A-14</span>
            </div>
            <div>
              <span className="text-slate-500 block">Intake Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Submitted ({caseSummary?.documents?.length || 0} docs attached)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">ABHA ID:</span>
              <span className="font-bold text-[#102A43]">abha_9nd8_****_12k3</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate('/patient/summary')}>
            View Submitted Summary
          </Button>
          <Button icon={<Video className="w-4 h-4" />}>
            Start Consultation Session
          </Button>
        </div>
      </Card>
    </div>
  );
};
