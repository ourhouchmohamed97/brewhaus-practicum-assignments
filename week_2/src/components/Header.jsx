import { useState } from 'react';
import { CompassIcon } from './Icons';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tour Packages', href: '#packages' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Plan Your Trip', href: '#quote' },
];

function Header() {
  // useState #1: is the mobile menu open?
  // - isOpen is the current value (false at first)
  // - setIsOpen is the ONLY way to change it. Calling it makes React re-render
  //   this component, so the menu appears/disappears.
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-h-[52px] w-full items-center justify-between gap-4 px-4 py-1.5 sm:px-8">
        {/* Brand */}
        <a href="#home" onClick={closeMenu} className="flex items-center gap-2.5" aria-label="Wanderlust Destinations home">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-navy text-white">
            <CompassIcon size={18} />
          </span>
          <span className="text-base font-bold tracking-tight sm:text-[1.05rem]">Wanderlust Destinations</span>
        </a>

        {/* Burger button: only visible on mobile (hidden from md: and up) */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="main-nav"
          onClick={() => setIsOpen(!isOpen)} // flip true <-> false
        >
          <span className="relative block h-0.5 w-5 rounded bg-ink">
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-transform ${isOpen ? 'top-0 rotate-45' : '-top-1.5'}`} />
            <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-transform ${isOpen ? 'top-0 -rotate-45' : 'top-1.5'}`} />
          </span>
        </button>

        {/* Mobile first: a dropdown panel under the header.
            md: turns it into a normal row inside the header. */}
        <nav
          id="main-nav"
          aria-label="Primary"
          className={`${isOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-4 border-b border-line bg-surface px-4 pb-6 pt-4 shadow-lg sm:px-8 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <ul className="flex flex-col md:flex-row md:items-center md:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block border-b border-line py-3 text-[0.95rem] font-medium transition-colors hover:text-accent-dark md:border-0 md:py-0 md:text-[0.82rem]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#quote"
            onClick={closeMenu}
            className="rounded-lg bg-navy px-4 py-3 text-center text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#1b2a57] md:px-3.5 md:py-2.5 md:text-[0.82rem]"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
