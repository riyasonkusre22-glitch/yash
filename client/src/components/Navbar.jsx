import { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';

export default function Navbar({ onEnrollClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Courses & Classes', href: '#courses' },
    { name: 'Top Achievers', href: '#results' },
    { name: 'Fee Structure', href: '#fee-calculator' },
    { name: 'Practice Quiz', href: '#quiz' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: '5rem',
        borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--brand-600)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.125rem',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
            }}
          >
            YT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.025em',
                color: 'var(--slate-900)',
                lineHeight: 1,
              }}
            >
              YASH
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--brand-600)',
                lineHeight: 1.2,
              }}
            >
              Tutorials
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--slate-700)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--brand-600)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--slate-700)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Phone & Enroll Button */}
        <div
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <a
            href="tel:+919876543210"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--slate-700)',
            }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'var(--brand-50)',
                color: 'var(--brand-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={15} />
            </div>
            <span>+91 98765 43210</span>
          </a>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onEnrollClick}
          >
            Enroll Now
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="hide-desktop"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0.5rem',
            color: 'var(--slate-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div
          className="hide-desktop glass"
          style={{
            position: 'absolute',
            top: '5rem',
            left: 0,
            right: 0,
            borderBottom: '1px solid var(--slate-200)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            animation: 'slideDown 0.3s ease-out',
            background: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--slate-800)',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--slate-100)',
              }}
            >
              {link.name}
            </a>
          ))}

          <a
            href="tel:+919876543210"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: 'var(--slate-700)',
              padding: '0.5rem 0',
            }}
          >
            <Phone size={16} color="var(--brand-600)" />
            <span>+91 98765 43210</span>
          </a>

          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={() => {
              setIsMenuOpen(false);
              if (onEnrollClick) onEnrollClick();
            }}
          >
            Enroll Now
          </button>
        </div>
      )}
    </header>
  );
}
