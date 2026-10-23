import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Calculator, Trophy, Users, BookOpen, Star } from 'lucide-react';

const Hero = ({ onEnrollClick }) => {
  // Countdown timer: target is 4 days from mount
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // 4 days from initial load timestamp
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    targetDate.setHours(9, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const [isHoveredDemo, setIsHoveredDemo] = useState(false);
  const [isHoveredFees, setIsHoveredFees] = useState(false);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(238, 242, 255, 0.6) 0%, rgba(255, 255, 255, 1) 100%)',
        paddingTop: 'clamp(7rem, 12vw, 10rem)',
        paddingBottom: '4rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes green-pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        .hero-green-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
          animation: green-pulse 2s infinite ease-in-out;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          max-width: 1240px;
          margin: 0 auto;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.18fr 0.82fr;
            gap: 3.5rem;
          }
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--brand-600, #4f46e5) 0%, #7c3aed 50%, var(--brand-500, #6366f1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div className="hero-grid">
        {/* Left Column (7 cols equivalent on lg) */}
        <div>
          {/* Badge Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              backgroundColor: 'rgba(236, 253, 245, 0.95)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#065f46',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
            }}
          >
            <span className="hero-green-dot" />
            <span>Admissions Open for Academic Year 2026-27</span>
          </div>

          {/* H1 Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              color: 'var(--slate-900, #0f172a)',
              letterSpacing: '-0.025em',
              margin: '0 0 1.25rem 0'
            }}
          >
            Empowering Minds,<br />
            <span className="text-gradient">Building Future Leaders</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.7,
              color: 'var(--slate-600, #475569)',
              maxWidth: '620px',
              margin: '0 0 2rem 0'
            }}
          >
            Yash Tutorials offers systematic coaching for School Board Exams (8th to 10th),
            XI-XII Science/Commerce, NEET, and JEE with conceptual clarity and regular testing.
          </p>

          {/* 3 Feature Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2.5rem'
            }}
          >
            {[
              'Expert Faculty',
              'Small Batch Size',
              'Weekly Assessment'
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border, #e2e8f0)',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--slate-800, #1e293b)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
                }}
              >
                <CheckCircle size={17} color="#10b981" strokeWidth={2.5} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* 2 CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <button
              type="button"
              className="btn-primary"
              onClick={() => onEnrollClick && onEnrollClick('Free Demo Class')}
              onMouseEnter={() => setIsHoveredDemo(true)}
              onMouseLeave={() => setIsHoveredDemo(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                backgroundColor: isHoveredDemo ? 'var(--brand-700, #4338ca)' : 'var(--brand-600, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.875rem',
                padding: '0.9rem 1.85rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: isHoveredDemo
                  ? '0 14px 24px -4px rgba(79, 70, 229, 0.45)'
                  : '0 10px 18px -3px rgba(79, 70, 229, 0.35)',
                transform: isHoveredDemo ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span>Book Free Demo Class</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#fee-calculator"
              className="btn-outline"
              onMouseEnter={() => setIsHoveredFees(true)}
              onMouseLeave={() => setIsHoveredFees(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                backgroundColor: isHoveredFees ? 'rgba(79, 70, 229, 0.06)' : 'transparent',
                color: isHoveredFees ? 'var(--brand-600, #4f46e5)' : 'var(--slate-800, #1e293b)',
                border: isHoveredFees ? '2px solid var(--brand-600, #4f46e5)' : '2px solid var(--border, #cbd5e1)',
                borderRadius: '0.875rem',
                padding: '0.8rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer',
                transform: isHoveredFees ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Calculator size={18} color={isHoveredFees ? '#4f46e5' : '#64748b'} />
              <span>Estimate Fees</span>
            </a>
          </div>
        </div>

        {/* Right Column (5 cols equivalent on lg) */}
        <div>
          {/* Main Classroom Image with soft framing glow */}
          <div
            style={{
              position: 'relative',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              backgroundColor: '#e2e8f0',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            <img
              src="/img/classroom.jpg"
              alt="Yash Tutorials Classroom"
              onError={(e) => {
                // Graceful fallback to relative path if absolute fails
                if (!e.currentTarget.dataset.retried) {
                  e.currentTarget.dataset.retried = 'true';
                  e.currentTarget.src = './img/classroom.jpg';
                }
              }}
              style={{
                borderRadius: '1.5rem',
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>

          {/* Highlight Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1.25rem',
              border: '1px solid var(--border, #e2e8f0)',
              padding: '1.5rem',
              marginTop: '1.25rem',
              boxShadow: '0 12px 30px -8px rgba(15, 23, 42, 0.08)',
              position: 'relative'
            }}
          >
            {/* Card Header with Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--slate-900, #0f172a)',
                    margin: 0
                  }}
                >
                  Yash Tutorials Highlights
                </h3>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--slate-500, #64748b)'
                  }}
                >
                  Premier Classroom Learning
                </span>
              </div>

              {/* Rating badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span>4.9 / 5</span>
              </div>
            </div>

            {/* 3 Highlight Items */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                padding: '1rem 0'
              }}
            >
              {/* Item 1: Trophy */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.5rem 0.25rem',
                  backgroundColor: 'var(--slate-50, #f8fafc)',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.4rem auto'
                  }}
                >
                  <Trophy size={16} color="#d97706" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)' }}>
                  98.4%
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--slate-500, #64748b)', fontWeight: 500 }}>
                  Top Result
                </div>
              </div>

              {/* Item 2: Users */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.5rem 0.25rem',
                  backgroundColor: 'var(--slate-50, #f8fafc)',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.4rem auto'
                  }}
                >
                  <Users size={16} color="#4f46e5" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)' }}>
                  5,000+
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--slate-500, #64748b)', fontWeight: 500 }}>
                  Alumni
                </div>
              </div>

              {/* Item 3: BookOpen */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.5rem 0.25rem',
                  backgroundColor: 'var(--slate-50, #f8fafc)',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.4rem auto'
                  }}
                >
                  <BookOpen size={16} color="#059669" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900, #0f172a)' }}>
                  Custom
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--slate-500, #64748b)', fontWeight: 500 }}>
                  Test Series
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div
              style={{
                marginTop: '0.5rem',
                backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: '0.875rem',
                padding: '0.75rem 1rem'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#94a3b8',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}
              >
                Next Batch Starts In
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                {/* Days */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      color: 'var(--brand-400, #818cf8)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.65rem',
                      minWidth: '42px',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                    Days
                  </div>
                </div>

                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem' }}>:</span>

                {/* Hours */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      color: 'var(--brand-400, #818cf8)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.65rem',
                      minWidth: '42px',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                    Hours
                  </div>
                </div>

                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem' }}>:</span>

                {/* Mins */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      backgroundColor: '#1e293b',
                      color: 'var(--brand-400, #818cf8)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.65rem',
                      minWidth: '42px',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                    Mins
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
