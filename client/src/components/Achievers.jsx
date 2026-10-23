import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Quote, Trophy, Star, Award } from 'lucide-react';

const defaultToppers = [
  {
    id: 1,
    initials: 'YA',
    bgColor: '#c7d2fe',
    textColor: '#3730a3',
    badgeBg: '#e0e7ff',
    badgeBorder: '#c7d2fe',
    achievement: '98.6% - 10th CBSE',
    name: 'Yash Agarwal',
    batch: 'Batch of 2025',
    quote:
      'The rigorous weekly test series and chapter-wise mock drills at Yash Tutorials eliminated my exam fear. The teachers were always available for one-on-one guidance!'
  },
  {
    id: 2,
    initials: 'SP',
    bgColor: '#a7f3d0',
    textColor: '#065f46',
    badgeBg: '#d1fae5',
    badgeBorder: '#a7f3d0',
    achievement: 'AIR 412 - NEET',
    name: 'Sneha Patil',
    batch: 'Batch of 2025',
    quote:
      'The Biology revision charts and regular doubt-solving sessions were game changers for me. Yash Tutorials provided the structure and confidence I needed to clear NEET.'
  },
  {
    id: 3,
    initials: 'RK',
    bgColor: '#c7d2fe',
    textColor: '#3730a3',
    badgeBg: '#e0e7ff',
    badgeBorder: '#c7d2fe',
    achievement: '97.8% - 12th Science',
    name: 'Rohan Kulkarni',
    batch: 'Batch of 2025',
    quote:
      'Mastering Physics and Chemistry numericals was tough until I joined Yash Tutorials. The systematic formulas and personalized faculty attention made all the difference.'
  },
  {
    id: 4,
    initials: 'AM',
    bgColor: '#ddd6fe',
    textColor: '#5b21b6',
    badgeBg: '#ede9fe',
    badgeBorder: '#ddd6fe',
    achievement: '99.2 Percentile - JEE',
    name: 'Ananya Mehta',
    batch: 'Batch of 2025',
    quote:
      'The small batch size ensured that my questions were never ignored. Daily DPPs and comprehensive rank analysis pushed me to achieve my dream percentile!'
  }
];

const Achievers = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [toppers, setToppers] = useState(defaultToppers);

  useEffect(() => {
    axios.get('/api/achievers')
      .then((res) => {
        if (res.data?.data?.length > 0) {
          const apiToppers = res.data.data.map((item, idx) => ({
            id: item._id || idx + 1,
            initials: item.initials,
            bgColor: item.bgColor || '#c7d2fe',
            textColor: item.textColor || '#3730a3',
            badgeBg: item.bgColor ? `${item.bgColor}40` : '#e0e7ff',
            badgeBorder: item.bgColor || '#c7d2fe',
            achievement: item.achievement,
            name: item.name,
            batch: item.batch,
            quote: item.quote
          }));
          setToppers(apiToppers);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="results"
      style={{
        backgroundColor: '#ffffff',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        position: 'relative'
      }}
    >
      <style>{`
        .achievers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1240px;
          margin: 0 auto;
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .achievers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .achievers-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .badge {
          display: inline-block;
          border-radius: 9999px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
      `}</style>

      {/* Section Header */}
      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto 4rem auto',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#b45309',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}
        >
          <Trophy size={14} color="#b45309" />
          <span>HALL OF FAME</span>
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
          Our Toppers Speak For Us
        </h2>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'var(--slate-600, #475569)',
            margin: 0
          }}
        >
          Real stories of dedication, consistent mentorship, and remarkable academic achievements
          from the students of Yash Tutorials.
        </p>
      </div>

      {/* Achievers Grid */}
      <div className="achievers-grid">
        {toppers.map((topper) => {
          const isHovered = hoveredCard === topper.id;

          return (
            <div
              key={topper.id}
              onMouseEnter={() => setHoveredCard(topper.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: 'var(--slate-50, #f8fafc)',
                borderRadius: '1.5rem',
                border: '1px solid var(--border, #e2e8f0)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: isHovered
                  ? '0 16px 28px -4px rgba(15, 23, 42, 0.09), 0 8px 10px -6px rgba(15, 23, 42, 0.04)'
                  : '0 2px 6px rgba(15, 23, 42, 0.03)',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
            >
              {/* Avatar Circle */}
              <div
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '9999px',
                  backgroundColor: topper.bgColor,
                  color: topper.textColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.08)',
                  marginBottom: '1.25rem',
                  border: '3px solid #ffffff'
                }}
              >
                {topper.initials}
              </div>

              {/* Achievement Badge */}
              <div
                className="badge"
                style={{
                  backgroundColor: topper.badgeBg,
                  color: topper.textColor,
                  border: `1px solid ${topper.badgeBorder}`,
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.825rem',
                  marginBottom: '1rem'
                }}
              >
                {topper.achievement}
              </div>

              {/* Topper Name */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--slate-900, #0f172a)',
                  lineHeight: 1.25,
                  margin: '0 0 0.25rem 0'
                }}
              >
                {topper.name}
              </h3>

              {/* Batch */}
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--slate-500, #64748b)',
                  marginBottom: '1.25rem'
                }}
              >
                {topper.batch}
              </div>

              {/* Quote Container */}
              <div
                style={{
                  position: 'relative',
                  marginTop: 'auto',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #e2e8f0',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    opacity: 0.5
                  }}
                >
                  <Quote size={20} color={topper.textColor} />
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: 'var(--slate-600, #475569)',
                    fontStyle: 'italic',
                    margin: 0
                  }}
                >
                  "{topper.quote}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Achievers;
