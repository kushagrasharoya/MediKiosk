import api from './api';
import {
  CaseCreate,
  CaseRead,
  CaseSummary,
  ConsentUpdate,
  PatientIdentification,
  CaseTakingUpdate,
} from '../types/case';

export const caseService = {
  createCase: async (payload: CaseCreate = { language: 'en' }): Promise<CaseRead> => {
    const response = await api.post<CaseRead>('/api/v1/cases', payload);
    return response.data;
  },

  updateConsent: async (caseId: string, payload: ConsentUpdate): Promise<CaseRead> => {
    const response = await api.patch<CaseRead>(`/api/v1/cases/${caseId}/consent`, payload);
    return response.data;
  },

  updateIdentification: async (
    caseId: string,
    payload: PatientIdentification
  ): Promise<CaseRead> => {
    const response = await api.patch<CaseRead>(
      `/api/v1/cases/${caseId}/identification`,
      payload
    );
    return response.data;
  },

  updateCaseTaking: async (
    caseId: string,
    payload: CaseTakingUpdate
  ): Promise<CaseRead> => {
    const response = await api.put<CaseRead>(
      `/api/v1/cases/${caseId}/case-taking`,
      payload
    );
    return response.data;
  },

  getSummary: async (caseId: string): Promise<CaseSummary> => {
    const response = await api.get<CaseSummary>(`/api/v1/cases/${caseId}/summary`);
    return response.data;
  },

  submitCase: async (caseId: string): Promise<CaseRead> => {
    const response = await api.post<CaseRead>(`/api/v1/cases/${caseId}/submit`);
    return response.data;
  },
};
