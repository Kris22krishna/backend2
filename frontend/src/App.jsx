import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/WebsiteLayout';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import MathSelection from './pages/MathSelection';
import GradeSyllabus from './pages/GradeSyllabus';
import PracticePage from './pages/PracticePage';
import ContentPage from './pages/ContentPage';
import DynamicQuestionsDashboard from './pages/DynamicQuestionsDashboard';
import PracticeSession from './pages/PracticeSession';
import UploaderLogin from './pages/UploaderLogin';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Dashboards
import StudentDashboard from './pages/dashboards/student/StudentDashboard';
import TeacherLayout from './pages/dashboards/teacher/TeacherLayout';
import TeacherDashboard from './pages/dashboards/teacher/TeacherDashboard';
import TeacherStudents from './pages/dashboards/teacher/TeacherStudents';
import TeacherAssignments from './pages/dashboards/teacher/TeacherAssignments';
import TeacherAttendance from './pages/dashboards/teacher/TeacherAttendance';
import TeacherSettings from './pages/dashboards/teacher/TeacherSettings';
import ParentLayout from './pages/dashboards/parent/ParentLayout';
import ParentDashboard from './pages/dashboards/parent/ParentDashboard';
import ProgressPage from './pages/dashboards/parent/ProgressPage';
import QuizzesPage from './pages/dashboards/parent/QuizzesPage';
import SkillsPage from './pages/dashboards/parent/SkillsPage';
import ReportsPage from './pages/dashboards/parent/ReportsPage';
import SettingsPage from './pages/dashboards/parent/SettingsPage';
import NotificationsPage from './pages/dashboards/parent/NotificationsPage';
import GuestDashboard from './pages/dashboards/GuestDashboard';

// Admin Dashboard
import AdminLayout from './pages/dashboards/admin/AdminLayout';
import AdminDashboard from './pages/dashboards/admin/AdminDashboard';
// Admin Pages
import AdminStudentsPage from './pages/dashboards/admin/pages/StudentsPage';
import AdminTeachersPage from './pages/dashboards/admin/pages/TeachersPage';
import AdminParentsPage from './pages/dashboards/admin/pages/ParentsPage';
import AdminGuestsPage from './pages/dashboards/admin/pages/GuestsPage';
import AdminUploadersPage from './pages/dashboards/admin/pages/UploadersPage';
import AdminAssessmentUploadersPage from './pages/dashboards/admin/pages/AssessmentUploadersPage';
import AdminClassesPage from './pages/dashboards/admin/pages/ClassesPage';
import AdminQuizzesPage from './pages/dashboards/admin/pages/QuizzesPage';
import AdminQuestionBankPage from './pages/dashboards/admin/pages/QuestionBankPage';
import AdminSkillsPage from './pages/dashboards/admin/pages/SkillsPage';
import AdminQuestionGenerationPage from './pages/dashboards/admin/pages/QuestionGenerationPage';
import AdminTemplatesPage from './pages/dashboards/admin/pages/TemplatesPage';
import AdminGeneratedQuestionsPage from './pages/dashboards/admin/pages/GeneratedQuestionsPage';
import AdminAlertsPage from './pages/dashboards/admin/pages/AlertsPage';
import AdminAnalyticsPage from './pages/dashboards/admin/pages/AnalyticsPage';
import AdminSystemHealthPage from './pages/dashboards/admin/pages/SystemHealthPage';
import AdminActivityLogPage from './pages/dashboards/admin/pages/ActivityLogPage';
import AdminSettingsPage from './pages/dashboards/admin/pages/SettingsPage';

import UploaderDashboard from './pages/uploader/UploaderDashboard';
import AssessmentUploaderLogin from './pages/AssessmentUploaderLogin';
import AssessmentUploaderDashboard from './pages/dashboards/AssessmentUploaderDashboard';
import AssessmentAccessPage from './pages/AssessmentAccessPage';
import AssessmentStudentDashboard from './pages/dashboards/AssessmentStudentDashboard';
import AssessmentRunner from './pages/AssessmentRunner';

