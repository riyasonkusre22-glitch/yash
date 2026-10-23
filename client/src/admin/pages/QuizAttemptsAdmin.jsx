import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function QuizAttemptsAdmin() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchAttempts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/quiz/attempts', {
        params: { page, limit: 15 }
      });
      if (res.data?.success) {
        setAttempts(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch quiz attempts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts(1);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Student Practice Quiz Activity
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
          Read-only audit log of student attempts submitted on the public practice quiz.
        </p>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading student attempts...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <FileText size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>No quiz attempts recorded yet</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
              When visitors complete the 3-question quiz on the website, their score appears here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Submission Date & Time</th>
                  <th style={{ padding: '1rem 1rem' }}>Score Earned</th>
                  <th style={{ padding: '1rem 1rem' }}>Total Questions</th>
                  <th style={{ padding: '1rem 1rem' }}>Accuracy Percentage</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Question Breakdown</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => {
                  const pct = att.totalQuestions > 0 ? Math.round((att.score / att.totalQuestions) * 100) : 0;
                  return (
                    <tr key={att._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.25rem', color: '#334155', fontWeight: 600 }}>
                        {att.createdAt
                          ? new Date(att.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '—'}
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                          {att.score}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1rem', color: '#64748b' }}>
                        {att.totalQuestions}
                      </td>

                      <td style={{ padding: '1rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            background: pct >= 80 ? '#ecfdf5' : pct >= 50 ? '#fef3c7' : '#fee2e2',
                            color: pct >= 80 ? '#065f46' : pct >= 50 ? '#92400e' : '#b91c1c'
                          }}
                        >
                          {pct}%
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        {att.answers && att.answers.length > 0 ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {att.answers.map((ans, aIdx) => (
                              <span
                                key={aIdx}
                                title={`Question ${ans.questionIndex + 1}: ${ans.isCorrect ? 'Correct' : 'Incorrect'}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.2rem',
                                  fontSize: '0.6875rem',
                                  fontWeight: 700,
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '0.35rem',
                                  background: ans.isCorrect ? '#ecfdf5' : '#fee2e2',
                                  color: ans.isCorrect ? '#15803d' : '#b91c1c'
                                }}
                              >
                                {ans.isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                <span>Q{ans.questionIndex + 1}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Standard attempt</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.8125rem' }}>
            <span style={{ color: '#64748b' }}>
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchAttempts(pagination.page - 1)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchAttempts(pagination.page + 1)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
