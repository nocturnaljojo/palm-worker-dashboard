'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { Globe, Factory, Star, TrendingUp, Download, ArrowRight } from 'lucide-react'; // Placeholder icons for stats page

// Placeholder for NavigationBar
const NavigationBar = () => (
  <nav className="bg-primary-blue text-white p-md shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="font-heading text-xl font-bold">
        PALM
      </Link>
      <div className="flex space-x-lg">
        <Link href="/" className="hover:text-secondary-teal">Home</Link>
        <Link href="/for-workers" className="hover:text-secondary-teal">For Workers</Link>
        <Link href="/data" className="hover:text-secondary-teal">Data</Link>
      </div>
      <button className="bg-secondary-teal text-white py-sm px-md rounded-md hover:bg-accent-coral">Login/Sign Up</button>
    </div>
  </nav>
);

// Placeholder for Footer
const Footer = () => (
  <footer className="bg-text-dark text-white p-lg mt-xl">
    <div className="container mx-auto text-center text-text-muted">
      <p>&copy; {new Date().getFullYear()} PALM. All rights reserved.</p>
      <div className="flex justify-center space-x-lg mt-sm">
        <Link href="/about" className="hover:text-secondary-teal">About</Link>
        <Link href="/resources" className="hover:text-secondary-teal">Resources</Link>
        <Link href="/contact" className="hover:text-secondary-teal">Contact</Link>
        <Link href="/privacy" className="hover:text-secondary-teal">Privacy</Link>
      </div>
    </div>
  </footer>
);

export default function PublicStatisticsPage() {
  const lastUpdated = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-neutral-sand flex flex-col">
      <NavigationBar /> {/* Using placeholder NavigationBar */}

      <main className="flex-grow container mx-auto p-lg">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-dark text-center mb-xl">
          PALM By The Numbers
        </h1>

        {/* Hero Stats */}
        <section className="bg-primary-blue text-white rounded-lg p-xl text-center shadow-lg mb-xl">
          <p className="font-heading text-5xl md:text-7xl font-bold mb-md">
            30,248 Workers Supported
          </p>
          <p className="font-body text-md text-text-muted">
            Last updated: {lastUpdated} ago
          </p>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
          <StatCard title="Countries" value="10" icon={<Globe size={24} />} />
          <StatCard title="Industries" value="12" icon={<Factory size={24} />} />
          <StatCard title="Avg Rating" value="4.8/5" icon={<Star size={24} />} />
          <StatCard title="This Month" value="+2,340" icon={<TrendingUp size={24} />} trend={{ value: 15, direction: 'up', percentage: 15 }} />
        </section>

        {/* Interactive Charts - Placeholder */}
        <section className="mb-xl">
          <h2 className="font-heading text-3xl font-bold text-text-dark mb-lg text-center">
            Key Data Visualizations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <div className="bg-white rounded-lg shadow-md p-lg h-96 flex items-center justify-center text-text-muted font-body">
              <BarChart size={48} className="text-primary-blue mr-sm" />
              <p>Workers by Country - Bar Chart Placeholder</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-lg h-96 flex items-center justify-center text-text-muted font-body">
              <Globe size={48} className="text-secondary-teal mr-sm" />
              <p>Industry Distribution - Pie Chart Placeholder</p>
            </div>
          </div>
        </section>

        {/* Download Data CTA */}
        <section className="text-center">
          <h2 className="font-heading text-3xl font-bold text-text-dark mb-lg">
            Access Our Data
          </h2>
          <div className="flex justify-center gap-md">
            <button className="bg-primary-blue text-white py-md px-lg rounded-md hover:bg-secondary-teal transition-colors flex items-center gap-sm">
              <Download size={20} /> Download CSV
            </button>
            <button className="bg-secondary-teal text-white py-md px-lg rounded-md hover:bg-accent-coral transition-colors flex items-center gap-sm">
              <Download size={20} /> Download JSON
            </button>
            <Link href="/api-access" className="bg-text-muted text-white py-md px-lg rounded-md hover:bg-text-dark transition-colors flex items-center gap-sm">
              <ArrowRight size={20} /> API Access
            </Link>
          </div>
        </section>
      </main>

      <Footer /> {/* Using placeholder Footer */}
    </div>
  );
}