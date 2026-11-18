import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Globe, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-corporate-deep text-white border-t border-corporate-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-corporate-blue flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                FOCUS <span className="text-corporate-lightBlue">ENGINEERING</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Classical corporate portfolio management platform powering the digital identities of technical leaders, architects, and engineering specialists.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise SOC2 Compliant & Multi-Tenant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <a href="/#directory" className="hover:text-white transition-colors">
                  Engineering Directory
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Administrator Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Portfolios Sample Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Featured Profiles
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/manoj" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Manoj Kumar</span>
                  <span className="text-xs text-slate-400">Classic</span>
                </Link>
              </li>
              <li>
                <Link to="/dj" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Dhananjay Sharma (DJ)</span>
                  <span className="text-xs text-slate-400">Modern</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Headquarters
            </h4>
            <p className="text-sm text-slate-300 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-corporate-blue flex-shrink-0" />
              <span>portfolio.focusengineeringapp.com</span>
            </p>
            <p className="text-sm text-slate-300 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-corporate-blue flex-shrink-0" />
              <span>inquiries@focusengineering.com</span>
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Production deployment on Ubuntu VPS with Nginx reverse proxy, PM2 process management, and MongoDB.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FOCUS Engineering Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-200 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
