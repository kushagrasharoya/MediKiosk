import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, User, Phone, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { caseService } from '../../services/caseService';

interface DoctorAddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DoctorAddPatientModal: React.FC<DoctorAddPatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('1985-06-15');
  const [sex, setSex] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState('+91 ');
  const [govIdType, setGovIdType] = useState('Aadhaar');
  const [govIdRef, setGovIdRef] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);
    setErrorAlert(null);

    try {
      // 1. Create a new case record on FastAPI backend
      const newCase = await caseService.createCase({ language: 'en' });

      // 2. Set Patient Identification
      await caseService.updateIdentification(newCase.id, {
        full_name: fullName,
        dob,
        sex,
        phone,
        gov_id_type: govIdType,
        gov_id_ref: govIdRef,
      });

      // 3. Set Initial Consent (Verbal)
      await caseService.updateConsent(newCase.id, {
        consent_type: 'clinical_intake',
        granted: true,
        method: 'verbal',
      });

      // 4. Set Initial Case-Taking Complaint if entered
      if (chiefComplaint.trim()) {
        await caseService.updateCaseTaking(newCase.id, {
          chief_complaint: chiefComplaint,
          history: 'Case created directly at doctor desk during OPD consultation.',
        });
      }

      onSuccess();
      onClose();
      // Reset form
      setFullName('');
      setPhone('+91 ');
      setGovIdRef('');
      setChiefComplaint('');
    } catch (err: any) {
      console.error(err);
      setErrorAlert(err.response?.data?.detail || err.message || 'Failed to register new patient case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Patient Case" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorAlert && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-medium">
            {errorAlert}
          </div>
        )}

        <div className="p-4 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] space-y-3">
          <h4 className="font-bold text-[#1D837F] text-xs flex items-center gap-1.5 border-b border-[#D7EAEE] pb-1.5">
            <User className="w-4 h-4 text-[#3EAEB1]" />
            Patient Demographics
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Gender *</label>
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
              <select
                value={govIdType}
                onChange={(e) => setGovIdType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] font-semibold text-[#102A43]"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#102A43] block mb-1">Govt ID Reference</label>
              <input
                type="text"
                placeholder="**** **** 5678"
                value={govIdRef}
                onChange={(e) => setGovIdRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#D7EAEE]/30 border border-[#9CD1CE]/50 space-y-2">
          <label className="font-semibold text-[#102A43] block">Initial Chief Complaint / Symptoms</label>
          <textarea
            rows={2}
            placeholder="e.g. Severe headache, fever for 2 days..."
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} icon={<UserPlus className="w-4 h-4" />}>
            Create Patient Case
          </Button>
        </div>
      </form>
    </Modal>
  );
};
