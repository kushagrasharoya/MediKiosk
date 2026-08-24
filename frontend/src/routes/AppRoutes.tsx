import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Auth Pages
import { RoleSelectionPage } from '../pages/auth/RoleSelectionPage';
import { PatientLoginPage } from '../pages/auth/PatientLoginPage';
import { DoctorLoginPage } from '../pages/auth/DoctorLoginPage';
import { PatientSignupPage } from '../pages/auth/PatientSignupPage';
import { DoctorSignupPage } from '../pages/auth/DoctorSignupPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// Patient Pages
import { PatientDashboardPage } from '../pages/patient/PatientDashboardPage';
import { PatientInterviewPage } from '../pages/patient/PatientInterviewPage';
import { PatientDocumentsPage } from '../pages/patient/PatientDocumentsPage';
import { PatientSummaryPage } from '../pages/patient/PatientSummaryPage';
import { PatientDoctorReviewPage } from '../pages/patient/PatientDoctorReviewPage';
import { PatientTimelinePage } from '../pages/patient/PatientTimelinePage';
import { PatientConsentPage } from '../pages/patient/PatientConsentPage';
import { PatientConsultationPage } from '../pages/patient/PatientConsultationPage';
import { PatientProfilePage } from '../pages/patient/PatientProfilePage';
import { PatientSettingsPage } from '../pages/patient/PatientSettingsPage';


// Doctor Pages
import { DoctorDashboardPage } from '../pages/doctor/DoctorDashboardPage';
import { DoctorCasesPage } from '../pages/doctor/DoctorCasesPage';
import { DoctorReviewPage } from '../pages/doctor/DoctorReviewPage';
import { DoctorSettingsPage } from '../pages/doctor/DoctorSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login" element={<RoleSelectionPage />} />
      <Route path="/login/patient" element={<PatientLoginPage />} />
      <Route path="/login/doctor" element={<DoctorLoginPage />} />
      <Route path="/signup/patient" element={<PatientSignupPage />} />
      <Route path="/signup/doctor" element={<DoctorSignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRole="patient">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboardPage />} />
        <Route path="interview" element={<PatientInterviewPage />} />
        <Route path="documents" element={<PatientDocumentsPage />} />
        <Route path="summary" element={<PatientSummaryPage />} />
        <Route path="timeline" element={<PatientTimelinePage />} />
        <Route path="doctor-review" element={<PatientDoctorReviewPage />} />

        <Route path="consent" element={<PatientConsentPage />} />
        <Route path="consultation" element={<PatientConsultationPage />} />
        <Route path="profile" element={<PatientProfilePage />} />
        <Route path="settings" element={<PatientSettingsPage />} />
      </Route>

      {/* Protected Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRole="doctor">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboardPage />} />
        <Route path="cases" element={<DoctorCasesPage />} />
        <Route path="cases/:caseId/review" element={<DoctorReviewPage />} />
        <Route path="settings" element={<DoctorSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
