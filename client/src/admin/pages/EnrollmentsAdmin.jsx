import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Phone, Trash2, RefreshCw, FileText, X, Check, UserCheck } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function EnrollmentsAdmin() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Notes Modal state
  const [notesRecord, setNotesRecord] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEnrollments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/enrollments', {
        params: { search, status: statusFilter, page, limit: 15 }
      });
      if (res.data?.success) {
        setEnrollments(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEnrollments(1);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/admin/enrollments/${id}`, { status: newStatus });
      setEnrollments((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error('Failed to update enrollment status', err);
    }
  };

  const openNotesModal = (item) => {
    setNotesRecord(item);
    setNotesText(item.notes || '');
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!notesRecord) return;
    try {
      setSavingNotes(true);
      await axios.patch(`/api/admin/enrollments/${notesRecord._id}`, { notes: notesText.trim() });
      setEnrollments((prev) =>
        prev.map((item) => (item._id === notesRecord._id ? { ...item, notes: notesText.trim() } : item))
      );
      setNotesRecord(null);
    } catch (err) {
      console.error('Failed to save notes', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/enrollments/${deleteId}`);
      setEnrollments((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete enrollment', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Free Demo Class Registrations
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
          Real student bookings submitted through the Demo Modal and Hero CTAs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, phone, or course..."
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.35rem',
                borderRadius: '0.625rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.8125rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.625rem',
              background: '#0f172a',
              color: 'white',
              fontSize: '0.8125rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: '0.625rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.8125rem',
              background: 'white',
              fontWeight: 600,
              color: '#334155',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Registrations</option>
            <option value="Pending">Pending (New)</option>
            <option value="Contacted">Contacted by Counselor</option>
            <option value="Enrolled">Confirmed Enrolled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading registrations...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <UserCheck size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>No registrations found</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
              Student demo bookings will appear here automatically.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Student Name</th>
                  <th style={{ padding: '1rem 1rem' }}>Phone Number</th>
                  <th style={{ padding: '1rem 1rem' }}>Selected Course</th>
                  <th style={{ padding: '1rem 1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1rem' }}>Counselor Notes</th>
                  <th style={{ padding: '1rem 1rem' }}>Registered Date</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#0f172a' }}>
                      {item.studentName}
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      <a
                        href={`tel:${item.phone}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}
                      >
                        <Phone size={13} />
                        <span>{item.phone}</span>
                      </a>
                    </td>

                    <td style={{ padding: '1rem 1rem', color: '#334155', fontWeight: 600 }}>
                      {item.course}
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <select
                        value={item.status || 'Pending'}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          background: item.status === 'Enrolled' ? '#ecfdf5' : item.status === 'Contacted' ? '#e0e7ff' : item.status === 'Closed' ? '#f1f5f9' : '#fef3c7',
                          color: item.status === 'Enrolled' ? '#065f46' : item.status === 'Contacted' ? '#3730a3' : item.status === 'Closed' ? '#475569' : '#92400e',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <button
                        onClick={() => openNotesModal(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0',
                          background: item.notes ? '#eef2ff' : '#f8fafc',
                          color: item.notes ? '#4338ca' : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <FileText size={13} />
                        <span>{item.notes ? 'View Notes' : 'Add Note'}</span>
                      </button>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setDeleteId(item._id)}
                        title="Delete Record"
                        style={{
                          padding: '0.35rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.8125rem' }}>
            <span style={{ color: '#64748b' }}>
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchEnrollments(pagination.page - 1)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchEnrollments(pagination.page + 1)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Counselor Notes Modal */}
      {notesRecord && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setNotesRecord(null)}
        >
          <div style={{ width: '100%', maxWidth: '28rem', background: 'white', borderRadius: '1.25rem', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Counselor Follow-Up Notes
              </h3>
              <button onClick={() => setNotesRecord(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>{notesRecord.studentName}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{notesRecord.course} • {notesRecord.phone}</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Internal Follow-Up Notes:
                </label>
                <textarea
                  rows={4}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="e.g. Spoke to parent on Friday. Interested in batch starting Nov 1. Offered 10% merit discount."
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setNotesRecord(null)}
                  disabled={savingNotes}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNotes}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#4f46e5', color: 'white', fontSize: '0.8125rem', fontWeight: 700, cursor: savingNotes ? 'not-allowed' : 'pointer' }}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Demo Enrollment"
        message="Are you sure you want to delete this demo registration record?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
