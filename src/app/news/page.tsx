'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { NewsCard } from '@/components/ui/NewsCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Newspaper } from 'lucide-react';

export default function NewsFeedPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Mock news data
  const recentNews = [
    {
      id: '1',
      title: 'New PALM Scheme Initiatives Launched Across Australia',
      summary: 'The PALM Program Office announces expanded support services and resource centers in regional areas.',
      source: 'PALM Program Office',
      publishedDate: '1 day ago',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
      url: '/news/initiatives',
    },
    {
      id: '2',
      title: 'Worker Rights Workshop in Brisbane Attracts Hundreds',
      summary: 'Community event brings together Pacific workers and advocacy groups for education and networking.',
      source: 'Migrant Workers Centre',
      publishedDate: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      url: '/news/workshop',
    },
    {
      id: '3',
      title: 'Seasonal Worker Visa Changes Announced',
      summary: 'New regulations aim to streamline visa processes and extend stay durations for eligible workers.',
      source: 'Department of Home Affairs',
      publishedDate: '1 week ago',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
      url: '/news/visa-changes',
    },
    {
      id: '4',
      title: 'Health Services Expand for Pacific Workers',
      summary: 'New partnerships with regional health providers improve access to medical care for PALM scheme participants.',
      source: 'Health Department',
      publishedDate: '2 weeks ago',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
      url: '/news/health-services',
    },
    {
      id: '5',
      title: 'Cultural Exchange Program Success Stories',
      summary: 'Celebrating the positive impact of cultural exchange between Pacific workers and Australian communities.',
      source: 'PALM Community',
      publishedDate: '3 weeks ago',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop',
      url: '/news/cultural-exchange',
    },
    {
      id: '6',
      title: 'Technology Training Programs Roll Out',
      summary: 'Digital literacy workshops help workers stay connected with families and access online services.',
      source: 'Education Partners',
      publishedDate: '1 month ago',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      url: '/news/tech-training',
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar currentPath="/news" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-ocean to-midnight dark:from-midnight dark:to-black text-white py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-[128px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-4 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 backdrop-blur-md mb-4">
                <Newspaper className="w-8 h-8 text-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold">
                Latest News & Updates
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
                Stay informed with the latest developments affecting Pacific workers
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-16 bg-sand dark:bg-midnight transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-charcoal rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 hover:shadow-3xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                    alt="Featured Article"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-midnight px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <p className="text-ocean dark:text-gold text-sm font-semibold uppercase tracking-wider mb-3">
                    Fair Work Ombudsman • 2 hours ago
                  </p>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                    Fair Work Announces New Wage Increases for PALM Workers
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                    The Fair Work Commission has announced a significant increase in minimum wages,
                    bringing better financial security to thousands of Pacific workers across Australia.
                  </p>
                  <Link href="/news/featured-article">
                    <Button variant="luxury" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                      Read Full Article
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles Grid */}
        <section className="py-16 bg-white dark:bg-charcoal transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-12 text-center">
              Recent Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentNews.map((article) => (
                <NewsCard key={article.id} {...article} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-16 bg-sand dark:bg-midnight transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Subscribe to our newsletter for weekly updates on worker rights, news, and community events
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full border border-slate-300 dark:border-white/10 bg-white dark:bg-charcoal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ocean dark:focus:ring-gold"
              />
              <Button variant="luxury" size="lg">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
