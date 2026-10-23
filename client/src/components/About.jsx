import React, { useState } from 'react';
import { Brain, FileText, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

const About = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: Brain,
      iconColor: 'var(--brand-600, #4f46e5)',
      iconBg: 'var(--brand-100, #e0e7ff)',
      borderColor: 'rgba(79, 70, 229, 0.2)',
      title: 'Conceptual Clarity',
      tagline: 'Strong Foundation First',
      description:
        'We emphasize first-principles understanding over rote learning. Complex theories in Science and Mathematics are simplified with real-world examples, visual aids, and interactive explanations to ensure lifetime retention.',
      points: [
        'Root-level concept mastery',
        'Visual problem-solving methods',
        'Structured formula handbooks'
      ]
    },
    {
      id: 2,
      icon: FileText,
      iconColor: '#059669',
      iconBg: '#d1fae5',
      borderColor: 'rgba(16, 185, 129, 0.25)',
      title: 'Regular Testing & Analytics',
      tagline: 'Measure & Improve Weekly',
      description:
        'Consistent testing builds exam stamina and eliminates fear. Our weekly chapter-wise tests and comprehensive full-length mock exams replicate exact board and competitive entrance conditions.',
      points: [
        'Weekly Chapter Assessment (WCA)',
        'Error analysis & rank tracking',
        'Timely feedback to parents'
      ]
    },
    {
      id: 3,
      icon: HeartHandshake,
      iconColor: '#d97706',
      iconBg: '#fef3c7',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      title: '1-on-1 Doubt Clearing',
      tagline: 'Zero Doubts Unresolved',
      description:
        'Every learner learns at their own pace. We provide daily dedicated doubt-clearing windows where students sit directly with faculty members to resolve tricky questions, past homework, and exam concepts.',
      points: [
        'Daily dedicated doubt counters',
        'Individual remedial support',
        'Encouraging, friendly mentorship'
      ]
    }
  ];

  return (
    <section
      id="about"
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
        .about-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1240px;
          margin: 0 auto;
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .about-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .about-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
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
        {/* Label */}
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
          <span>WHY CHOOSE US</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 2.85rem)',
            fontWeight: 800,
            color: 'var(--slate-900, #0f172a)',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            margin: '0 0 1.25rem 0'
          }}
        >
          The Yash Tutorials Advantage
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: 1.7,
            color: 'var(--slate-600, #475569)',
            margin: 0
          }}
        >
          We combine experienced educator mentorship, scientific learning pedagogy, and
          high-frequency testing to transform academic potential into top-tier board scores and competitive ranks.
        </p>
      </div>

      {/* 3 Feature Cards */}
      <div className="about-cards-grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isHovered = hoveredCard === feature.id;

          return (
            <div
              key={feature.id}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: 'var(--slate-50, #f8fafc)',
                borderRadius: '1.5rem',
                border: isHovered
                  ? `1px solid ${feature.borderColor}`
                  : '1px solid var(--border, #e2e8f0)',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isHovered
                  ? '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)'
                  : '0 2px 6px rgba(15, 23, 42, 0.03)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '1rem',
                  backgroundColor: feature.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                }}
              >
                <Icon size={28} color={feature.iconColor} strokeWidth={2.2} />
              </div>

              {/* Tagline */}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: feature.iconColor,
                  marginBottom: '0.4rem'
                }}
              >
                {feature.tagline}
              </span>

              {/* Card Title */}
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--slate-900, #0f172a)',
                  lineHeight: 1.3,
                  margin: '0 0 1rem 0'
                }}
              >
                {feature.title}
              </h3>

              {/* Card Description */}
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  color: 'var(--slate-600, #475569)',
                  margin: '0 0 1.5rem 0',
                  flexGrow: 1
                }}
              >
                {feature.description}
              </p>

              {/* Bullet Points */}
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.625rem'
                }}
              >
                {feature.points.map((pt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--slate-700, #334155)'
                    }}
                  >
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default About;
