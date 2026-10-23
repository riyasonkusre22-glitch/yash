import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MetricsBanner from './components/MetricsBanner';
import About from './components/About';
import Courses from './components/Courses';
import Achievers from './components/Achievers';
import FeeCalculator from './components/FeeCalculator';
import Quiz from './components/Quiz';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EnrollModal from './components/EnrollModal';
import Toast from './components/Toast';
import AdminApp from './admin/AdminApp';

// Existing Public Website Component - Zero links or visible reference to /admin
function PublicWebsite() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [preselectedCourse, setPreselectedCourse] = useState('');

  const handleEnrollClick = (course = '') => {
    setPreselectedCourse(course);
    setIsEnrollOpen(true);
  };

  const handleEnrollClose = () => {
    setIsEnrollOpen(false);
    setPreselectedCourse('');
  };

  return (
    <ToastProvider>
      <div className="app">
        <Navbar onEnrollClick={() => handleEnrollClick()} />
        <main>
          <Hero onEnrollClick={() => handleEnrollClick()} />
          <MetricsBanner />
          <About />
          <Courses onEnrollClick={handleEnrollClick} />
          <Achievers />
          <FeeCalculator onEnrollClick={() => handleEnrollClick()} />
          <Quiz />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <EnrollModal
          isOpen={isEnrollOpen}
          onClose={handleEnrollClose}
          preselectedCourse={preselectedCourse}
        />
        <Toast />
      </div>
    </ToastProvider>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Protected Admin Routing - Accessible only when explicitly typing /admin */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Public Educational Website */}
      <Route path="*" element={<PublicWebsite />} />
    </Routes>
  );
}
