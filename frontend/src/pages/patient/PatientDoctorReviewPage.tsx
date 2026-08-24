import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Stethoscope, CheckCircle2, Clock, FileText, UserCheck, AlertCircle, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const PatientDoctorReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { caseSummary } = useCase();

  const status = caseSummary?.status || 'submitted';
  const isVerified = status === 'verified';
  const isSubmitted = status === 'submitted' || isVerified;

  const patient = caseSummary?.patient;
  const caseTaking = caseSummary?.case_taking;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-[#3EAEB1]" />
          Doctor Review & Verification Status
        </h2>
        <p className="text-xs text-slate-600">
          Track clinical review progress and view verification notes from your attending doctor.
        </p>
      </div>

      {/* Main Status Hero Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#D7EAEE]">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-700'
                  : isSubmitted
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isVerified ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Clinical Intake Case #{caseSummary?.id?.slice(0, 8) || '2026-987'}
              </span>
              <h3 className="text-lg font-extrabold text-[#102A43]">
                {isVerified
                  ? 'Case Verified & Approved by Doctor'
                  : isSubmitted
                  ? 'Submitted — Awaiting Doctor Review'
                  : 'Case Intake In Progress'}
              </h3>
            </div>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
              isVerified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isSubmitted
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-600" />
                Pending Verification
              </>
            )}
          </span>
        </div>

        {/* Assigned Doctor Card */}
        <div className="p-4 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D837F] to-[#3EAEB1] text-white flex items-center justify-center font-bold text-sm">
              DS
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#102A43]">Dr. Ananya Sharma, MD</h4>
              <p className="text-xs text-slate-500">
                Cardiology & General Medicine • Central OPD OPD-4
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#1D837F] bg-[#D7EAEE]/50 px-3 py-1 rounded-full border border-[#9CD1CE]">
            Assigned Clinician
          </span>
        </div>
      </Card>

      {/* Clinical Notes & Verification Impression */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#1D837F] flex items-center gap-2 pb-2 border-b border-[#D7EAEE]">
            <UserCheck className="w-4 h-4 text-[#3EAEB1]" />
            Doctor Verification Notes & Instructions
          </h3>

          {isVerified ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-emerald-950">
                <span className="font-bold block text-emerald-900">
                  Doctor Clinical Assessment:
                </span>
                <p className="leading-relaxed">
                  Intake report reviewed. Symptoms of exertion-induced chest discomfort and history evaluated. Blood pressure 130/85 mmHg. Continued current regimen. Patient cleared for OPD physical examination and ECG assessment.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] space-y-1">
                <span className="font-bold text-[#102A43] block">Prescribed Next Steps:</span>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>Proceed to Room 4 OPD Consultation Counter.</li>
                  <li>Present digital intake ticket to OPD staff.</li>
                  <li>Bring latest lab reports for physical verification.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3 bg-[#D7EAEE]/20 rounded-xl border border-dashed border-[#9CD1CE]">
              <Clock className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-[#102A43]">
                  Your case has been submitted for Doctor Review
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Dr. Sharma is currently reviewing your clinical intake summary and uploaded documents. Verification notes will appear here once sign-off is completed.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Right Column: Consultation Ticket & Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-2 pb-2 border-b border-[#D7EAEE]">
              <Calendar className="w-4 h-4 text-[#3EAEB1]" />
              Consultation Ticket
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <span className="font-bold text-[#102A43]">{patient?.full_name || 'Rahul Kumar'}</span>
              </div>

              <div>
                <span className="text-slate-500 block">OPD Unit:</span>
                <span className="font-bold text-[#1D837F]">Central OPD - Room 4</span>
              </div>

              <div>
                <span className="text-slate-500 block">Chief Complaint:</span>
                <span className="font-medium text-[#102A43]">{caseTaking?.chief_complaint || 'Cough and chest discomfort'}</span>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => navigate('/patient/consultation')}
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View Consultation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
