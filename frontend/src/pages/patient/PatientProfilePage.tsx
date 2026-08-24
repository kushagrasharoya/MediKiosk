import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const PatientProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { caseSummary, updateIdentification } = useCase();

  const patient = caseSummary?.patient;

  const [fullName, setFullName] = useState(patient?.full_name || user?.name || 'Rahul Kumar');
  const [dob, setDob] = useState(patient?.dob || '1974-05-14');
  const [sex, setSex] = useState<'male' | 'female' | 'other'>(patient?.sex || 'male');
  const [phone, setPhone] = useState(patient?.phone || '+91 98765 43210');
  const [govIdType, setGovIdType] = useState(patient?.gov_id_type || 'Aadhaar');
  const [govIdRef, setGovIdRef] = useState(patient?.gov_id_ref || '**** **** 1234');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      await updateIdentification({
        full_name: fullName,
        dob,
        sex,
        phone,
        gov_id_type: govIdType,
        gov_id_ref: govIdRef,
      });
      setSaveSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update patient identification');
    } finally {
      setIsSaving(false);
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
        <span className="text-xs font-semibold text-slate-500">Patient Identification & Profile</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
          <User className="w-6 h-6 text-[#3EAEB1]" />
          Patient Demographic Profile
        </h2>
        <p className="text-xs text-slate-600">
          Manage your personal identification details sent to consulting clinicians.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Patient identification updated successfully on FastAPI backend!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {error}
        </div>
      )}

      <Card className="p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Full Name (as per ID)
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Biological Sex
              </label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Government ID Type
              </label>
              <input
                type="text"
                value={govIdType}
                onChange={(e) => setGovIdType(e.target.value)}
                placeholder="Aadhaar / PAN / Passport"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#102A43] block mb-1">
                Government ID Reference Number
              </label>
              <input
                type="text"
                value={govIdRef}
                onChange={(e) => setGovIdRef(e.target.value)}
                placeholder="**** **** 1234"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#D7EAEE] flex justify-end">
            <Button type="submit" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
              Save Identification Data
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
