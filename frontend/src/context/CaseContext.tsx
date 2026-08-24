import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CaseRead,
  CaseSummary,
  ConsentUpdate,
  PatientIdentification,
  CaseTakingUpdate,
} from '../types/case';
import { caseService } from '../services/caseService';
import { documentService } from '../services/documentService';

interface CaseContextType {
  activeCaseId: string | null;
  caseData: CaseRead | null;
  caseSummary: CaseSummary | null;
  isLoading: boolean;
  error: string | null;
  createCase: (language?: string) => Promise<CaseRead>;
  updateConsent: (payload: ConsentUpdate) => Promise<CaseRead>;
  updateIdentification: (payload: PatientIdentification) => Promise<CaseRead>;
  updateCaseTaking: (payload: CaseTakingUpdate) => Promise<CaseRead>;
  uploadDocument: (file: File) => Promise<void>;
  fetchSummary: () => Promise<CaseSummary | null>;
  submitCase: () => Promise<CaseRead>;
  resetCase: () => void;
}

const STORAGE_KEY_CASE_ID = 'medikiosk_active_case_id';

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_CASE_ID);
  });
  const [caseData, setCaseData] = useState<CaseRead | null>(null);
  const [caseSummary, setCaseSummary] = useState<CaseSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async (): Promise<CaseSummary | null> => {
    if (!activeCaseId) return null;
    setIsLoading(true);
    setError(null);
    try {
      const summary = await caseService.getSummary(activeCaseId);
      setCaseSummary(summary);
      setIsLoading(false);
      return summary;
    } catch (err: any) {
      if (err.message && (err.message.includes('404') || err.message.includes('not found'))) {
        localStorage.removeItem(STORAGE_KEY_CASE_ID);
        setActiveCaseId(null);
        setCaseSummary(null);
      }
      setError(err.message || 'Failed to retrieve case summary');
      setIsLoading(false);
      return null;
    }
  }, [activeCaseId]);


  useEffect(() => {
    if (activeCaseId) {
      fetchSummary();
    }
  }, [activeCaseId, fetchSummary]);

  const createCase = async (language: string = 'en'): Promise<CaseRead> => {
    setIsLoading(true);
    setError(null);
    try {
      const newCase = await caseService.createCase({ language });
      setActiveCaseId(newCase.id);
      localStorage.setItem(STORAGE_KEY_CASE_ID, newCase.id);
      setCaseData(newCase);
      setIsLoading(false);
      await fetchSummary();
      return newCase;
    } catch (err: any) {
      setError(err.message || 'Failed to create case');
      setIsLoading(false);
      throw err;
    }
  };

  const updateConsent = async (payload: ConsentUpdate): Promise<CaseRead> => {
    let caseId = activeCaseId;
    if (!caseId) {
      const created = await createCase();
      caseId = created.id;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updated = await caseService.updateConsent(caseId, payload);
      setCaseData(updated);
      setIsLoading(false);
      await fetchSummary();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update consent');
      setIsLoading(false);
      throw err;
    }
  };

  const updateIdentification = async (payload: PatientIdentification): Promise<CaseRead> => {
    let caseId = activeCaseId;
    if (!caseId) {
      const created = await createCase();
      caseId = created.id;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updated = await caseService.updateIdentification(caseId, payload);
      setCaseData(updated);
      setIsLoading(false);
      await fetchSummary();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update patient identification');
      setIsLoading(false);
      throw err;
    }
  };

  const updateCaseTaking = async (payload: CaseTakingUpdate): Promise<CaseRead> => {
    let caseId = activeCaseId;
    if (!caseId) {
      const created = await createCase();
      caseId = created.id;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updated = await caseService.updateCaseTaking(caseId, payload);
      setCaseData(updated);
      setIsLoading(false);
      await fetchSummary();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update case-taking information');
      setIsLoading(false);
      throw err;
    }
  };

  const uploadDocument = async (file: File): Promise<void> => {
    let caseId = activeCaseId;
    if (!caseId) {
      const created = await createCase();
      caseId = created.id;
    }
    setIsLoading(true);
    setError(null);
    try {
      await documentService.uploadDocument(caseId, file);
      setIsLoading(false);
      await fetchSummary();
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
      setIsLoading(false);
      throw err;
    }
  };

  const submitCase = async (): Promise<CaseRead> => {
    if (!activeCaseId) {
      throw new Error('No active case found to submit');
    }
    setIsLoading(true);
    setError(null);
    try {
      const submitted = await caseService.submitCase(activeCaseId);
      setCaseData(submitted);
      setIsLoading(false);
      await fetchSummary();
      return submitted;
    } catch (err: any) {
      setError(err.message || 'Failed to submit case');
      setIsLoading(false);
      throw err;
    }
  };

  const resetCase = () => {
    setActiveCaseId(null);
    setCaseData(null);
    setCaseSummary(null);
    localStorage.removeItem(STORAGE_KEY_CASE_ID);
  };

  return (
    <CaseContext.Provider
      value={{
        activeCaseId,
        caseData,
        caseSummary,
        isLoading,
        error,
        createCase,
        updateConsent,
        updateIdentification,
        updateCaseTaking,
        uploadDocument,
        fetchSummary,
        submitCase,
        resetCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
