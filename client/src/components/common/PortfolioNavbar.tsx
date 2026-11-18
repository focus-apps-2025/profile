import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Menu, X, Mail } from 'lucide-react';
import { IPortfolio } from '../../types';

export const PortfolioNavbar: React.FC<{ portfolio: IPortfolio }> = ({ portfolio }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-corporate-border transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Owner Identity & FOCUS Engineering Tag */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 text-corporate-mutedText hover:text-corporate-navy transition-colors group" title="Return to FOCUS Engineering platform">
              <div className="w-8 h-8 rounded-lg bg-corporate-navy flex items-center justify-center text-white group-hover:bg-corporate-blue transition-colors">
                <Layers className="w-4 h-4" />
              </div>
            </Link>

            <div className="h-4 w-px bg-corporate-border" />

            <div>
              <a href="#about" className="font-extrabold text-sm sm:text-base tracking-tight text-corporate-navy hover:text-corporate-blue transition-colors block leading-tight">
                {portfolio.fullName}
              </a>
              <span className="text-[11px] text-corporate-mutedText font-medium block leading-none">
                {portfolio.professionalTitle}
              </span>
            </div>
          </div>

          {/* Desktop Portfolio Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-corporate-text">
            {portfolio.bio && (
              <a href="#about" className="hover:text-corporate-blue transition-colors">
                About
              </a>
            )}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <a href="#skills" className="hover:text-corporate-blue transition-colors">
                Skills & Tech
              </a>
            )}
            {portfolio.experience && portfolio.experience.length > 0 && (
              <a href="#experience" className="hover:text-corporate-blue transition-colors">
                Experience
              </a>
            )}
            {portfolio.projects && portfolio.projects.length > 0 && (
              <a href="#projects" className="hover:text-corporate-blue transition-colors">
                Projects
              </a>
            )}

            {portfolio.contactEnabled && (
              <a
                href="#contact"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-corporate-navy text-white hover:bg-corporate-deep transition-all shadow-subtle"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-corporate-mutedText hover:text-corporate-text hover:bg-corporate-secBg focus:outline-none"
              aria-label="Toggle profile navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-corporate-border bg-white px-4 pt-2 pb-5 space-y-2">
          {portfolio.bio && (
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-corporate-text hover:text-corporate-blue"
            >
              About {portfolio.fullName}
            </a>
          )}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-corporate-text hover:text-corporate-blue"
            >
              Skills & Expertise
            </a>
          )}
          {portfolio.experience && portfolio.experience.length > 0 && (
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-corporate-text hover:text-corporate-blue"
            >
              Work Experience
            </a>
          )}
          {portfolio.projects && portfolio.projects.length > 0 && (
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-corporate-text hover:text-corporate-blue"
            >
              Projects & Deliverables
            </a>
          )}
          {portfolio.contactEnabled && (
            <div className="pt-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-lg bg-corporate-navy text-white text-xs font-bold"
              >
                Contact Professional
              </a>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
