import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Sparkles, CheckCircle2, FileText, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { Edit3 } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { caseService } from '../../services/caseService';
import { CaseSummary } from '../../types/case';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DoctorEditPatientModal } from '../../components/modals/DoctorEditPatientModal';

export const DoctorReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  const [caseData, setCaseData] = useState<Partial<CaseSummary> | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCase = () => {
    if (caseId) {
      caseService
        .getSummary(caseId)
        .then((res) => setCaseData(res))
        .catch(() => {
          doctorService.getPendingCases().then((res) => {
            const found = res.find((c) => c.id === caseId) || res[0];
            setCaseData(found);
          });
        });
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);


  const handleVerifyCase = async () => {
    if (!caseId) return;
    setIsVerifying(true);
    try {
      await doctorService.verifyCase(caseId, doctorNotes);
      setIsVerifiedSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReadSummary = () => {
    if (isSpeaking) {
      stop();
    } else if (caseData?.case_taking) {
      const readout = `${t('summary.chiefComplaint')}: ${caseData.case_taking.chief_complaint}. ${t('summary.history')}: ${caseData.case_taking.history}.`;
      speak(readout, language);
    }
  };

  if (!caseData) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/doctor/cases')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1D837F] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('doctor.backToQueue')}
        </button>
        <span className="text-xs font-semibold text-slate-500">{t('doctor.reviewTitle')}</span>
      </div>

      {isVerifiedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t('doctor.verifiedSuccess')}</span>
          </div>
          <Button size="sm" onClick={() => navigate('/doctor/cases')}>
            {t('doctor.backToQueue')}
          </Button>
        </div>
      )}

      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-white border border-[#9CD1CE]/60 shadow-card-soft flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#102A43]">{caseData.patient?.full_name}</h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {t('consent.granted')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {caseData.patient?.sex}, {caseData.patient?.dob} • Phone: {caseData.patient?.phone} • ID: {caseData.patient?.gov_id_ref}
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowEditModal(true)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Patient Info
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReadSummary}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              isSpeaking
                ? 'bg-[#3EAEB1] text-white border-[#3EAEB1] animate-pulse'
                : 'bg-white text-[#1D837F] border-[#9CD1CE] hover:bg-[#D7EAEE]'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#3EAEB1]" />}
            <span>{isSpeaking ? t('header.stopAudio') : t('header.audioHelp')}</span>
          </button>
          <span className="text-xs font-bold text-white bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {t('summary.aiBadge')}
          </span>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <DoctorEditPatientModal
        caseData={caseData}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchCase}
      />


      {/* Grid: Left AI Summary / Case-Taking, Right Documents & Doctor Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Clinical Summary */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#1D837F] pb-2 border-b border-[#D7EAEE] flex items-center justify-between">
              <span>{t('doctor.patientReported')}</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                {t('doctor.requiresSignOff')}
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#102A43] block">{t('summary.chiefComplaint')}:</span>
                <p className="p-3 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] mt-1 text-slate-800">
                  {caseData.case_taking?.chief_complaint}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#102A43] block">{t('summary.history')}:</span>
                <p className="p-3 rounded-xl bg-[#F7FBFC] border border-[#D7EAEE] mt-1 text-slate-700">
                  {caseData.case_taking?.history}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#D7EAEE]/30">
                  <span className="font-bold text-[#1D837F] block">{t('summary.vitals')}:</span>
                  <p className="text-slate-700 font-medium">BP: 130/85, Pulse: 82, SpO2: 98%</p>
                </div>
                <div className="p-3 rounded-xl bg-[#D7EAEE]/30">
                  <span className="font-bold text-[#1D837F] block">{t('summary.medications')}:</span>
                  <p className="text-slate-700 font-medium">Amlodipine 5mg QD, Metformin 500mg</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Uploaded Documents List */}
          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#1D837F] pb-2 border-b border-[#D7EAEE]">
              {t('doctor.uploadedRecords')} ({caseData.documents?.length || 0})
            </h3>
            <div className="space-y-2">
              {caseData.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#D7EAEE]">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#3EAEB1]" />
                    <span className="text-xs font-bold text-[#102A43]">{doc.filename}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{doc.mime_type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Doctor Verification Notes Form */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-2 pb-2 border-b border-[#D7EAEE]">
              <Stethoscope className="w-4 h-4 text-[#1D837F]" />
              {t('doctor.doctorNotes')}
            </h3>

            <div className="space-y-3 text-xs">
              <label className="font-semibold text-[#102A43] block">
                {t('doctor.addNotes')}
              </label>
              <textarea
                rows={6}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter clinical assessment notes, prescription adjustments, or consultation plan..."
                className="w-full p-3 text-xs rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] resize-none"
              />

              <Button
                onClick={handleVerifyCase}
                isLoading={isVerifying}
                className="w-full py-3 mt-2"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                {t('doctor.approveCase')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
