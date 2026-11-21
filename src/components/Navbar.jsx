import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Vision', href: '#vision' },
  { label: 'Event Gallery', href: '#events' },
  { label: 'Office Bearers', href: '#bearers' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-transparent pointer-events-none ${
        scrolled ? 'py-3.5' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Identity */}
        <a
          href="#home"
          className="pointer-events-auto flex items-center px-3.5 py-2 rounded-2xl bg-navy-900/60 border border-white/10 backdrop-blur-md shadow-lg shadow-navy-950/30 hover:border-sky-400/30 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          aria-label="CSA USJ Home"
        >
          <img
            src="/csa-logo-nav.png"
            alt="Computer Science Association — Department of Computer Science, University of Sri Jayewardenepura"
            className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
          />
        </a>

        {/* Desktop Nav Links */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 lg:gap-2 bg-navy-900/60 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-navy-950 font-semibold text-xs lg:text-sm hover:bg-sky-300 transition-all shadow-lg shadow-white/10"
          >
            <span>Join Community</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="pointer-events-auto md:hidden p-2 rounded-xl bg-navy-900/90 border border-white/10 text-slate-200 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden bg-navy-950/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 mt-3 space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-navy-950 font-semibold text-sm"
            >
              <span>Connect With CSA</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
