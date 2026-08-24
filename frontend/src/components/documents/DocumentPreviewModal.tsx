import React from 'react';
import { Modal } from '../common/Modal';
import { DocumentRead } from '../../types/case';
import { FileText, Download, Calendar, HardDrive } from 'lucide-react';
import { Button } from '../common/Button';

interface DocumentPreviewModalProps {
  document: DocumentRead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  if (!document) return null;

  const isPDF = document.mime_type.includes('pdf');
  const isImage = document.mime_type.includes('image');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Preview" maxWidth="lg">
      <div className="space-y-4">
        {/* Document metadata header */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#D7EAEE]/40 border border-[#9CD1CE]/50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#1D837F]" />
            <div>
              <h4 className="text-xs font-bold text-[#102A43] truncate max-w-xs">
                {document.filename}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#3EAEB1]" />
                  {new Date(document.uploaded_at).toLocaleString()}
                </span>
                <span>•</span>
                <span className="uppercase font-semibold">{document.mime_type.split('/')[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Viewer / Preview Box */}
        <div className="h-64 rounded-xl bg-slate-900 flex items-center justify-center text-white overflow-hidden relative border border-slate-700">
          {isImage ? (
            <div className="text-center p-4">
              <FileText className="w-12 h-12 text-[#9CD1CE] mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium text-slate-300">
                Image preview loaded ({document.filename})
              </p>
            </div>
          ) : isPDF ? (
            <div className="text-center p-4">
              <FileText className="w-12 h-12 text-[#9FD8E1] mx-auto mb-2 opacity-80" />
              <p className="text-xs font-medium text-slate-300">
                PDF Medical Document ({document.filename})
              </p>
            </div>
          ) : (
            <div className="text-center p-4">
              <HardDrive className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Preview format unavailable</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button icon={<Download className="w-4 h-4" />}>
            Download File
          </Button>
        </div>
      </div>
    </Modal>
  );
};
