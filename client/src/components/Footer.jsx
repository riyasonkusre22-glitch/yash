import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--slate-900)', color: 'var(--slate-400)', padding: '3rem 0', borderTop: '1px solid var(--slate-800)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--brand-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>YT</div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.125rem' }}>Yash Tutorials</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#about" style={{ transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='var(--slate-400)'}>About</a>
            <a href="#courses" style={{ transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='var(--slate-400)'}>Courses</a>
            <a href="#results" style={{ transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='var(--slate-400)'}>Results</a>
            <a href="#fee-calculator" style={{ transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='var(--slate-400)'}>Fees</a>
            <a href="#contact" style={{ transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='white'} onMouseLeave={e=>e.target.style.color='var(--slate-400)'}>Contact</a>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>© 2026 Yash Tutorials. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
