'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Globe, Factory, Star, TrendingUp, Download, ArrowRight, BarChart } from 'lucide-react';

export default function PublicStatisticsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastUpdated = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar currentPath="/statistics" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-ocean via-midnight to-charcoal dark:from-midnight dark:to-black text-white py-20 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean/20 rounded-full blur-[128px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gold mb-4">
                <div className="flex h-2 w-2 rounded-full bg-gold mr-2 animate-pulse"></div>
                Live Data • Updated {lastUpdated}
              </div>

              <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6">
                PALM By The Numbers
              </h1>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
                Real-time insights into the PALM scheme's impact across Australia and the Pacific
              </p>

              {/* Hero Metric */}
              <div className="mt-12">
                <p className="text-7xl md:text-8xl font-heading font-bold gradient-text mb-4">
                  30,248
                </p>
                <p className="text-2xl text-slate-300 font-light">
                  Workers Supported
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <section className="py-16 bg-sand dark:bg-midnight transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Countries Active"
                value="15"
                icon={<Globe size={24} />}
                variant="highlight"
              />
              <StatCard
                title="Industries"
                value="12"
                icon={<Factory size={24} />}
              />
              <StatCard
                title="Average Rating"
                value="4.8/5"
                icon={<Star size={24} />}
                trend={{ value: 0.3, direction: 'up' }}
              />
              <StatCard
                title="Monthly Growth"
                value="+2,340"
                icon={<TrendingUp size={24} />}
                trend={{ value: 15, direction: 'up' }}
              />
            </div>
          </div>
        </section>

        {/* Data Visualizations */}
        <section className="py-16 bg-white dark:bg-charcoal transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                Key Data Visualizations
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Interactive charts and graphs showing worker distribution and trends
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart Placeholder 1 */}
              <div className="bg-sand dark:bg-midnight rounded-2xl shadow-lg border border-slate-100 dark:border-white/5 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center h-80 text-slate-400 dark:text-slate-500">
                  <div className="text-center">
                    <BarChart size={48} className="mx-auto mb-4 text-ocean dark:text-gold" />
                    <p className="text-lg font-medium">Workers by Country</p>
                    <p className="text-sm">Bar Chart - Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder 2 */}
              <div className="bg-sand dark:bg-midnight rounded-2xl shadow-lg border border-slate-100 dark:border-white/5 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center h-80 text-slate-400 dark:text-slate-500">
                  <div className="text-center">
                    <Globe size={48} className="mx-auto mb-4 text-ocean dark:text-gold" />
                    <p className="text-lg font-medium">Industry Distribution</p>
                    <p className="text-sm">Pie Chart - Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder 3 - Full Width */}
              <div className="lg:col-span-2 bg-sand dark:bg-midnight rounded-2xl shadow-lg border border-slate-100 dark:border-white/5 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center h-80 text-slate-400 dark:text-slate-500">
                  <div className="text-center">
                    <TrendingUp size={48} className="mx-auto mb-4 text-ocean dark:text-gold" />
                    <p className="text-lg font-medium">Growth Trend Over Time</p>
                    <p className="text-sm">Line Chart - Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Data Section */}
        <section className="py-16 bg-sand dark:bg-midnight transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              Access Our Data
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Download comprehensive datasets or integrate via our API
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="luxury" size="lg" icon={<Download className="w-5 h-5" />}>
                Download CSV
              </Button>
              <Button variant="outline" size="lg" icon={<Download className="w-5 h-5" />}>
                Download JSON
              </Button>
              <Link href="/api-access">
                <Button variant="ghost" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  API Access
                </Button>
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-white dark:bg-charcoal rounded-2xl border border-slate-100 dark:border-white/5 p-8 text-left max-w-2xl mx-auto">
              <h3 className="font-heading font-semibold text-xl text-slate-900 dark:text-white mb-3">
                Data Usage Guidelines
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• All data is anonymized to protect worker privacy</li>
                <li>• Updated in real-time every 5 minutes</li>
                <li>• Free for research and non-commercial use</li>
                <li>• Attribution required: "Data from PALM Dashboard"</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
