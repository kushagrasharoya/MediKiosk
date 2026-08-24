import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCase } from '../../context/CaseContext';

interface DocumentUploaderProps {
  onUploadSuccess?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUploadSuccess }) => {
  const { t } = useTranslation();
  const { uploadDocument } = useCase();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const MAX_SIZE_MB = 10;

  const validateAndUpload = async (file: File) => {
    setUploadError(null);
    setSuccessMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a PDF, JPG, or PNG document.');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`);
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument(file);
      setSuccessMessage(`Document "${file.name}" uploaded successfully.`);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-[#3EAEB1] bg-[#3EAEB1]/10 scale-[1.01]'
            : 'border-[#9CD1CE] bg-white/80 hover:border-[#3EAEB1] hover:bg-[#D7EAEE]/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#D7EAEE]/60 text-[#1D837F] flex items-center justify-center mb-4 shadow-sm">
          {isUploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-[#3EAEB1]" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
        </div>

        <h4 className="text-base font-bold text-[#102A43] text-center mb-1">
          {isUploading ? 'Uploading document to MediKiosk...' : t('documents.dragDrop')}
        </h4>
        <p className="text-xs text-slate-500 text-center">
          {t('documents.supportedFormats')}
        </p>
      </div>

      {/* Upload Error feedback */}
      {uploadError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Success feedback */}
      {successMessage && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};
