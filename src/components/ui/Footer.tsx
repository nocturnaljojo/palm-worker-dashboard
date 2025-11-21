'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Mail, Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight dark:bg-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mr-3">
                <Globe className="h-5 w-5 text-midnight" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">PALM Dashboard</h3>
                <p className="text-xs text-gold tracking-wider">ELEVATING THE PACIFIC STANDARD</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Supporting 30,000+ Pacific workers with AI-driven assistance,
              community resources, and real-time insights across Australia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-400 hover:text-gold transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:support@palm.au" className="text-slate-400 hover:text-gold transition-colors text-sm flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  support@palm.au
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} PALM Dashboard. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-gold transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-gold transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-gold transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
