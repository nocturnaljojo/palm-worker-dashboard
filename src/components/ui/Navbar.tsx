'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, BarChart2, User, Home, Moon, Sun, Search } from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = '/',
  isDarkMode = false,
  onToggleTheme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/worker', label: 'Worker Portal', icon: <User className="w-4 h-4" /> },
    { path: '/statistics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-midnight/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-ocean to-midnight dark:from-gold dark:to-yellow-600 flex items-center justify-center mr-3 shadow-lg transition-transform group-hover:scale-105">
              <Globe className="h-5 w-5 text-white dark:text-midnight" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl text-slate-900 dark:text-white tracking-tight leading-none">
                PALM
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-gold uppercase">
                Dashboard
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-ocean dark:text-gold bg-ocean/5 dark:bg-gold/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-ocean dark:bg-gold mb-1"></span>
                )}
              </Link>
            ))}

            <div className="flex items-center gap-3 pl-6 ml-6 border-l border-slate-200 dark:border-white/10">
              <button
                className="p-2 rounded-full text-slate-400 hover:text-ocean dark:hover:text-gold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="p-2 rounded-full text-slate-400 hover:text-ocean dark:hover:text-gold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              <button className="ml-2 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-midnight text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                Sign In
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-charcoal border-b border-slate-200 dark:border-white/5 shadow-2xl animate-fade-in">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex w-full items-center px-3 py-4 rounded-xl text-base font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-ocean/5 dark:bg-gold/10 text-ocean dark:text-gold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="pt-6 mt-2 border-t border-slate-100 dark:border-white/5">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-3 py-3 text-center rounded-xl text-base font-medium bg-ocean dark:bg-gold text-white dark:text-midnight shadow-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