// Junior Pages (Grades 1-4 child-friendly design)
import JuniorGradeSyllabus from './pages/juniors/JuniorGradeSyllabus';
import JuniorSubtopics from './pages/juniors/JuniorSubtopics';
import JuniorPracticeSession from './pages/juniors/JuniorPracticeSession';

// Middle Pages (Grades 5-7 professional design)
import MiddleGradeSyllabus from './pages/middle/MiddleGradeSyllabus';
import MiddlePracticeSession from './pages/middle/MiddlePracticeSession';

// High School Pages (Grades 8-10 professional design)
import HighPracticeSession from './pages/high/HighPracticeSession';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="learn-to-learn" element={<ContentPage topic="learn-to-learn" />} />
          <Route path="math" element={<MathSelection />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="math/grade/:grade" element={<GradeSyllabus />} />
          {/* Middle Routes (Grades 5-7 professional design) */}
          <Route path="middle/grade/:grade" element={<MiddleGradeSyllabus />} />
          {/* Practice Session moved to top level for full screen */}
          <Route path="ai" element={<ContentPage topic="ai" />} />
        </Route>

        {/* Junior Routes (Grades 1-4 child-friendly design) */}
        <Route path="/junior/grade/:grade" element={<JuniorGradeSyllabus />} />
        <Route path="/junior/grade/:grade/topic/:topic" element={<JuniorSubtopics />} />
        <Route path="/junior/grade/:grade/practice" element={<JuniorPracticeSession />} />

        {/* Middle Routes (Grades 5-7 separate professional design) */}


        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-Based Dashboards */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Teacher Dashboard with Nested Layout */}
        <Route path="/teacher-dashboard" element={<TeacherLayout />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* Parent Dashboard with Nested Layout */}
        <Route path="/parent-dashboard" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Admin Dashboard with Nested Layout - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']} redirectTo="/admin-login">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          {/* User Management */}
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="teachers" element={<AdminTeachersPage />} />
          <Route path="parents" element={<AdminParentsPage />} />
          <Route path="guests" element={<AdminGuestsPage />} />
          <Route path="uploaders" element={<AdminUploadersPage />} />
          <Route path="assessment-uploaders" element={<AdminAssessmentUploadersPage />} />
          <Route path="classes" element={<AdminClassesPage />} />
          {/* Content */}
          <Route path="quizzes" element={<AdminQuizzesPage />} />
          <Route path="question-bank" element={<AdminQuestionBankPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          {/* Question Tools */}
          <Route path="question-generation" element={<AdminQuestionGenerationPage />} />
          <Route path="templates" element={<AdminTemplatesPage />} />
          <Route path="generated-questions" element={<AdminGeneratedQuestionsPage />} />
          {/* Monitoring */}
          <Route path="alerts" element={<AdminAlertsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="system-health" element={<AdminSystemHealthPage />} />
          <Route path="activity-log" element={<AdminActivityLogPage />} />
          {/* Configuration */}
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="/guest-dashboard" element={<GuestDashboard />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/uploader-login" element={<UploaderLogin />} />
        <Route path="/uploader-dashboard" element={<UploaderDashboard />} />

        <Route path="/assessment-uploader-login" element={<AssessmentUploaderLogin />} />
        <Route path="/assessment-uploader-dashboard" element={<AssessmentUploaderDashboard />} />
        <Route path="/assessment-access" element={<AssessmentAccessPage />} />
        <Route path="/assessment-student-dashboard" element={<AssessmentStudentDashboard />} />
        <Route path="/assessment-runner" element={<AssessmentRunner />} />

        {/* Full Screen Practice Sessions */}
        <Route path="/practice/:templateId" element={<PracticeSession />} />
        <Route path="/middle/practice/:skillId" element={<MiddlePracticeSession />} />
        <Route path="/high/practice/:skillId" element={<HighPracticeSession />} />
      </Routes>
    </Router>
  );
}

export default App;

