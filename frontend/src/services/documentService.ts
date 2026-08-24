import api from './api';
import { DocumentRead } from '../types/case';

export const documentService = {
  uploadDocument: async (caseId: string, file: File): Promise<DocumentRead> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<DocumentRead>(
      `/api/v1/cases/${caseId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
