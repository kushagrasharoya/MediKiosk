import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowLeft, ArrowRight, CheckCircle2, Save } from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { VoiceInputPanel } from '../../components/interview/VoiceInputPanel';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

const INTERVIEW_QUESTIONS = [
  {
    id: 'chief_complaint',
    question: 'What is the main health issue or problem you are experiencing today?',
    field: 'chief_complaint',
  },
  {
    id: 'history',
    question: 'How long have you had this issue, and how did the symptoms start?',
    field: 'history',
  },
  {
    id: 'symptoms',
    question: 'Do you have any associated symptoms like fever, pain, shortness of breath, or dizziness?',
    field: 'symptoms',
  },
  {
    id: 'vitals',
    question: 'What current medications are you taking, or do you have any known medical conditions?',
    field: 'vitals',
  },
];

export const PatientInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { caseSummary, updateCaseTaking } = useCase();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    chief_complaint: caseSummary?.case_taking?.chief_complaint || '',
    history: caseSummary?.case_taking?.history || '',
    symptoms: caseSummary?.case_taking?.symptoms?.description || '',
    vitals: caseSummary?.case_taking?.vitals?.medications || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const currentQ = INTERVIEW_QUESTIONS[currentStepIndex];

  const handleAnswerSubmit = async (answer: string) => {
    const updatedAnswers = { ...answers, [currentQ.field]: answer };
    setAnswers(updatedAnswers);

    setIsSaving(true);
    try {
      await updateCaseTaking({
        chief_complaint: updatedAnswers.chief_complaint,
        history: updatedAnswers.history,
        symptoms: { description: updatedAnswers.symptoms },
        vitals: { medications: updatedAnswers.vitals },
      });

      if (currentStepIndex < INTERVIEW_QUESTIONS.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        navigate('/patient/documents');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1D837F] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <span className="text-xs font-semibold text-slate-500">
          Step {currentStepIndex + 1} of {INTERVIEW_QUESTIONS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#D7EAEE] h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#1D837F] to-[#3EAEB1] h-full transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / INTERVIEW_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Voice & Question Panel */}
      <VoiceInputPanel
        question={currentQ.question}
        onAnswerSubmit={handleAnswerSubmit}
        isLoading={isSaving}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          disabled={currentStepIndex === 0}
          onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStepIndex < INTERVIEW_QUESTIONS.length - 1 ? (
            <Button
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Skip Question
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/patient/documents')}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Complete Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
