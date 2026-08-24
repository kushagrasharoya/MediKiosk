export type CaseStatus = 'draft' | 'submitted' | 'verified';
export type Sex = 'male' | 'female' | 'other';
export type ConsentMethod = 'digital' | 'verbal' | 'written';

export interface PatientIdentification {
  full_name: string;
  dob: string; // YYYY-MM-DD
  sex: Sex;
  phone?: string | null;
  gov_id_type?: string | null;
  gov_id_ref?: string | null;
}

export interface PatientRead extends PatientIdentification {
  id: number;
}

export interface CaseCreate {
  language?: string;
  patient?: PatientIdentification | null;
}

export interface ConsentUpdate {
  consent_type: string;
  granted: boolean;
  method: ConsentMethod;
}

export interface ConsentRead {
  id: number;
  consent_type: string;
  granted: boolean;
  granted_at: string | null;
  method: ConsentMethod;
}

export interface CaseTakingUpdate {
  chief_complaint?: string | null;
  history?: string | null;
  symptoms?: Record<string, any> | null;
  vitals?: Record<string, any> | null;
}

export interface CaseTakingRead {
  id: number;
  chief_complaint: string | null;
  history: string | null;
  symptoms: Record<string, any> | null;
  vitals: Record<string, any> | null;
}

export interface DocumentRead {
  id: number;
  filename: string;
  mime_type: string;
  uploaded_at: string;
}

export interface CaseRead {
  id: string; // UUID
  patient_id: number;
  language: string;
  status: CaseStatus;
  created_at: string;
  submitted_at: string | null;
}

export interface CaseSummary {
  id: string; // UUID
  language: string;
  status: CaseStatus;
  created_at: string;
  submitted_at: string | null;
  patient: PatientRead;
  consents: ConsentRead[];
  case_taking: CaseTakingRead | null;
  documents: DocumentRead[];
}
