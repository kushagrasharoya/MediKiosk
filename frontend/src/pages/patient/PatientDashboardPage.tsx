import React from 'react';
import { WelcomeVoiceCard } from '../../components/dashboard/WelcomeVoiceCard';
import { WorkflowStepper } from '../../components/dashboard/WorkflowStepper';
import { RecentDocumentsCard } from '../../components/dashboard/RecentDocumentsCard';
import { AISummaryCard } from '../../components/dashboard/AISummaryCard';
import { MedicalTimelineCard } from '../../components/dashboard/MedicalTimelineCard';
import { ConsentStatusCard } from '../../components/dashboard/ConsentStatusCard';

export const PatientDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Row 1: Hero Welcome & Voice Assistant */}
      <WelcomeVoiceCard />

      {/* Row 2: Horizontal Workflow Progress Stepper */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-[#1D837F] uppercase tracking-wider px-1">
          Intake Progress
        </h3>
        <WorkflowStepper />
      </div>

      {/* Row 3: 3-Column Equal Height Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentDocumentsCard />
        <AISummaryCard />
        <MedicalTimelineCard />
      </div>

      {/* Row 4: Horizontal Patient Consent Control Bar */}
      <ConsentStatusCard />


    </div>
  );
};
