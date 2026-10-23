import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import DashboardOverview from './pages/DashboardOverview';
import CoursesAdmin from './pages/CoursesAdmin';
import AchieversAdmin from './pages/AchieversAdmin';
import TestimonialsAdmin from './pages/TestimonialsAdmin';
import QuizAdmin from './pages/QuizAdmin';
import EnrollmentsAdmin from './pages/EnrollmentsAdmin';
import InquiriesAdmin from './pages/InquiriesAdmin';
import QuizAttemptsAdmin from './pages/QuizAttemptsAdmin';
import { Loader2 } from 'lucide-react';

function AdminRouter() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: 'white',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <Loader2 size={36} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: '#6366f1', marginBottom: '1rem' }} />
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>
          Verifying security session...
        </div>
      </div>
    );
  }

  // If unauthenticated, always display the clean login screen directly
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // If authenticated, display the full admin panel layout
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="courses" element={<CoursesAdmin />} />
        <Route path="achievers" element={<AchieversAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="quiz" element={<QuizAdmin />} />
        <Route path="enrollments" element={<EnrollmentsAdmin />} />
        <Route path="inquiries" element={<InquiriesAdmin />} />
        <Route path="quiz-attempts" element={<QuizAttemptsAdmin />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminRouter />
    </AdminAuthProvider>
  );
}
