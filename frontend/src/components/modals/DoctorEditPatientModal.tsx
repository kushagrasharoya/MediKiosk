import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Phone, Calendar, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { caseService } from '../../services/caseService';
import { CaseSummary, PatientIdentification, ConsentMethod } from '../../types/case';

interface DoctorEditPatientModalProps {
  caseData: Partial<CaseSummary> | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DoctorEditPatientModal: React.FC<DoctorEditPatientModalProps> = ({
  caseData,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const patient = caseData?.patient;
  const activeConsent = caseData?.consents?.find(c => c.consent_type === 'clinical_intake') || caseData?.consents?.[0];

  const [fullName, setFullName] = useState(patient?.full_name || '');
  const [dob, setDob] = useState(patient?.dob || '1974-05-14');
  const [sex, setSex] = useState<'male' | 'female' | 'other'>(patient?.sex || 'male');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [govIdType, setGovIdType] = useState(patient?.gov_id_type || 'Aadhaar');
  const [govIdRef, setGovIdRef] = useState(patient?.gov_id_ref || '');

  const [consentGranted, setConsentGranted] = useState(activeConsent ? activeConsent.granted : true);
  const [consentMethod, setConsentMethod] = useState<ConsentMethod>(activeConsent?.method || 'verbal');

  useEffect(() => {
    if (caseData?.patient) {
      setFullName(caseData.patient.full_name || '');
      setDob(caseData.patient.dob || '1974-05-14');
      setSex(caseData.patient.sex || 'male');
      setPhone(caseData.patient.phone || '');
      setGovIdType(caseData.patient.gov_id_type || 'Aadhaar');
      setGovIdRef(caseData.patient.gov_id_ref || '');
    }
    if (activeConsent) {
      setConsentGranted(activeConsent.granted);
      setConsentMethod(activeConsent.method || 'verbal');
    }
  }, [caseData, activeConsent]);

  if (!caseData || !caseData.id) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorAlert(null);

    try {
      // 1. Update Patient Identification
      const identPayload: PatientIdentification = {
        full_name: fullName,
        dob,
        sex,
        phone,
        gov_id_type: govIdType,
        gov_id_ref: govIdRef,
      };
      await caseService.updateIdentification(caseData.id!, identPayload);

      // 2. Update Consent
      await caseService.updateConsent(caseData.id!, {
        consent_type: 'clinical_intake',
        granted: consentGranted,
        method: consentMethod,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorAlert(err.response?.data?.detail || err.message || 'Failed to update patient records.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Patient Information & Consent" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorAlert && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-medium">
            {errorAlert}
          </div>
        )}

        {/* Demographics Section */}
        <div className="p-4 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] space-y-3">
          <h4 className="font-bold text-[#1D837F] text-xs flex items-center gap-1.5 border-b border-[#D7EAEE] pb-1.5">
            <User className="w-4 h-4 text-[#3EAEB1]" />
            Patient Demographics & Identification
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Gender</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] font-semibold text-[#102A43]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Govt ID Type</label>
              <input
                type="text"
                value={govIdType}
                onChange={(e) => setGovIdType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Govt ID Reference</label>
              <input
                type="text"
                value={govIdRef}
                onChange={(e) => setGovIdRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>
          </div>
        </div>

        {/* Consent Override Section */}
        <div className="p-4 rounded-xl bg-[#D7EAEE]/30 border border-[#9CD1CE]/50 space-y-3">
          <h4 className="font-bold text-[#1D837F] text-xs flex items-center gap-1.5 border-b border-[#9CD1CE]/40 pb-1.5">
            <ShieldCheck className="w-4 h-4 text-[#3EAEB1]" />
            Clinical Intake Consent
          </h4>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="doc-consent-check"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="w-4 h-4 rounded text-[#1D837F]"
              />
              <label htmlFor="doc-consent-check" className="font-semibold text-[#102A43] cursor-pointer">
                Consent Granted for Data Processing & Consultation
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Method:</span>
              <select
                value={consentMethod}
                onChange={(e) => setConsentMethod(e.target.value as ConsentMethod)}
                className="px-2.5 py-1 rounded-lg border border-[#9CD1CE] bg-white font-semibold text-[#102A43]"
              >
                <option value="verbal">Verbal Consent</option>
                <option value="digital">Digital Consent</option>
                <option value="written">Written Consent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} icon={<CheckCircle2 className="w-4 h-4" />}>
            Save Patient Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
