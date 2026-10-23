import { useState, useMemo } from 'react';
import { ShieldCheck, Award, CreditCard, Sparkles, Check, ChevronRight } from 'lucide-react';

const CLASS_OPTIONS = [
  { id: '8th', name: '8th Grade', fee: 25000, description: 'Math, Science & English Foundation' },
  { id: '9th', name: '9th Grade', fee: 30000, description: 'High School Foundation & Concepts' },
  { id: '10th', name: '10th Grade', fee: 35000, description: 'Board Booster + Intensive Mock Series' },
  { id: '11th Sci', name: '11th Science', fee: 45000, description: 'Physics, Chemistry, Math / Biology' },
  { id: '12th Sci', name: '12th Science', fee: 50000, description: 'Board Exam Mastery + Practical Prep' },
  { id: 'JEE/NEET', name: 'JEE / NEET', fee: 85000, description: 'Intensive Competitive Entrance Coaching' },
];

export default function FeeCalculator({ onEnrollClick }) {
  const [selectedClass, setSelectedClass] = useState('10th');
  const [paymentType, setPaymentType] = useState('one-time');
  const [scholarship, setScholarship] = useState('0');

  // Compute calculated fees and discounts using useMemo
  const { baseFee, discountPercentage, discountAmount, finalFee, installmentAmount } = useMemo(() => {
    const classObj = CLASS_OPTIONS.find((c) => c.id === selectedClass) || CLASS_OPTIONS[2];
    const base = classObj.fee;
    const scholarPercent = Number(scholarship) || 0;
    const paymentDiscountPercent = paymentType === 'one-time' ? 5 : 0;
    const totalDiscountPercent = scholarPercent + paymentDiscountPercent;
    const discount = Math.round((base * totalDiscountPercent) / 100);
    const final = base - discount;
    const perInstallment = Math.round(final / 2);

    return {
      baseFee: base,
      discountPercentage: totalDiscountPercent,
      discountAmount: discount,
      finalFee: final,
      installmentAmount: perInstallment,
    };
  }, [selectedClass, paymentType, scholarship]);

  const handleApply = () => {
    const selectedClassObj = CLASS_OPTIONS.find((c) => c.id === selectedClass);
    if (onEnrollClick) {
      onEnrollClick({
        selectedClass,
        className: selectedClassObj?.name,
        paymentType,
        scholarship: Number(scholarship),
        baseFee,
        discountAmount,
        finalFee,
      });
    }
  };

  return (
    <section
      id="fee-calculator"
      style={{
        background: 'var(--slate-900)',
        color: '#ffffff',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, rgba(15, 23, 42, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Information & Value Proposition */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: 'var(--brand-200)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={14} color="var(--brand-200)" />
              <span>Transparent Pricing</span>
            </div>

            <h3
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Interactive Fee Estimator
            </h3>

            <p
              style={{
                color: 'var(--slate-400)',
                fontSize: '1.05rem',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
                maxWidth: '34rem',
              }}
            >
              Estimate your comprehensive educational investment in seconds. At Yash Tutorials, we provide honest, transparent fees with zero hidden charges, complete test evaluation series, and all physical study packages included.
            </p>

            {/* 3 Feature Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Feature 1 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'rgba(52, 211, 153, 0.12)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={22} color="var(--emerald-400)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    No hidden costs / study material included
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', lineHeight: 1.5 }}>
                    Printed concept modules, question banks, and complete test series are included with no additional registration fee.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'rgba(251, 191, 36, 0.12)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={22} color="var(--amber-400)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Merit Scholarships up to 30% available
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', lineHeight: 1.5 }}>
                    Exceptional school performers and entrance test achievers can qualify for direct tuition fee waivers.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: 'var(--radius-xl)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CreditCard size={22} color="#818cf8" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Easy monthly installment plans
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', lineHeight: 1.5 }}>
                    Convenient split-payment schedules designed to ease parents' financial budgeting without any penalty.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculator Card */}
          <div>
            <div
              style={{
                background: 'var(--slate-800)',
                padding: '2.25rem 2rem',
                borderRadius: '1.875rem',
                border: '1px solid var(--slate-700)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.75rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(51, 65, 85, 0.8)',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brand-200)',
                      display: 'block',
                    }}
                  >
                    Tuition Calculator
                  </span>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    Customize Your Package
                  </h4>
                </div>
                <div
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(52, 211, 153, 0.15)',
                    color: 'var(--emerald-400)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Academic Year 2026-27
                </div>
              </div>

              {/* Form Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* 1. Select Class */}
                <div>
                  <label
                    htmlFor="calc-class-select"
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--slate-300)',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    1. Select Academic Class:
                  </label>
                  <select
                    id="calc-class-select"
                    className="form-input-dark"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="8th">8th (₹25,000)</option>
                    <option value="9th">9th (₹30,000)</option>
                    <option value="10th">10th (₹35,000)</option>
                    <option value="11th Sci">11th Sci (₹45,000)</option>
                    <option value="12th Sci">12th Sci (₹50,000)</option>
                    <option value="JEE/NEET">JEE/NEET (₹85,000)</option>
                  </select>
                </div>

                {/* 2. Payment Schedule */}
                <div>
                  <label
                    htmlFor="calc-schedule-select"
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--slate-300)',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    2. Payment Schedule:
                  </label>
                  <select
                    id="calc-schedule-select"
                    className="form-input-dark"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="one-time">One-Time (5% Extra Discount)</option>
                    <option value="installment">Installment (2 Parts)</option>
                  </select>
                </div>

                {/* 3. Scholarship */}
                <div>
                  <label
                    htmlFor="calc-scholarship-select"
                    style={{
                      display: 'block',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--slate-300)',
                      marginBottom: '0.5rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    3. Merit / Early Scholarship:
                  </label>
                  <select
                    id="calc-scholarship-select"
                    className="form-input-dark"
                    value={scholarship}
                    onChange={(e) => setScholarship(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="0">None</option>
                    <option value="10">Class Ranker 10%</option>
                    <option value="15">Early Bird 15%</option>
                  </select>
                </div>

                {/* Fee Breakdown Card */}
                <div
                  style={{
                    marginTop: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.85)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--slate-700)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: 'var(--slate-400)',
                    }}
                  >
                    <span>Standard Base Fee:</span>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>
                      ₹{baseFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: 'var(--emerald-400)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Check size={14} /> Total Discount ({discountPercentage}%):
                    </span>
                    <span style={{ fontWeight: 700 }}>
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div
                    style={{
                      borderTop: '1px dashed var(--slate-700)',
                      paddingTop: '0.875rem',
                      marginTop: '0.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--slate-400)',
                          display: 'block',
                        }}
                      >
                        Net Payable Fee
                      </span>
                      {paymentType === 'installment' && (
                        <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>
                          (₹{installmentAmount.toLocaleString('en-IN')} x 2 installments)
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '1.875rem',
                        fontWeight: 800,
                        color: '#818cf8',
                        letterSpacing: '-0.025em',
                      }}
                    >
                      ₹{finalFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={handleApply}
                  className="btn btn-primary btn-full"
                  style={{
                    padding: '0.95rem 1.5rem',
                    fontSize: '0.95rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Apply for Scholarship & Admission</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
