import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Search, Filter, Stethoscope, ArrowRight } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { CaseSummary } from '../../types/case';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DoctorAddPatientModal } from '../../components/modals/DoctorAddPatientModal';

export const DoctorCasesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cases, setCases] = useState<Partial<CaseSummary>[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCases = () => {
    doctorService.getPendingCases().then(setCases);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.patient?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#102A43] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#3EAEB1]" />
            {t('doctor.queueTitle')}
          </h2>
          <p className="text-xs text-slate-600">{t('doctor.queueSubtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            + Add Patient Case
          </Button>

          <div className="relative">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('doctor.searchPlaceholder')}
              className="px-4 py-2 text-xs rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] pl-9"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#9CD1CE] focus:ring-2 focus:ring-[#3EAEB1] font-semibold text-[#102A43]"
          >
            <option value="all">{t('doctor.allStatuses')}</option>
            <option value="submitted">{t('doctor.submitted')}</option>
            <option value="verified">{t('doctor.verified')}</option>
            <option value="draft">{t('doctor.draft')}</option>
          </select>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#D7EAEE] hover:border-[#3EAEB1] shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1D837F] to-[#3EAEB1] text-white font-bold flex items-center justify-center text-sm">
                  {c.patient?.full_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#102A43]">{c.patient?.full_name}</h4>
                  <p className="text-xs text-slate-500">
                    {t('auth.phone')}: {c.patient?.phone} • ID: {c.patient?.gov_id_ref}
                  </p>
                  <p className="text-xs text-[#1D837F] font-medium mt-0.5">
                    {t('summary.chiefComplaint')}: {c.case_taking?.chief_complaint}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#1D837F] bg-[#D7EAEE]/50 px-2.5 py-1 rounded-full">
                  {c.documents?.length || 0} Docs
                </span>
                <Button size="sm" onClick={() => navigate(`/doctor/cases/${c.id}/review`)}>
                  {t('doctor.reviewCase')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <DoctorAddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCases}
      />
    </div>
  );
};

