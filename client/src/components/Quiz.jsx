import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    question: "What is the unit of Electric Current in the SI system?",
    category: "Class 10 - Physics",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    correct: 1,
  },
  {
    question: "Which organelle is known as the 'Powerhouse of the Cell'?",
    category: "Class 9 - Biology",
    options: ["Ribosome", "Golgi Apparatus", "Mitochondria", "Nucleus"],
    correct: 2,
  },
  {
    question: "If pH of a solution is 2, the solution is:",
    category: "Class 10 - Chemistry",
    options: ["Strongly Acidic", "Weakly Basic", "Neutral", "Strongly Basic"],
    correct: 0,
  },
];

export default function Quiz() {
  const [questions, setQuestions] = useState(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    axios.get('/api/quiz/questions')
      .then((res) => {
        if (res.data?.data?.length > 0) {
          setQuestions(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const currentQuestion = questions[currentIndex] || QUIZ_QUESTIONS[0];
  const totalQuestions = questions.length;

  const handleOptionSelect = (optionIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    setSelectedAnswer(optionIndex);
    if (optionIndex === currentQuestion.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Final question reached - calculate final score
      const finalScore = score;
      setShowResult(true);

      // Submit attempt to server silently
      axios
        .post('/api/quiz/attempts', {
          score: finalScore,
          totalQuestions: totalQuestions,
        })
        .catch(() => {
          // catch silently as required
        });
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <section
      id="quiz"
      style={{
        background: '#ffffff',
        padding: '5rem 0',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
            <Sparkles size={14} color="var(--brand-600)" />
            <span>Interactive Test</span>
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
            Quick 3-Question Practice Quiz
          </h2>

          <p
            style={{
              color: 'var(--slate-600)',
              fontSize: '1rem',
              maxWidth: '36rem',
              margin: '0 auto',
            }}
          >
            Challenge yourself with core concept questions from Class 9 & 10 Science. Test your intuition and preparation level in under two minutes!
          </p>
        </div>

        {/* Quiz Container Box */}
        <div
          style={{
            background: 'var(--slate-50)',
            border: '1px solid var(--slate-200)',
            borderRadius: '1.875rem',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {!showResult ? (
            <div>
              {/* Top Progress Bar and Meta */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: 'var(--slate-700)',
                    }}
                  >
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <div
                    style={{
                      height: '0.5rem',
                      width: '6rem',
                      background: 'var(--slate-200)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                        background: 'var(--brand-600)',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div
                  className="badge badge-brand"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <BookOpen size={13} />
                  <span>{currentQuestion.category}</span>
                </div>
              </div>

              {/* Question Text */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--slate-900)',
                  lineHeight: 1.45,
                  marginBottom: '1.75rem',
                }}
              >
                {currentQuestion.question}
              </h3>

              {/* Option Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  marginBottom: '1.5rem',
                }}
              >
                {currentQuestion.options.map((option, idx) => {
                  let optionClass = 'quiz-option';
                  if (selectedAnswer !== null) {
                    if (idx === currentQuestion.correct) {
                      optionClass += ' correct';
                    } else if (idx === selectedAnswer) {
                      optionClass += ' incorrect';
                    }
                  }

                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={optionClass}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleOptionSelect(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        padding: '1rem 1.25rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '1.75rem',
                          height: '1.75rem',
                          borderRadius: 'var(--radius-md)',
                          background:
                            selectedAnswer !== null && idx === currentQuestion.correct
                              ? 'var(--emerald-500)'
                              : selectedAnswer !== null && idx === selectedAnswer
                              ? '#ef4444'
                              : 'var(--slate-100)',
                          color:
                            selectedAnswer !== null &&
                            (idx === currentQuestion.correct || idx === selectedAnswer)
                              ? '#ffffff'
                              : 'var(--slate-700)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          flexShrink: 0,
                          transition: 'background 0.2s',
                        }}
                      >
                        {optionLetters[idx]}
                      </span>
                      <span style={{ fontSize: '0.9375rem', flexGrow: 1 }}>{option}</span>
                      {selectedAnswer !== null && idx === currentQuestion.correct && (
                        <CheckCircle2 size={18} color="var(--emerald-600)" />
                      )}
                      {selectedAnswer !== null &&
                        idx === selectedAnswer &&
                        idx !== currentQuestion.correct && (
                          <XCircle size={18} color="#ef4444" />
                        )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Action Section */}
              {selectedAnswer !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--slate-200)',
                  }}
                >
                  {/* Feedback Message */}
                  <div>
                    {selectedAnswer === currentQuestion.correct ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--emerald-600)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                        }}
                      >
                        <CheckCircle2 size={20} color="var(--emerald-500)" />
                        <span>Correct Answer! Well done.</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                        }}
                      >
                        <XCircle size={20} color="#ef4444" />
                        <span>
                          Incorrect Answer. Correct: "
                          {currentQuestion.options[currentQuestion.correct]}"
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Next Question Button */}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn btn-primary"
                    style={{
                      padding: '0.75rem 1.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>
                      {currentIndex === totalQuestions - 1 ? 'View Final Results' : 'Next Question'}
                    </span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Result View */
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '2px solid var(--amber-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Award size={40} color="var(--amber-500)" />
              </div>

              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--brand-600)',
                  marginBottom: '0.5rem',
                  display: 'block',
                }}
              >
                Performance Report
              </span>

              <h3
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--slate-900)',
                  letterSpacing: '-0.025em',
                  marginBottom: '0.75rem',
                }}
              >
                Quiz Completed!
              </h3>

              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--slate-800)',
                  marginBottom: '0.75rem',
                }}
              >
                You scored{' '}
                <span
                  style={{
                    color: 'var(--brand-600)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                  }}
                >
                  {score}
                </span>{' '}
                out of {totalQuestions}
              </div>

              <p
                style={{
                  color: 'var(--slate-600)',
                  fontSize: '0.9375rem',
                  maxWidth: '28rem',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                {score === 3
                  ? 'Outstanding score! Your fundamental grasp in science is rock solid. Keep challenging yourself!'
                  : score === 2
                  ? 'Great effort! A quick revision of core concepts will help you achieve a perfect score.'
                  : 'Good attempt! Yash Tutorials provides dedicated doubt-clearing sessions to build unshakable conceptual fundamentals.'}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  className="btn btn-outline"
                  style={{
                    padding: '0.75rem 1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Retake Practice Quiz</span>
                </button>

                <a
                  href="#contact"
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>Book Free Counseling Session</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
