import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Phone, Trash2, RefreshCw, Eye, X, Inbox } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Detail Modal state
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/inquiries', {
        params: { search, status: statusFilter, page, limit: 15 }
      });
      if (res.data?.success) {
        setInquiries(res.data.data);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInquiries(1);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/admin/inquiries/${id}`, { status: newStatus });
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      if (activeInquiry && activeInquiry._id === id) {
        setActiveInquiry((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update inquiry status', err);
    }
  };

  const openDetailModal = (item) => {
    setActiveInquiry(item);
    setNotesText(item.notes || '');
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!activeInquiry) return;
    try {
      setSavingNotes(true);
      await axios.patch(`/api/admin/inquiries/${activeInquiry._id}`, { notes: notesText.trim() });
      setInquiries((prev) =>
        prev.map((item) => (item._id === activeInquiry._id ? { ...item, notes: notesText.trim() } : item))
      );
      setActiveInquiry((prev) => ({ ...prev, notes: notesText.trim() }));
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
      await axios.delete(`/api/admin/inquiries/${deleteId}`);
      setInquiries((prev) => prev.filter((item) => item._id !== deleteId));
      if (activeInquiry && activeInquiry._id === deleteId) {
        setActiveInquiry(null);
      }
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete inquiry', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Contact Inquiries & Questions
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
          Real messages submitted by prospective students and parents through the Contact Form.
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
              placeholder="Search by student name, phone, or message text..."
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
            <option value="all">All Inquiries</option>
            <option value="New">New (Uncontacted)</option>
            <option value="In Progress">In Progress</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Inbox size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>No inquiries found</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
              Messages submitted from the website contact section will appear here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Student & Phone</th>
                  <th style={{ padding: '1rem 1rem' }}>Preference & Timing</th>
                  <th style={{ padding: '1rem 1rem' }}>Message Snippet</th>
                  <th style={{ padding: '1rem 1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1rem' }}>Date</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.studentName}</div>
                      <a
                        href={`tel:${item.parentPhone}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
                      >
                        <Phone size={12} />
                        <span>{item.parentPhone}</span>
                      </a>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.8125rem' }}>
                      <div style={{ color: '#334155', fontWeight: 600 }}>{item.classPreference || 'General'}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.preferredTime || 'Any Time'}</div>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.8125rem', color: '#475569', maxWidth: '20rem' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.message || '—'}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <select
                        value={item.status || 'New'}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          background: item.status === 'Resolved' ? '#ecfdf5' : item.status === 'Contacted' ? '#e0e7ff' : item.status === 'In Progress' ? '#fef3c7' : '#fee2e2',
                          color: item.status === 'Resolved' ? '#065f46' : item.status === 'Contacted' ? '#3730a3' : item.status === 'In Progress' ? '#92400e' : '#b91c1c',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openDetailModal(item)}
                          title="View Full Inquiry"
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            color: '#334155',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>
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
                      </div>
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
                onClick={() => fetchInquiries(pagination.page - 1)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchInquiries(pagination.page + 1)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {activeInquiry && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setActiveInquiry(null)}
        >
          <div style={{ width: '100%', maxWidth: '32rem', background: 'white', borderRadius: '1.25rem', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Inquiry Details & Message
              </h3>
              <button onClick={() => setActiveInquiry(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Student</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>{activeInquiry.studentName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Parent Contact</div>
                  <a href={`tel:${activeInquiry.parentPhone}`} style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#4f46e5', textDecoration: 'none' }}>
                    {activeInquiry.parentPhone}
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Program Preference</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>{activeInquiry.classPreference || 'Not Specified'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Batch Time</div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>{activeInquiry.preferredTime || 'Flexible'}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Parent / Student Message:
                </div>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', background: '#f1f5f9', color: '#1e293b', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {activeInquiry.message || 'No specific message written.'}
                </div>
              </div>

              <form onSubmit={handleSaveNotes} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                  Counselor Notes:
                </label>
                <textarea
                  rows={3}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="e.g. Called parent. Scheduled in-person counseling for Tuesday."
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveInquiry(null)}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Close
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
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Inquiry Record"
        message="Are you sure you want to delete this parent inquiry record?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
