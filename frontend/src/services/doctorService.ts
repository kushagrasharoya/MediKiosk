import { CaseSummary } from '../types/case';

export interface DoctorVerificationNotes {
  caseId: string;
  notes: string;
  verifiedAt: string;
  doctorName: string;
}

export const doctorService = {
  getPendingCases: async (): Promise<Partial<CaseSummary>[]> => {
    // Isolated doctor case queue interface
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: '9f8b4c20-4e31-41fa-8a12-87a4a9c1e001',
        status: 'submitted',
        language: 'en',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        submitted_at: new Date(Date.now() - 1800000).toISOString(),
        patient: {
          id: 101,
          full_name: 'Rahul Kumar',
          dob: '1974-05-14',
          sex: 'male',
          phone: '+91 98765 43210',
          gov_id_type: 'Aadhaar',
          gov_id_ref: '**** **** 1234',
        },
        case_taking: {
          id: 201,
          chief_complaint: 'Chest tightness and shortness of breath during exertion for 3 days',
          history: 'Hypertension for 5 years, regular medication (Amlodipine 5mg)',
          symptoms: { chest_pain: true, breathlessness: true, fatigue: true },
          vitals: { bp: '130/85', pulse: '82', oxygen: '98%' },
        },
        consents: [
          { id: 1, consent_type: 'clinical_intake', granted: true, granted_at: new Date().toISOString(), method: 'digital' }
        ],
        documents: [
          { id: 1, filename: 'Prescription_12_Aug_2026.jpg', mime_type: 'image/jpeg', uploaded_at: '2026-08-12T10:30:00Z' },
          { id: 2, filename: 'Lab_Report_28_Jul_2026.pdf', mime_type: 'application/pdf', uploaded_at: '2026-07-28T14:20:00Z' },
        ],
      },
      {
        id: '3a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
        status: 'submitted',
        language: 'hi',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        submitted_at: new Date(Date.now() - 86400000).toISOString(),
        patient: {
          id: 102,
          full_name: 'Anita Singh',
          dob: '1985-09-22',
          sex: 'female',
          phone: '+91 91234 56789',
          gov_id_type: 'PAN',
          gov_id_ref: 'ABCDE1234F',
        },
        case_taking: {
          id: 202,
          chief_complaint: 'Persistent dry cough and mild fever',
          history: 'No major past illness reported',
          symptoms: { cough: true, fever: true },
          vitals: { temp: '99.4°F', bp: '120/80', pulse: '76' },
        },
        consents: [
          { id: 2, consent_type: 'clinical_intake', granted: true, granted_at: new Date().toISOString(), method: 'digital' }
        ],
        documents: [],
      }
    ];
  },

  verifyCase: async (caseId: string, notes: string): Promise<DoctorVerificationNotes> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      caseId,
      notes,
      verifiedAt: new Date().toISOString(),
      doctorName: 'Dr. Ananya Sharma',
    };
  }
};
