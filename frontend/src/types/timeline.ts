export type TimelineEventType = 'prescription' | 'lab_report' | 'discharge_summary' | 'consultation' | 'doctor_review' | 'upcoming_appointment';

export interface TimelineItem {
  id: string;
  date: string; // e.g. "12 Aug 2026"
  title: string;
  category: string;
  type: TimelineEventType;
  description?: string;
  status?: 'completed' | 'upcoming' | 'pending';
  documentId?: number;
}
