import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { RoleGuard } from '@/components/auth/RoleGuard';

// Layouts
import { AdminLayout } from '@/layouts/AdminLayout';
import { InstructorLayout } from '@/layouts/InstructorLayout';
import { StudentLayout } from '@/layouts/StudentLayout';

// Auth Pages
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/auth/LoginPage';

// Error Pages
import { ForbiddenPage } from '@/pages/error/ForbiddenPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from '@/pages/admin/AdminStudentsPage';
import { AdminInstructorsPage } from '@/pages/admin/AdminInstructorsPage';
import { AdminBatchesPage } from '@/pages/admin/AdminBatchesPage';
import { AdminAssessmentsPage } from '@/pages/admin/AdminAssessmentsPage';
import { AdminQuestionsPage } from '@/pages/admin/AdminQuestionsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminNotificationsPage, AdminSettingsPage } from '@/pages/admin/AdminNotificationsPage';

// Instructor Pages
import {
  InstructorDashboardPage,
  InstructorBatchesPage,
  InstructorStudentsPage,
  InstructorQuestionsPage,
} from '@/pages/instructor/InstructorDashboardPage';
import { InstructorQuestionCreateEditPage } from '@/pages/instructor/InstructorQuestionCreateEditPage';
import { InstructorAssessmentsPage } from '@/pages/instructor/InstructorAssessmentsPage';
import { InstructorAssessmentBuilderPage } from '@/pages/instructor/InstructorAssessmentBuilderPage';
import { InstructorAssessmentMonitorPage } from '@/pages/instructor/InstructorAssessmentMonitorPage';
import {
  InstructorAssignmentsPage,
  InstructorAttendancePage,
} from '@/pages/instructor/InstructorAssignmentsPage';
import {
  InstructorLiveSessionsPage,
  InstructorAnalyticsPage,
  InstructorReportsPage,
  InstructorNotificationsPage,
  InstructorSettingsPage,
} from '@/pages/instructor/InstructorLiveSessionsPage';

// Student Pages
import { StudentDashboardPage, StudentClassesPage } from '@/pages/student/StudentDashboardPage';
import {
  StudentAssessmentsPage,
  StudentSubmissionsPage,
} from '@/pages/student/StudentAssessmentsPage';
import { StudentAssessmentIDEPage } from '@/pages/student/StudentAssessmentIDEPage';
import {
  StudentSubmissionDetailPage,
  StudentAssignmentsPage,
} from '@/pages/student/StudentSubmissionDetailPage';
import {
  StudentPerformancePage,
  StudentNotificationsPage,
  StudentProfilePage,
  StudentSettingsPage,
} from '@/pages/student/StudentPerformancePage';

export const AppRouter: React.FC = () => {
  const { user } = useAuthStore();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'INSTRUCTOR') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Public & Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <RoleGuard allowedRoles={['ADMIN']}>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="instructors" element={<AdminInstructorsPage />} />
          <Route path="batches" element={<AdminBatchesPage />} />
          <Route path="assessments" element={<AdminAssessmentsPage />} />
          <Route path="questions" element={<AdminQuestionsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Instructor Portal Routes */}
        <Route
          path="/instructor"
          element={
            <RoleGuard allowedRoles={['INSTRUCTOR']}>
              <InstructorLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="/instructor/dashboard" replace />} />
          <Route path="dashboard" element={<InstructorDashboardPage />} />
          <Route path="batches" element={<InstructorBatchesPage />} />
          <Route path="students" element={<InstructorStudentsPage />} />
          <Route path="questions" element={<InstructorQuestionsPage />} />
          <Route path="questions/new" element={<InstructorQuestionCreateEditPage />} />
          <Route path="assessments" element={<InstructorAssessmentsPage />} />
          <Route path="assessments/new" element={<InstructorAssessmentBuilderPage />} />
          <Route path="assessments/:id/monitor" element={<InstructorAssessmentMonitorPage />} />
          <Route path="assignments" element={<InstructorAssignmentsPage />} />
          <Route path="attendance" element={<InstructorAttendancePage />} />
          <Route path="live-sessions" element={<InstructorLiveSessionsPage />} />
          <Route path="analytics" element={<InstructorAnalyticsPage />} />
          <Route path="reports" element={<InstructorReportsPage />} />
          <Route path="notifications" element={<InstructorNotificationsPage />} />
          <Route path="settings" element={<InstructorSettingsPage />} />
        </Route>

        {/* Student Portal Routes */}
        <Route
          path="/student"
          element={
            <RoleGuard allowedRoles={['STUDENT']}>
              <StudentLayout />
            </RoleGuard>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="classes" element={<StudentClassesPage />} />
          <Route path="assessments" element={<StudentAssessmentsPage />} />
          <Route path="submissions" element={<StudentSubmissionsPage />} />
          <Route path="submissions/:id" element={<StudentSubmissionDetailPage />} />
          <Route path="assignments" element={<StudentAssignmentsPage />} />
          <Route path="performance" element={<StudentPerformancePage />} />
          <Route path="notifications" element={<StudentNotificationsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>

        {/* Standalone Fullscreen Student Assessment IDE Route */}
        <Route
          path="/student/assessments/:assessmentId/question/:questionId"
          element={
            <RoleGuard allowedRoles={['STUDENT']}>
              <StudentAssessmentIDEPage />
            </RoleGuard>
          }
        />

        {/* Error Handling & Wildcards */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
