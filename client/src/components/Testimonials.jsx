import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Quote, MessageSquareHeart } from 'lucide-react';

const DEFAULT_TESTIMONIALS_DATA = [
  {
    id: 1,
    quote:
      "Yash Tutorials transformed my son's attitude towards Science. The faculty is approachable and conducts regular parent-teacher meetings.",
    author: 'Mr. Rajesh Sharma',
    role: 'Parent of Class 10th Student',
    initials: 'RS',
    highlight: 'Class 10 Boards (95.6%)',
  },
  {
    id: 2,
    quote:
      'The small batch size made sure I never felt left behind in Mathematics. Solved last 10 years papers during batch revision.',
    author: 'Pooja Deshmukh',
    role: 'Class 12 Science Student',
    initials: 'PD',
    highlight: 'HSC Science & MHT-CET',
  },
  {
    id: 3,
    quote:
      'Best coaching institute in the area! Disciplined environment, excellent test series, and constant motivation.',
    author: 'Dr. Sunita Verma',
    role: 'Parent of NEET Candidate',
    initials: 'SV',
    highlight: 'NEET 2026 Aspirant',
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS_DATA);

  useEffect(() => {
    axios.get('/api/testimonials')
      .then((res) => {
        if (res.data?.data?.length > 0) {
          const apiData = res.data.data.map((t, i) => {
            const initials = t.author
              ? t.author.split(' ').map(n => n[0]).filter(Boolean).slice(-2).join('').toUpperCase()
              : 'YT';
            return {
              id: t._id || i + 1,
              quote: t.quote,
              author: t.author,
              role: t.role,
              initials,
              highlight: 'Verified Student/Parent Review'
            };
          });
          setTestimonials(apiData);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <section
      id="testimonials"
      style={{
        background: 'var(--slate-50)',
        borderTop: '1px solid var(--slate-200)',
        padding: '5rem 0',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto 3.5rem' }}>
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
            <MessageSquareHeart size={14} color="var(--brand-600)" />
            <span>Reviews</span>
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
            What Parents & Students Say
          </h2>

          <p
            style={{
              color: 'var(--slate-600)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Real feedback from our family of learners. Hear how structured guidance, personal attention, and consistent mock tests empower students to reach their dream colleges.
          </p>
        </div>

        {/* 3 Review Cards Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '1.5rem',
                border: '1px solid var(--slate-200)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                {/* Top Row: 5 Stars & Quote Icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill="var(--amber-400)"
                        color="var(--amber-400)"
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: 'var(--brand-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Quote size={14} color="var(--brand-600)" />
                  </div>
                </div>

                {/* Quote Paragraph */}
                <p
                  style={{
                    color: 'var(--slate-600)',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    marginBottom: '1.75rem',
                    fontStyle: 'normal',
                  }}
                >
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--slate-100)',
                }}
              >
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
                  }}
                >
                  {item.initials}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      fontSize: '0.9375rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {item.author}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--slate-500)',
                      marginTop: '0.125rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
