import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CompassIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tour Packages', href: '/packages' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Plan Your Trip', href: '/quote' },
];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[52px] w-full items-center justify-between gap-4 px-4 py-1.5 sm:px-8">
        {/* Logo on the far left */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5" aria-label="Wanderlust Destinations home">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-navy text-white">
            <CompassIcon size={18} />
          </span>
          <span className="text-base font-bold tracking-tight sm:text-[1.05rem]">Wanderlust Destinations</span>
        </Link>

        {/* Centered nav links on desktop */}
        <nav className="hidden md:flex md:flex-1 md:justify-center md:items-center">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`text-[0.88rem] font-medium transition-colors hover:text-accent-dark ${
                    location.pathname === link.href ? 'text-accent' : 'text-ink-soft'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile burger button */}
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="main-nav"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="relative block h-0.5 w-5 rounded bg-ink">
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-transform ${isOpen ? 'top-0 rotate-45' : '-top-1.5'}`} />
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-transform ${isOpen ? 'top-0 -rotate-45' : 'top-1.5'}`} />
          </span>
        </button>

        {/* Profile section (auth or login) on the far right */}
        {!isOpen && (
          <div className="hidden md:flex md:items-center">
            {!loading && (
              isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    {user.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="rounded-lg border border-line px-4 py-1.5 text-sm font-semibold text-ink-soft transition hover:border-accent hover:text-accent"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-ink-soft transition-colors hover:text-accent"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-lg bg-navy px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1b2a57]"
                  >
                    Sign up
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Mobile dropdown panel */}
      <nav
        id="main-nav"
        aria-label="Primary"
        className={`${isOpen ? 'flex' : 'hidden'} md:hidden`}
      >
        <div className="flex flex-col gap-4 border-b border-line bg-surface px-4 pb-6 shadow-lg">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={closeMenu}
                  className={`block py-2 text-[0.95rem] font-medium transition-colors hover:text-accent ${
                    location.pathname === link.href ? 'text-accent' : 'text-ink-soft'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {!loading && (
            <div className="pt-3 border-t border-line">
              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    {user.name}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg border border-line px-4 py-1.5 text-sm font-semibold text-ink-soft transition hover:border-accent hover:text-accent"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-sm font-medium text-ink-soft transition-colors hover:text-accent"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-lg bg-navy px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1b2a57]"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;