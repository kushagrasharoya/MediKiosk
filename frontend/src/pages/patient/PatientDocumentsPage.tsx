import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Eye, ArrowLeft, ArrowRight, FlaskConical, FileCheck, CheckCircle2 } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { DocumentUploader } from '../../components/documents/DocumentUploader';
import { DocumentPreviewModal } from '../../components/documents/DocumentPreviewModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { DocumentRead } from '../../types/case';

export const PatientDocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { caseSummary } = useCase();
  const [selectedDoc, setSelectedDoc] = useState<DocumentRead | null>(null);

  const documents = caseSummary?.documents || [];

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
        <span className="text-xs font-semibold text-slate-500">Document Scan & Upload</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#102A43]">{t('documents.uploadTitle')}</h2>
        <p className="text-xs text-slate-600">{t('documents.uploadDesc')}</p>
      </div>

      {/* Drag and drop uploader */}
      <DocumentUploader />

      {/* Uploaded Documents List */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#3EAEB1]" />
          Uploaded Medical Documents ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <div className="text-center py-8 bg-[#D7EAEE]/20 rounded-xl border border-dashed border-[#9CD1CE]">
            <p className="text-xs text-slate-500">{t('documents.emptyState')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#D7EAEE] hover:border-[#9CD1CE] shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D7EAEE]/50 flex items-center justify-center text-[#1D837F]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#102A43]">{doc.filename}</h4>
                    <p className="text-[10px] text-slate-500">
                      Uploaded {new Date(doc.uploaded_at).toLocaleString()} • {doc.mime_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Uploaded
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedDoc(doc)}
                    icon={<Eye className="w-4 h-4 text-[#3EAEB1]" />}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/patient/interview')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Interview
        </Button>
        <Button
          onClick={() => navigate('/patient/summary')}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Summary
        </Button>
      </div>

      {/* Modal for document preview */}
      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
};
