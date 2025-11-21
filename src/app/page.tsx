'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { StatCard } from '@/components/ui/StatCard';
import { NewsCard } from '@/components/ui/NewsCard';
import { Button } from '@/components/ui/Button';
import { Users, MapPin, Star, MessageCircle, ArrowRight, Globe } from 'lucide-react';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Mock news data
  const mockNews = [
    {
      id: '1',
      title: 'Fair Work Announces New Wage Increases',
      summary: 'The Fair Work Ombudsman has released new guidelines for minimum wage adjustments affecting PALM scheme workers.',
      source: 'Fair Work Ombudsman',
      publishedDate: '2 hours ago',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      url: '/news/wage-increases',
    },
    {
      id: '2',
      title: 'Community Event: Pacific Festival in Brisbane',
      summary: 'Join over 500 workers this weekend for cultural celebrations and community support networking.',
      source: 'PALM Community',
      publishedDate: '1 day ago',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
      url: '/news/pacific-festival',
    },
    {
      id: '3',
      title: 'New Visa Regulations Explained',
      summary: 'A simplified breakdown of the recent changes to visa conditions for long-term placements.',
      source: 'Department of Home Affairs',
      publishedDate: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop',
      url: '/news/visa-regulations',
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar currentPath="/" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-midnight text-white overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/90 to-midnight z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=2600&h=1600&fit=crop')] bg-cover bg-center opacity-30"></div>
          </div>

          {/* Decorative Glows */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-ocean/30 rounded-full blur-[128px] z-0"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold/10 rounded-full blur-[128px] z-0"></div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up space-y-8">
              {/* Version Badge */}
              <div className="inline-flex items-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 text-sm font-medium text-gold mb-4">
                <span className="flex h-2 w-2 rounded-full bg-gold mr-2 animate-pulse"></span>
                Version 3.0 Live
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight leading-tight text-white">
                Elevating the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">
                  Pacific Standard
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                The premier digital hub for the PALM scheme. Connecting 30,000+ workers with AI-driven support,
                community resources, and real-time insights.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
                <Button variant="luxury" size="lg" icon={<MessageCircle className="w-5 h-5" />}>
                  Launch Assistant
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  Explore Platform
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent"></div>
          </div>
        </section>

        {/* Metrics Strip */}
        <div className="border-y border-slate-100 dark:border-white/5 bg-white dark:bg-charcoal/50 backdrop-blur-sm relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100 dark:divide-white/5">
              <div>
                <p className="text-4xl font-heading font-bold text-ocean dark:text-white">30k+</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-gold mt-2">Active Workers</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-ocean dark:text-white">15</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-gold mt-2">Pacific Nations</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-ocean dark:text-white">24/7</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-gold mt-2">AI Support</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-ocean dark:text-white">4.8</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-gold mt-2">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Dashboard Preview */}
        <section className="py-24 bg-sand dark:bg-midnight transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                  Real-Time Intelligence
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                  Live telemetry from across the continent. Track distribution, welfare, and engagement instantly.
                </p>
              </div>
              <Link href="/statistics">
                <Button variant="outline" className="mt-6 md:mt-0 dark:border-gold/30 dark:text-gold hover:dark:bg-gold/10">
                  View Full Analytics
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard
                title="Workers Supported"
                value="30,248"
                icon={<Users size={24} />}
                trend={{ value: 12, direction: 'up' }}
                variant="highlight"
              />
              <StatCard
                title="Countries Active"
                value="15"
                icon={<Globe size={24} />}
              />
              <StatCard
                title="Average Rating"
                value="4.8/5"
                icon={<Star size={24} />}
                trend={{ value: 0.3, direction: 'up' }}
              />
            </div>

            {/* Interactive Map Placeholder */}
            <div className="bg-white dark:bg-charcoal rounded-2xl shadow-lg p-8 border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-center h-96 text-slate-400 dark:text-slate-500">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 text-ocean dark:text-gold" />
                  <p className="text-lg font-medium">Interactive Map Component</p>
                  <p className="text-sm">Coming soon: Live worker distribution across Australia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-24 bg-white dark:bg-charcoal transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                Latest News & Updates
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Stay informed with the latest developments affecting Pacific workers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mockNews.map((article) => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/news">
                <Button variant="outline">
                  View All News
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
