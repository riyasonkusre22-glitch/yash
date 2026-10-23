import React, { useState, useEffect, useRef } from 'react';
import { Award, TrendingUp, Users, HeartHandshake } from 'lucide-react';

const MetricsBanner = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [val1, setVal1] = useState(0);
  const [val2, setVal2] = useState(0);
  const [val3, setVal3] = useState(0);
  const [val4, setVal4] = useState(0);

  const bannerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800; // ms
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic function for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setVal1(Math.round(easeOut * 12));
            setVal2(Math.round(easeOut * 95));
            setVal3(Math.round(easeOut * 20));
            setVal4(Math.round(easeOut * 100));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      {
        threshold: 0.25
      }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, [hasAnimated]);

  const metrics = [
    {
      displayVal: `${val1}+`,
      label: 'Years of Excellence',
      icon: Award,
      badge: 'Since 2013'
    },
    {
      displayVal: `${val2}%+`,
      label: 'Average Board Score',
      icon: TrendingUp,
      badge: 'Consistent'
    },
    {
      displayVal: `${val3}:1`,
      label: 'Student-Teacher Ratio',
      icon: Users,
      badge: 'Small Batches'
    },
    {
      displayVal: `${val4}%`,
      label: 'Personalized Attention',
      icon: HeartHandshake,
      badge: 'Dedicated Mentors'
    }
  ];

  return (
    <section
      ref={bannerRef}
      id="metrics"
      style={{
        backgroundColor: 'var(--slate-900, #0f172a)',
        color: '#ffffff',
        padding: '3.5rem 1.5rem',
        borderTop: '1px solid #1e293b',
        borderBottom: '1px solid #1e293b',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem 1.5rem;
          max-width: 1240px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }
        }
      `}</style>

      {/* Subtle background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          height: '140%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="metrics-grid" style={{ position: 'relative', zIndex: 1 }}>
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1.25rem 1rem',
                backgroundColor: 'rgba(30, 41, 59, 0.45)',
                borderRadius: '1.25rem',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <IconComponent size={22} color="var(--brand-400, #818cf8)" />
              </div>

              {/* Number */}
              <div
                style={{
                  fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
                  fontWeight: 800,
                  color: 'var(--brand-500, #6366f1)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: '0.4rem',
                  textShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
                }}
              >
                {metric.displayVal}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 'clamp(0.85rem, 1.2vw, 0.975rem)',
                  fontWeight: 500,
                  color: 'var(--slate-400, #94a3b8)',
                  maxWidth: '180px',
                  lineHeight: 1.4
                }}
              >
                {metric.label}
              </div>

              {/* Mini Badge */}
              <span
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  backgroundColor: 'rgba(51, 65, 85, 0.6)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.02em'
                }}
              >
                {metric.badge}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MetricsBanner;
