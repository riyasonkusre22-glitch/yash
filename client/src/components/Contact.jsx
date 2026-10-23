import { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const INITIAL_FORM_STATE = {
  studentName: '',
  parentPhone: '',
  classPreference: 'Class 8th - 10th (Secondary Foundation)',
  preferredTime: 'Evening Batch (04:00 PM - 08:00 PM)',
  message: '',
};

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentName.trim() || !formData.parentPhone.trim()) {
      showToast('Please fill in student name and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('/api/inquiries', {
        studentName: formData.studentName.trim(),
        parentPhone: formData.parentPhone.trim(),
        classPreference: formData.classPreference,
        preferredTime: formData.preferredTime,
        message: formData.message.trim(),
      });

      // Reset form on success
      setFormData(INITIAL_FORM_STATE);
      showToast('Inquiry sent successfully! Thank you.');
    } catch (error) {
      console.error('Contact submission error:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to send inquiry. Please try again.';
      showToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      style={{
        background: '#ffffff',
        padding: '5rem 0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto 3.5rem' }}>
          <div
            className="badge badge-brand"
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Sparkles size={14} color="var(--brand-600)" />
            <span>Get In Touch</span>
          </div>

          <h2
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'var(--slate-900)',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              marginBottom: '0.75rem',
            }}
          >
            Visit Yash Tutorials
          </h2>

          <p
            style={{
              color: 'var(--slate-600)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Have questions regarding admissions, batch timings, or merit scholarships? Reach out to our academic counselors or visit our learning center directly.
          </p>
        </div>

        {/* Grid Layout: Left Info Column & Right Inquiry Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Contact Information */}
          <div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--slate-900)',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              We're Here to Help Your Child Succeed
            </h3>

            <p
              style={{
                color: 'var(--slate-600)',
                fontSize: '0.975rem',
                lineHeight: 1.65,
                marginBottom: '2.25rem',
              }}
            >
              Our academic counselors are available throughout the week to provide career guidance, evaluate previous performance, and recommend the best-suited batch for every student.
            </p>

            {/* 4 Contact Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Item 1: Main Branch Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--brand-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--brand-100)',
                  }}
                >
                  <MapPin size={22} color="var(--brand-600)" />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Main Branch Address
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    Plot No. 42, Near Central Park, Main Road, City Center - 400001
                  </p>
                </div>
              </div>

              {/* Item 2: Phone Numbers */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--brand-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--brand-100)',
                  }}
                >
                  <Phone size={22} color="var(--brand-600)" />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Phone Numbers
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    <a
                      href="tel:+919876543210"
                      style={{ color: 'var(--brand-600)', fontWeight: 600 }}
                    >
                      +91 98765 43210
                    </a>{' '}
                    /{' '}
                    <a
                      href="tel:+919123456789"
                      style={{ color: 'var(--brand-600)', fontWeight: 600 }}
                    >
                      +91 91234 56789
                    </a>
                  </p>
                </div>
              </div>

              {/* Item 3: Email Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--brand-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--brand-100)',
                  }}
                >
                  <Mail size={22} color="var(--brand-600)" />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Email Address
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    <a
                      href="mailto:admissions@yashtutorials.com"
                      style={{ color: 'var(--brand-600)', fontWeight: 600 }}
                    >
                      admissions@yashtutorials.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Item 4: Center Timings */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'var(--brand-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--brand-100)',
                  }}
                >
                  <Clock size={22} color="var(--brand-600)" />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Center Timings
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    Monday to Saturday: 8:00 AM - 8:00 PM
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    Sunday: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form Card */}
          <div>
            <div
              style={{
                background: 'var(--slate-50)',
                padding: '2.25rem 2rem',
                borderRadius: '1.875rem',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.375rem',
                    fontWeight: 800,
                    color: 'var(--slate-900)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Send an Inquiry Message
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                  Fill in your details below and our counseling desk will call you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Student Name */}
                <div>
                  <label
                    htmlFor="studentName"
                    className="form-label"
                    style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}
                  >
                    Student Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="studentName"
                    name="studentName"
                    type="text"
                    required
                    placeholder="Enter student's full name"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Parent's Phone */}
                <div>
                  <label
                    htmlFor="parentPhone"
                    className="form-label"
                    style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}
                  >
                    Parent's Phone <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="parentPhone"
                    name="parentPhone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Class Dropdown */}
                <div>
                  <label
                    htmlFor="classPreference"
                    className="form-label"
                    style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}
                  >
                    Class & Stream Preference
                  </label>
                  <select
                    id="classPreference"
                    name="classPreference"
                    value={formData.classPreference}
                    onChange={handleChange}
                    className="form-input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Class 8th - 10th (Secondary Foundation)">
                      Class 8th - 10th (Secondary Foundation)
                    </option>
                    <option value="Class 11th - 12th (Science Stream)">
                      Class 11th - 12th (Science Stream)
                    </option>
                    <option value="JEE / NEET (Competitive Entrance)">
                      JEE / NEET (Competitive Entrance)
                    </option>
                  </select>
                </div>

                {/* Preferred Time Dropdown */}
                <div>
                  <label
                    htmlFor="preferredTime"
                    className="form-label"
                    style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}
                  >
                    Preferred Batch Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="form-input"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Morning Batch (08:00 AM - 12:00 PM)">
                      Morning Batch (08:00 AM - 12:00 PM)
                    </option>
                    <option value="Afternoon Batch (12:00 PM - 04:00 PM)">
                      Afternoon Batch (12:00 PM - 04:00 PM)
                    </option>
                    <option value="Evening Batch (04:00 PM - 08:00 PM)">
                      Evening Batch (04:00 PM - 08:00 PM)
                    </option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="form-label"
                    style={{ fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.35rem' }}
                  >
                    Message or Special Requirement (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Ask about scholarships, trial classes, or specific subject difficulty..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-full"
                  style={{
                    padding: '0.95rem 1.5rem',
                    fontSize: '0.95rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
