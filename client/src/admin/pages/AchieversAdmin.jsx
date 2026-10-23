import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Trophy, RefreshCw, X } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const INITIAL_FORM = {
  name: '',
  initials: '',
  achievement: '',
  batch: 'Batch of 2025',
  quote: '',
  badgeVariant: 'badge-amber',
  bgColor: '#c7d2fe',
  textColor: '#3730a3',
  isActive: true,
  order: 0
};

export default function AchieversAdmin() {
  const [achievers, setAchievers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAchievers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/achievers');
      if (res.data?.success) {
        setAchievers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch achievers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievers();
  }, []);

  const openAddModal = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setCurrentId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (achiever) => {
    setFormData({
      name: achiever.name,
      initials: achiever.initials,
      achievement: achiever.achievement,
      batch: achiever.batch || 'Batch of 2025',
      quote: achiever.quote,
      badgeVariant: achiever.badgeVariant || 'badge-amber',
      bgColor: achiever.bgColor || '#c7d2fe',
      textColor: achiever.textColor || '#3730a3',
      isActive: achiever.isActive !== false,
      order: achiever.order || 0
    });
    setIsEditing(true);
    setCurrentId(achiever._id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveAchiever = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.achievement.trim() || !formData.quote.trim()) {
      setFormError('Name, achievement score, and student quote are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (isEditing) {
        await axios.patch(`/api/admin/achievers/${currentId}`, formData);
      } else {
        await axios.post('/api/admin/achievers', formData);
      }
      setIsModalOpen(false);
      fetchAchievers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving student record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/achievers/${deleteId}`);
      setAchievers((prev) => prev.filter((a) => a._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete achiever', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Student Achievers (Hall of Fame)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Showcase top rankers, board percentiles, and student success stories.
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
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>Add New Achiever</span>
        </button>
      </div>

      {/* Grid of Achievers */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
          <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading toppers...</p>
        </div>
      ) : achievers.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '4rem', textAlign: 'center' }}>
          <Trophy size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>No Achievers Found</h4>
          <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
            Add student toppers to showcase results on the public website.
          </p>
          <button
            onClick={openAddModal}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#059669', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}
          >
            Add Student Topper
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {achievers.map((item) => (
            <div
              key={item._id}
              style={{
                background: 'white',
                borderRadius: '1.25rem',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      background: item.bgColor || '#c7d2fe',
                      color: item.textColor || '#3730a3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.125rem',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    {item.initials}
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      background: item.bgColor ? `${item.bgColor}30` : '#fef3c7',
                      color: item.textColor || '#92400e',
                      border: `1px solid ${item.bgColor || '#fde68a'}`
                    }}
                  >
                    {item.achievement}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                  {item.name}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  {item.batch}
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                  "{item.quote}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    background: item.isActive !== false ? '#ecfdf5' : '#f1f5f9',
                    color: item.isActive !== false ? '#065f46' : '#64748b'
                  }}
                >
                  {item.isActive !== false ? 'Live on Site' : 'Hidden'}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit"
                    style={{ padding: '0.35rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    title="Delete"
                    style={{ padding: '0.35rem', borderRadius: '0.5rem', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Achiever Modal */}
      {isModalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '32rem', background: 'white', borderRadius: '1.25rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEditing ? 'Edit Student Achiever' : 'Add Student Achiever'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAchiever} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.8125rem' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yash Agarwal"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Initials
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.initials}
                    onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                    placeholder="YA"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Achievement / Score *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.achievement}
                    onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                    placeholder="98.6% - 10th CBSE or AIR 412"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Batch / Year
                  </label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="Batch of 2025"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Student Testimonial / Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="The systematic test series and faculty mentorship at Yash Tutorials made the difference..."
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="achieverActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <label htmlFor="achieverActive" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Display in public Hall of Fame section
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
                  style={{ padding: '0.625rem 1.5rem', borderRadius: '0.625rem', border: 'none', background: '#059669', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: formSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {formSubmitting ? 'Saving...' : isEditing ? 'Update Achiever' : 'Add Achiever'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Student Achiever"
        message="Are you sure you want to remove this topper record? It will be permanently removed from MongoDB."
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
