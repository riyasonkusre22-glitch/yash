import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, HelpCircle, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const INITIAL_FORM = {
  question: '',
  category: 'Class 10 - Physics',
  opt0: '',
  opt1: '',
  opt2: '',
  opt3: '',
  correct: 0,
  explanation: '',
  order: 0
};

export default function QuizAdmin() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/quiz/questions');
      if (res.data?.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch quiz questions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openAddModal = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setCurrentId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (q) => {
    setFormData({
      question: q.question,
      category: q.category,
      opt0: q.options?.[0] || '',
      opt1: q.options?.[1] || '',
      opt2: q.options?.[2] || '',
      opt3: q.options?.[3] || '',
      correct: q.correct ?? 0,
      explanation: q.explanation || '',
      order: q.order || 0
    });
    setIsEditing(true);
    setCurrentId(q._id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.question.trim() || !formData.category.trim()) {
      setFormError('Question text and category are required.');
      return;
    }

    const options = [formData.opt0.trim(), formData.opt1.trim(), formData.opt2.trim(), formData.opt3.trim()].filter(Boolean);
    if (options.length < 2) {
      setFormError('Please provide at least 2 non-empty options.');
      return;
    }

    if (formData.correct >= options.length) {
      setFormError('Please select a valid correct option.');
      return;
    }

    const payload = {
      question: formData.question.trim(),
      category: formData.category.trim(),
      options,
      correct: Number(formData.correct),
      explanation: formData.explanation.trim(),
      order: Number(formData.order) || 0
    };

    try {
      setFormSubmitting(true);
      if (isEditing) {
        await axios.patch(`/api/admin/quiz/questions/${currentId}`, payload);
      } else {
        await axios.post('/api/admin/quiz/questions', payload);
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving quiz question.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/quiz/questions/${deleteId}`);
      setQuestions((prev) => prev.filter((q) => q._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete question', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Practice Quiz Question Bank
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Manage interactive concept check questions shown in the student practice quiz.
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
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>Add Question</span>
        </button>
      </div>

      {/* Questions List */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <HelpCircle size={36} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>Question bank is empty</h4>
            <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.8125rem', color: '#94a3b8' }}>Add questions for students to practice online.</p>
            <button onClick={openAddModal} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#0284c7', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
              Add Question
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Question & Category</th>
                  <th style={{ padding: '1rem 1rem' }}>Options & Correct Answer</th>
                  <th style={{ padding: '1rem 1rem' }}>Explanation</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={q._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem', maxWidth: '20rem' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '0.15rem 0.5rem', borderRadius: '9999px', display: 'inline-block', marginBottom: '0.35rem' }}>
                        {q.category}
                      </span>
                      <div style={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                        {idx + 1}. {q.question}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {q.options?.map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correct;
                          return (
                            <div
                              key={oIdx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.75rem',
                                fontWeight: isCorrect ? 700 : 500,
                                color: isCorrect ? '#15803d' : '#64748b'
                              }}
                            >
                              {isCorrect ? <CheckCircle2 size={13} color="#16a34a" /> : <span style={{ width: '13px', display: 'inline-block', textAlign: 'center' }}>•</span>}
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem', fontSize: '0.75rem', color: '#64748b', maxWidth: '16rem', lineHeight: 1.4 }}>
                      {q.explanation || '—'}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(q)}
                          style={{ padding: '0.35rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#334155', cursor: 'pointer' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(q._id)}
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
          <div style={{ width: '100%', maxWidth: '34rem', background: 'white', borderRadius: '1.25rem', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isEditing ? 'Edit Quiz Question' : 'Add Quiz Question'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.8125rem' }}>
                  {formError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Question Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="What is the unit of Electric Current in the SI system?"
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Category & Class *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Class 10 - Physics or Class 9 - Biology"
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* 4 Answer Options with Radio */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  Answer Options (Select the correct radio button)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[0, 1, 2, 3].map((optIdx) => {
                    const key = `opt${optIdx}`;
                    return (
                      <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name="correctOption"
                          id={`radio_${optIdx}`}
                          checked={formData.correct === optIdx}
                          onChange={() => setFormData({ ...formData, correct: optIdx })}
                          style={{ cursor: 'pointer', width: '1.125rem', height: '1.125rem' }}
                        />
                        <input
                          type="text"
                          required={optIdx < 2}
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          placeholder={`Option ${optIdx + 1}${optIdx === 0 ? ' (e.g. Volt)' : optIdx === 1 ? ' (e.g. Ampere)' : ''}`}
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: formData.correct === optIdx ? '2px solid #10b981' : '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Explanation (Shown after answering)
                </label>
                <input
                  type="text"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Ampere is the SI unit named after André-Marie Ampère."
                  style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
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
                  style={{ padding: '0.625rem 1.5rem', borderRadius: '0.625rem', border: 'none', background: '#0284c7', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: formSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {formSubmitting ? 'Saving...' : isEditing ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Question"
        message="Are you sure you want to remove this practice quiz question?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
