import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  BookOpen
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const INITIAL_FORM = {
  title: '',
  category: 'school',
  subtitle: '',
  badge: '',
  headerClass: 'course-header-school',
  baseFee: 35000,
  order: 0,
  isActive: true,
  subjectsText: '',
  featuresText: ''
};

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/courses', {
        params: { search, category: categoryFilter }
      });
      if (res.data?.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const openAddModal = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setCurrentId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setFormData({
      title: course.title,
      category: course.category,
      subtitle: course.subtitle,
      badge: course.badge || '',
      headerClass: course.headerClass || 'course-header-school',
      baseFee: course.baseFee || 35000,
      order: course.order || 0,
      isActive: course.isActive !== false,
      subjectsText: (course.subjects || []).join('\n'),
      featuresText: (course.features || []).join('\n')
    });
    setIsEditing(true);
    setCurrentId(course._id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.subtitle.trim()) {
      setFormError('Please enter a course title and subtitle.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      subtitle: formData.subtitle.trim(),
      badge: formData.badge.trim(),
      headerClass: formData.headerClass,
      baseFee: Number(formData.baseFee) || 0,
      order: Number(formData.order) || 0,
      isActive: formData.isActive,
      subjects: formData.subjectsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      features: formData.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)
    };

    try {
      setFormSubmitting(true);
      if (isEditing) {
        await axios.patch(`/api/admin/courses/${currentId}`, payload);
      } else {
        await axios.post('/api/admin/courses', payload);
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving course record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`/api/admin/courses/${id}/toggle-status`);
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err) {
      console.error('Failed to toggle course status', err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/courses/${deleteId}`);
      setCourses((prev) => prev.filter((c) => c._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete course', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Courses & Programs
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Manage published curriculums, subjects, fee benchmarks, and public website visibility.
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
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>Add New Course</span>
        </button>
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
              placeholder="Search by title, badge, or subtitle..."
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
            Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            <option value="all">All Categories</option>
            <option value="school">School (8th - 10th)</option>
            <option value="science">11th - 12th Science</option>
            <option value="competitive">Competitive Entrance</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
        }}
      >
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <BookOpen size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>No courses found</h4>
            <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.8125rem', color: '#94a3b8' }}>
              No curriculums match your search or filter.
            </p>
            <button
              onClick={openAddModal}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              Add First Course
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Course Program</th>
                  <th style={{ padding: '1rem 1rem' }}>Category</th>
                  <th style={{ padding: '1rem 1rem' }}>Base Fee</th>
                  <th style={{ padding: '1rem 1rem' }}>Subjects</th>
                  <th style={{ padding: '1rem 1rem' }}>Public Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{course.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{course.subtitle}</div>
                      {course.badge && (
                        <span
                          style={{
                            display: 'inline-block',
                            marginTop: '0.25rem',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            background: '#e0e7ff',
                            color: '#3730a3'
                          }}
                        >
                          {course.badge}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '0.5rem',
                          background: course.category === 'school' ? '#f0fdf4' : course.category === 'science' ? '#eff6ff' : '#faf5ff',
                          color: course.category === 'school' ? '#166534' : course.category === 'science' ? '#1e40af' : '#6b21a8'
                        }}
                      >
                        {course.category}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      ₹{course.baseFee?.toLocaleString('en-IN') || 0}
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.8125rem', color: '#64748b' }}>
                      {course.subjects?.length || 0} subjects • {course.features?.length || 0} features
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <button
                        onClick={() => handleToggleStatus(course._id)}
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
                          background: course.isActive ? '#ecfdf5' : '#f1f5f9',
                          color: course.isActive ? '#065f46' : '#64748b'
                        }}
                      >
                        {course.isActive ? <CheckCircle size={14} color="#10b981" /> : <XCircle size={14} color="#94a3b8" />}
                        <span>{course.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(course)}
                          title="Edit Course"
                          style={{
                            padding: '0.4rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => setDeleteId(course._id)}
                          title="Delete Course"
                          style={{
                            padding: '0.4rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
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

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '38rem',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEditing ? 'Edit Course Program' : 'Create New Course Program'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveCourse} style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.8125rem' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Secondary Foundation"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="school">School (Class 8th - 10th)</option>
                    <option value="science">Class 11th - 12th Science</option>
                    <option value="competitive">NEET / JEE Competitive Prep</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Subtitle / Classes *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Class 8th, 9th & 10th"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. State & CBSE Board"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Base Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.baseFee}
                    onChange={(e) => setFormData({ ...formData, baseFee: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Header Theme
                  </label>
                  <select
                    value={formData.headerClass}
                    onChange={(e) => setFormData({ ...formData, headerClass: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="course-header-school">Indigo / Purple</option>
                    <option value="course-header-science">Emerald / Green</option>
                    <option value="course-header-competitive">Amber / Crimson</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Subjects (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.subjectsText}
                  onChange={(e) => setFormData({ ...formData, subjectsText: e.target.value })}
                  placeholder="Mathematics&#10;Science (Phy/Chem/Bio)&#10;English"
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Features & Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Board Exam-focused Prep&#10;NTSE & Olympiad Orientation&#10;Weekly Chapter Mock Tests"
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="courseActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                />
                <label htmlFor="courseActive" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  Publish this course on the public website
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
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
                  style={{ padding: '0.625rem 1.5rem', borderRadius: '0.625rem', border: 'none', background: '#4f46e5', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: formSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {formSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Course Program"
        message="Are you sure you want to delete this course? It will be permanently removed from MongoDB and no longer appear on the public website."
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
