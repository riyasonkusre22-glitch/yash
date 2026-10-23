import { useState, useEffect } from 'react';
import { X, BookOpen, User, Phone, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

export default function EnrollModal({ isOpen, onClose, preselectedCourse = '' }) {
  const { showToast } = useToast();
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const courseOptions = [
    'Class 8th Foundation',
    'Class 9th Comprehensive',
    'Class 10th Board Booster',
    'Class 11th Science (PCM/PCB)',
    'Class 12th Board & Competitive',
    'JEE Main & Advanced',
    'NEET UG Preparation',
    'MHT-CET Crash Course',
  ];

  useEffect(() => {
    if (preselectedCourse) {
      setCourse(preselectedCourse);
    } else if (!course && courseOptions.length > 0) {
      setCourse(courseOptions[0]);
    }
  }, [preselectedCourse, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStudentName('');
      setPhone('');
      setError('');
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!studentName.trim() || !phone.trim() || !course) {
      setError('Please fill in all required fields.');
      return;
    }

    // Basic 10-digit phone validation
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('/api/enrollments', {
        studentName: studentName.trim(),
        phone: cleanedPhone,
        course,
      });

      showToast('Registration submitted! Yash Tutorials counselor will reach out shortly.');
      onClose();
    } catch (err) {
      console.error('Enrollment submission error:', err);
      const errMsg =
        err.response?.data?.message || 'Registration failed. Please try again or call us directly.';
      setError(errMsg);
      showToast(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content animate-zoom-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--slate-100)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--slate-500)',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--slate-200)';
            e.currentTarget.style.color = 'var(--slate-900)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--slate-100)';
            e.currentTarget.style.color = 'var(--slate-500)';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--brand-600)',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.375rem',
            }}
          >
            <BookOpen size={14} /> Free Consultation
          </div>
          <h3
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: 'var(--slate-900)',
              letterSpacing: '-0.02em',
              marginBottom: '0.375rem',
            }}
          >
            Book Free Demo Class
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            Experience our teaching methodology firsthand. Limited seats available per batch.
          </p>
        </div>

        {/* Error notification if any */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderRadius: 'var(--radius-md)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '0.8125rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label" htmlFor="studentName">
              Student Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="studentName"
                type="text"
                className="form-input"
                placeholder="e.g. Yash Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
                size={16}
                color="var(--slate-400)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="mobilePhone">
              Mobile Number *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="mobilePhone"
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={13}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone
                size={16}
                color="var(--slate-400)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="courseSelect">
              Select Course *
            </label>
            <select
              id="courseSelect"
              className="form-input"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              style={{
                cursor: 'pointer',
                background: 'white',
              }}
            >
              <option value="" disabled>
                -- Choose your grade or stream --
              </option>
              {courseOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--slate-500)',
              marginTop: '0.25rem',
            }}
          >
            <CheckCircle2 size={14} color="var(--emerald-500)" />
            <span>100% Free Demo Session & Study Material included</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
            style={{
              marginTop: '0.5rem',
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Submitting...' : 'Confirm Demo Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
