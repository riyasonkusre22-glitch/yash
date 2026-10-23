import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Star, RefreshCw, X, MessageSquareQuote, CheckCircle, XCircle } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const INITIAL_FORM = {
  author: '',
  role: '',
  rating: 5,
  quote: '',
  isApproved: true,
  order: 0
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/testimonials');
      if (res.data?.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setCurrentId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setFormData({
      author: t.author,
      role: t.role,
      rating: t.rating || 5,
      quote: t.quote,
      isApproved: t.isApproved !== false,
      order: t.order || 0
    });
    setIsEditing(true);
    setCurrentId(t._id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.author.trim() || !formData.role.trim() || !formData.quote.trim()) {
      setFormError('Author name, role, and quote text are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (isEditing) {
        await axios.patch(`/api/admin/testimonials/${currentId}`, formData);
      } else {
        await axios.post('/api/admin/testimonials', formData);
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving testimonial.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      await axios.patch(`/api/admin/testimonials/${id}/toggle-approval`);
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isApproved: !t.isApproved } : t))
      );
    } catch (err) {
      console.error('Failed to toggle approval', err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/testimonials/${deleteId}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete testimonial', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Testimonials & Parent Reviews
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Moderate verified student and parent reviews shown on the public website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <MessageSquareQuote size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>No testimonials found</h4>
            <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.8125rem', color: '#94a3b8' }}>Add authorized parent or student feedback.</p>
            <button onClick={openAddModal} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#d97706', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
              Add Review
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Author & Credential</th>
                  <th style={{ padding: '1rem 1rem' }}>Rating</th>
                  <th style={{ padding: '1rem 1rem' }}>Review Feedback</th>
                  <th style={{ padding: '1rem 1rem' }}>Public Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.author}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.role}</div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.15rem' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.8125rem', color: '#475569', maxWidth: '28rem', lineHeight: 1.5 }}>
                      "{t.quote}"
                    </td>

                    <td style={{ padding: '1rem 1rem', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => handleToggleApproval(t._id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '9999px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: t.isApproved !== false ? '#ecfdf5' : '#fef2f2',
                          color: t.isApproved !== false ? '#065f46' : '#991b1b'
                        }}
                      >
                        {t.isApproved !== false ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                        <span>{t.isApproved !== false ? 'Approved' : 'Hidden'}</span>
                      </button>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(t)}
                          style={{ padding: '0.35rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(t._id)}
                          style={{ padding: '0.35rem', borderRadius: '0.5rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div style={{ width: '100%', maxWidth: '32rem', background: 'white', borderRadius: '1.25rem', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEditing ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.8125rem' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Mr. Rajesh Sharma"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Rating (Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Student / Parent Role *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Parent of Class 10th Student"
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Review Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Yash Tutorials transformed my son's attitude towards Science..."
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="testimonialApproved"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <label htmlFor="testimonialApproved" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Approved for public display
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitting}
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{ padding: '0.625rem 1.5rem', borderRadius: '0.625rem', border: 'none', background: '#d97706', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: formSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {formSubmitting ? 'Saving...' : isEditing ? 'Update Review' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Testimonial"
        message="Are you sure you want to permanently delete this testimonial review?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
