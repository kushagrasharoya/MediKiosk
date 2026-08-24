import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const PatientConsentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseSummary, updateConsent } = useCase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localGranted, setLocalGranted] = useState<boolean | null>(null);

  const activeConsent = caseSummary?.consents?.find(c => c.consent_type === 'clinical_intake') || caseSummary?.consents?.[0];
  const isGranted = localGranted !== null ? localGranted : (activeConsent ? activeConsent.granted : true);

  useEffect(() => {
    if (activeConsent) {
      setLocalGranted(activeConsent.granted);
    }
  }, [activeConsent]);

  const handleGrantConsent = async (grantedValue: boolean) => {
    setIsSubmitting(true);
    setSuccess(false);
    setLocalGranted(grantedValue);
    try {
      await updateConsent({
        consent_type: 'clinical_intake',
        granted: grantedValue,
        method: 'digital',
      });
      setSuccess(true);
    } catch (e: any) {
      console.error('Failed to update consent:', e);
      setLocalGranted(!grantedValue); // revert on failure
      alert(`Could not update consent: ${e.response?.data?.detail || e.message || 'Server error'}`);
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
        <span className="text-xs font-semibold text-slate-500">Patient Consent & Data Privacy</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#3EAEB1]" />
          Consent & Information Sharing Agreement
        </h2>
        <p className="text-xs text-slate-600">
          Please review how your medical information is collected, processed by AI, and shared with consulting clinicians.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Consent preference updated successfully on backend database.</span>
        </div>
      )}

      <Card className="p-8 space-y-6">
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            isGranted
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-amber-50/50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                isGranted ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            >
              {isGranted ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#102A43]">
                Clinical Intake Consent Status: {isGranted ? 'GRANTED' : 'REVOKED'}
              </h4>
              <p className="text-xs text-slate-500">
                Method: Digital Consent • Case ID: {caseSummary?.id || 'Active Draft'}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isGranted
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {isGranted ? '✓ Consent Active' : '⚠ Consent Revoked'}
          </span>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <h4 className="font-bold text-[#1D837F] text-sm">Terms & Conditions of Data Handling</h4>

          <div className="p-4 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] space-y-3">
            <div>
              <span className="font-bold text-[#102A43] block">1. Clinical Intake & AI Assistance</span>
              <p className="mt-0.5">
                You permit MediKiosk to record your reported symptoms, vitals, and chief complaint, and to organize this information into a structured clinical overview using AI software.
              </p>
            </div>

            <div>
              <span className="font-bold text-[#102A43] block">2. Document Storage & Security</span>
              <p className="mt-0.5">
                Uploaded prescriptions and lab reports are stored securely in dedicated server storage directories. Access is restricted to authorized hospital doctors and medical staff.
              </p>
            </div>

            <div>
              <span className="font-bold text-[#102A43] block">3. Doctor Review & Verification</span>
              <p className="mt-0.5">
                All AI-summarized clinical records are reviewed and verified by a licensed medical practitioner during or before your consultation.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#D7EAEE] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="grant-checkbox"
              checked={isGranted}
              onChange={(e) => handleGrantConsent(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 rounded text-[#1D837F] focus:ring-[#3EAEB1] cursor-pointer"
            />
            <label htmlFor="grant-checkbox" className="text-xs font-bold text-[#102A43] cursor-pointer">
              I understand and grant full consent for clinical data collection and doctor access.
            </label>
          </div>

          <Button
            onClick={() => handleGrantConsent(!isGranted)}
            isLoading={isSubmitting}
            className={isGranted ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' : ''}
            variant={isGranted ? 'ghost' : 'primary'}
          >
            {isGranted ? 'Revoke Consent' : 'Grant Digital Consent'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
