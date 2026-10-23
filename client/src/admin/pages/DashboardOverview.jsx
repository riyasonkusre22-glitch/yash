import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Trophy,
  MessageSquareQuote,
  HelpCircle,
  UserCheck,
  Inbox,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/admin/stats');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <RefreshCw size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: '#4f46e5', marginBottom: '1rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Fetching live database statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '1rem', color: '#991b1b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <AlertCircle size={20} />
          <strong style={{ fontSize: '1rem' }}>Unable to load dashboard</strong>
        </div>
        <p style={{ fontSize: '0.875rem', margin: '0 0 1rem 0' }}>{error}</p>
        <button
          onClick={fetchStats}
          style={{
            padding: '0.5rem 1rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8125rem'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Courses',
      value: stats?.courses?.active || 0,
      sub: `${stats?.courses?.total || 0} total curriculum programs`,
      icon: BookOpen,
      bg: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
      path: '/admin/courses'
    },
    {
      title: 'Top Achievers',
      value: stats?.achievers?.active || 0,
      sub: 'NEET, JEE & Board toppers',
      icon: Trophy,
      bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      path: '/admin/achievers'
    },
    {
      title: 'Approved Reviews',
      value: stats?.testimonials?.approved || 0,
      sub: `${stats?.testimonials?.pending || 0} pending verification`,
      icon: MessageSquareQuote,
      bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      path: '/admin/testimonials'
    },
    {
      title: 'Demo Registrations',
      value: stats?.enrollments?.total || 0,
      sub: `${stats?.enrollments?.pending || 0} requiring counselor call`,
      icon: UserCheck,
      bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      path: '/admin/enrollments',
      highlightBadge: stats?.enrollments?.pending > 0 ? `${stats.enrollments.pending} Pending` : null
    },
    {
      title: 'Parent Inquiries',
      value: stats?.inquiries?.total || 0,
      sub: `${stats?.inquiries?.new || 0} uncontacted queries`,
      icon: Inbox,
      bg: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
      path: '/admin/inquiries',
      highlightBadge: stats?.inquiries?.new > 0 ? `${stats.inquiries.new} New` : null
    },
    {
      title: 'Quiz Activity',
      value: stats?.quiz?.totalAttempts || 0,
      sub: `${stats?.quiz?.questionsCount || 0} questions live in bank`,
      icon: HelpCircle,
      bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      path: '/admin/quiz'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          borderRadius: '1.25rem',
          padding: '2rem',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <TrendingUp size={16} />
          <span>Real-Time Academic Performance & Operations</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
          Welcome back to Yash Tutorials Control Panel
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '44rem', margin: 0, lineHeight: 1.6 }}>
          Manage your live curriculum, student toppers, incoming demo enrollments, parent inquiries, and interactive practice tests directly in synchronization with MongoDB Atlas.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.path}
              style={{
                textDecoration: 'none',
                background: 'white',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.875rem',
                    background: card.bg,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <Icon size={22} />
                </div>

                {card.highlightBadge && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      border: '1px solid #fde68a'
                    }}
                  >
                    {card.highlightBadge}
                  </span>
                )}
              </div>

              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginTop: '0.35rem' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {card.sub}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#4f46e5'
                }}
              >
                <span>Manage Section</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Tables for Recent Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Recent Demo Registrations */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Recent Demo Registrations
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                Latest online demo class booking submissions
              </p>
            </div>
            <Link
              to="/admin/enrollments"
              style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}
            >
              View All
            </Link>
          </div>

          {stats?.recentEnrollments?.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>
              No demo registrations recorded yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.recentEnrollments?.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.studentName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.course} • {item.phone}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      background: item.status === 'Enrolled' ? '#dcfce7' : item.status === 'Contacted' ? '#e0e7ff' : '#fef3c7',
                      color: item.status === 'Enrolled' ? '#15803d' : item.status === 'Contacted' ? '#3730a3' : '#92400e'
                    }}
                  >
                    {item.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div
          style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Recent Parent Inquiries
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                Latest questions submitted through the contact section
              </p>
            </div>
            <Link
              to="/admin/inquiries"
              style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}
            >
              View All
            </Link>
          </div>

          {stats?.recentInquiries?.length === 0 ? (
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>
              No parent inquiries received yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats?.recentInquiries?.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.studentName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.message || item.classPreference || item.parentPhone}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      background: item.status === 'Resolved' ? '#dcfce7' : item.status === 'Contacted' ? '#e0e7ff' : '#fee2e2',
                      color: item.status === 'Resolved' ? '#15803d' : item.status === 'Contacted' ? '#3730a3' : '#b91c1c',
                      flexShrink: 0
                    }}
                  >
                    {item.status || 'New'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
