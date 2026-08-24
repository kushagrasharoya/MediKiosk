import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldCheck, ArrowLeft, Send, FileText } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const PatientSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseSummary, submitCase, updateIdentification, updateConsent } = useCase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const patient = caseSummary?.patient;
  const caseTaking = caseSummary?.case_taking;
  const documents = caseSummary?.documents || [];
  const isAlreadySubmitted = caseSummary?.status === 'submitted' || caseSummary?.status === 'verified';

  const handleSubmitCase = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (!caseSummary?.patient?.full_name) {
        await updateIdentification({
          full_name: 'Rahul Kumar',
          dob: '1974-05-14',
          sex: 'male',
          phone: '+91 98765 43210',
          gov_id_type: 'Aadhaar',
          gov_id_ref: '**** **** 1234',
        });
      }
      if (!caseSummary?.consents || caseSummary.consents.length === 0 || !caseSummary.consents.some(c => c.granted)) {
        await updateConsent({
          consent_type: 'clinical_intake',
          granted: true,
          method: 'digital',
        });
      }
      await submitCase();
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit case.');
    } finally {
      setIsSubmitting(false);
    }

  };


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
        <span className="text-xs font-semibold text-slate-500">Clinical Intake Summary</span>
      </div>

      {/* Hero Badge & Disclaimer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-white via-[#F7FBFC] to-[#D7EAEE]/40 border border-[#9CD1CE]/60 shadow-card-soft space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-extrabold text-[#1D837F] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#3EAEB1]" />
            AI Clinical Intake Summary
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            AI Generated Summary
          </span>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            This summary is generated from your clinical interview and uploaded documents. It requires final review and verification by a licensed doctor.
          </span>
        </div>
      </div>

      {/* Submission Success Alert */}
      {(submitSuccess || isAlreadySubmitted) && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-emerald-950">Case Submitted Successfully</h4>
              <p>Your clinical intake record is ready for doctor review and consultation.</p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/patient/consultation')}>
            View Consultation Details
          </Button>
        </div>
      )}

      {/* Submission Error Alert */}
      {submitError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {submitError}
        </div>
      )}

      {/* Structured Clinical Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Identification Card */}
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#1D837F] pb-2 border-b border-[#D7EAEE]">
            Patient Identification
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Full Name:</span>
              <span className="font-bold text-[#102A43]">{patient?.full_name || 'Rahul Kumar'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Gender / DOB:</span>
              <span className="font-bold text-[#102A43]">
                {patient?.sex || 'Male'}, {patient?.dob || '1974-05-14'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Contact Phone:</span>
              <span className="font-bold text-[#102A43]">{patient?.phone || '+91 98765 43210'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Government ID:</span>
              <span className="font-bold text-[#102A43]">
                {patient?.gov_id_type || 'Aadhaar'}: {patient?.gov_id_ref || '**** 1234'}
              </span>
            </div>
          </div>
        </Card>

        {/* Symptoms & Vitals Card */}
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#1D837F] pb-2 border-b border-[#D7EAEE]">
            Vitals & Reported Symptoms
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-[#D7EAEE]/30 text-center">
              <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
              <span className="font-bold text-[#102A43]">130/85 mmHg</span>
            </div>
            <div className="p-2 rounded-xl bg-[#D7EAEE]/30 text-center">
              <span className="text-[10px] text-slate-500 block">Pulse Rate</span>
              <span className="font-bold text-[#102A43]">82 bpm</span>
            </div>
            <div className="p-2 rounded-xl bg-[#D7EAEE]/30 text-center">
              <span className="text-[10px] text-slate-500 block">SpO2 Oxygen</span>
              <span className="font-bold text-[#102A43]">98%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Case-Taking Clinical Information */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#1D837F] pb-2 border-b border-[#D7EAEE]">
          Clinical Intake History
        </h3>

        <div className="space-y-4 text-xs text-[#102A43]">
          <div>
            <h4 className="font-bold text-[#1D837F] uppercase tracking-wider text-[11px] mb-1">
              Chief Complaint
            </h4>
            <p className="p-3 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] font-medium leading-relaxed">
              {caseTaking?.chief_complaint || 'Chest tightness and shortness of breath during exertion for 3 days.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1D837F] uppercase tracking-wider text-[11px] mb-1">
              History of Present Illness (HPI)
            </h4>
            <p className="p-3 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] leading-relaxed text-slate-700">
              {caseTaking?.history || 'Pain started on Monday morning, was mild initially, increases during physical exertion like walking or stairs. Relief on resting.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1D837F] uppercase tracking-wider text-[11px] mb-1">
              Current Medications
            </h4>
            <p className="p-3 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] font-medium text-slate-800">
              Amlodipine 5mg once daily for hypertension (5 years), Metformin 500mg.
            </p>
          </div>
        </div>
      </Card>

      {/* Uploaded Documents List */}
      <Card className="p-6 space-y-3">
        <h3 className="text-sm font-bold text-[#1D837F] pb-2 border-b border-[#D7EAEE]">
          Attached Medical Records ({documents.length})
        </h3>
        {documents.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">No documents attached.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#D7EAEE] text-xs">
                <FileText className="w-4 h-4 text-[#3EAEB1]" />
                <span className="font-medium text-[#102A43] truncate">{doc.filename}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => navigate('/patient/documents')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Documents
        </Button>
        {!isAlreadySubmitted && (
          <Button
            onClick={handleSubmitCase}
            isLoading={isSubmitting}
            icon={<Send className="w-4 h-4" />}
          >
            Submit Case to Doctor
          </Button>
        )}
      </div>
    </div>
  );
};
