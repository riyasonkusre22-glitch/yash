import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, BookOpen, Clock, ArrowRight } from 'lucide-react';

const defaultCourses = [
    {
      category: 'school',
      title: 'Secondary Foundation',
      subtitle: 'Class 8th, 9th & 10th',
      badge: 'State & CBSE Board',
      headerClass: 'course-header-school',
      headerGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      subjects: ['Mathematics', 'Science (Phy/Chem/Bio)', 'English', 'Social Studies'],
      features: [
        'Board Exam-focused Prep',
        'NTSE & Olympiad Orientation'
      ],
      duration: 'Academic Year Program',
      batchSize: 'Max 20 Students'
    },
    {
      category: 'science',
      title: 'XI & XII Science Board',
      subtitle: 'PCM & PCB Streams',
      badge: 'State & CBSE',
      headerClass: 'course-header-science',
      headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      features: [
        'Practical & Viva Preparation',
        'Chapter-wise Board Pattern Papers'
      ],
      duration: '2-Year Comprehensive',
      batchSize: 'Max 22 Students'
    },
    {
      category: 'competitive',
      title: 'JEE Main & NEET Prep',
      subtitle: 'Integrated 2-Year Batch',
      badge: 'Competitive Exams',
      headerClass: 'course-header-competitive',
      headerGradient: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
      subjects: ['Daily DPPs', 'Full Mock Test', 'Rank Analytics'],
      features: [
        'Shortcut trick modules for entrance',
        'Previous 15 years solved papers'
      ],
      duration: 'Targeted Entrance Batch',
      batchSize: 'Max 18 Students'
    }
  ];

  const Courses = ({ onEnrollClick }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [coursesList, setCoursesList] = useState(defaultCourses);

    const tabs = [
      { id: 'all', label: 'All Programs' },
      { id: 'school', label: 'Class 8th-10th' },
      { id: 'science', label: 'Class 11th-12th Science' },
      { id: 'competitive', label: 'NEET/JEE Prep' }
    ];

    useEffect(() => {
      axios.get('/api/courses')
        .then((res) => {
          if (res.data?.data?.length > 0) {
            setCoursesList(res.data.data);
          }
        })
        .catch(() => {});
    }, []);

    const filteredCourses = activeTab === 'all'
      ? coursesList
      : coursesList.filter((c) => c.category === activeTab);

  return (
    <section
      id="courses"
      style={{
        backgroundColor: 'var(--slate-50, #f8fafc)',
        borderTop: '1px solid var(--border, #e2e8f0)',
        borderBottom: '1px solid var(--border, #e2e8f0)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        position: 'relative'
      }}
    >
      <style>{`
        .course-header-school {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        .course-header-science {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        .course-header-competitive {
          background: linear-gradient(135deg, #7c3aed 0%, #4338ca 100%);
        }
        .tab-btn {
          background-color: #ffffff;
          color: var(--slate-700, #334155);
          border: 1px solid var(--border, #cbd5e1);
          border-radius: 9999px;
          padding: 0.65rem 1.4rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .tab-btn:hover {
          border-color: var(--brand-600, #4f46e5);
          color: var(--brand-600, #4f46e5);
          transform: translateY(-1px);
        }
        .tab-btn.active {
          background-color: var(--brand-600, #4f46e5);
          color: #ffffff;
          border-color: var(--brand-600, #4f46e5);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }
        .btn-dark {
          background-color: var(--slate-900, #0f172a);
          color: #ffffff;
          border: none;
          border-radius: 0.75rem;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }
        .btn-dark:hover {
          background-color: var(--slate-800, #1e293b);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2);
          transform: translateY(-2px);
        }
        .courses-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1240px;
          margin: 0 auto;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .courses-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .courses-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      {/* Section Header */}
      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto 3rem auto',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(79, 70, 229, 0.08)',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--brand-600, #4f46e5)',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}
        >
          <span>PROGRAMS & CURRICULUM</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.85rem)',
            fontWeight: 800,
            color: 'var(--slate-900, #0f172a)',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            margin: '0 0 1rem 0'
          }}
        >
          Courses Offered at Yash Tutorials
        </h2>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'var(--slate-600, #475569)',
            margin: 0
          }}
        >
          From foundational high school preparation to rigorous NEET and JEE entrance coaching,
          our syllabus-aligned curriculum delivers proven academic success.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '3.5rem'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={isActive ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Courses Cards Grid */}
      <div className="courses-grid">
        {filteredCourses.map((course, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.5rem',
                border: '1px solid var(--border, #e2e8f0)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Card Header */}
              <div
                className={course.headerClass}
                style={{
                  background: course.headerGradient,
                  color: '#ffffff',
                  padding: '2rem 1.75rem',
                  position: 'relative'
                }}
              >
                {/* Badge Pill */}
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.85rem'
                  }}
                >
                  {course.badge}
                </div>

                {/* Title */}
                <h4
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    lineHeight: 1.25,
                    margin: '0 0 0.35rem 0'
                  }}
                >
                  {course.title}
                </h4>

                {/* Subtitle */}
                <div
                  style={{
                    fontSize: '0.9rem',
                    opacity: 0.9,
                    fontWeight: 500
                  }}
                >
                  {course.subtitle}
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1
                }}
              >
                {/* Subjects Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--slate-400, #94a3b8)',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}
                  >
                    Subjects Covered
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.45rem'
                    }}
                  >
                    {course.subjects.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          backgroundColor: 'var(--slate-50, #f8fafc)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '9999px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--slate-700, #334155)'
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features Section */}
                <div style={{ marginBottom: '2rem', flexGrow: 1 }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--slate-400, #94a3b8)',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}
                  >
                    Batch Features
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.625rem'
                    }}
                  >
                    {course.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.625rem',
                          fontSize: '0.875rem',
                          color: 'var(--slate-700, #334155)',
                          lineHeight: 1.45
                        }}
                      >
                        <span
                          style={{
                            marginTop: '0.15rem',
                            flexShrink: 0
                          }}
                        >
                          <Check size={16} color="#10b981" strokeWidth={3} />
                        </span>
                        <span style={{ fontWeight: 500 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  className="btn-dark"
                  onClick={() => onEnrollClick && onEnrollClick(course.title)}
                >
                  <span>Inquire Class Details</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Courses;
