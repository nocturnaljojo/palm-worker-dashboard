'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { StatCard } from '@/components/ui/StatCard';
import { Globe, Users, BarChart, Newspaper, ArrowRight, Menu, X } from 'lucide-react'; // Placeholder icons

// Placeholder components - these will be implemented fully later
const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-blue text-white p-md shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-heading text-xl font-bold">
          PALM
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-lg">
          <Link href="/" className="hover:text-secondary-teal">Home</Link>
          <Link href="/for-workers" className="hover:text-secondary-teal">For Workers</Link>
          <Link href="/data" className="hover:text-secondary-teal">Data</Link>
          <button className="bg-secondary-teal text-white py-sm px-md rounded-md hover:bg-accent-coral">Login/Sign Up</button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-blue pb-sm mt-sm">
          <div className="flex flex-col items-center space-y-sm">
            <Link href="/" className="block py-xs hover:text-secondary-teal" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/for-workers" className="block py-xs hover:text-secondary-teal" onClick={() => setIsMenuOpen(false)}>For Workers</Link>
            <Link href="/data" className="block py-xs hover:text-secondary-teal" onClick={() => setIsMenuOpen(false)}>Data</Link>
            <button className="bg-secondary-teal text-white py-sm px-md rounded-md hover:bg-accent-coral w-max" onClick={() => setIsMenuOpen(false)}>Login/Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
};

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

const NewsCard = ({ title, date, source, imageUrl, link }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    {imageUrl && <Image src={imageUrl} alt={title} width={400} height={200} className="w-full h-40 object-cover" />}
    <div className="p-md">
      <h4 className="font-heading text-lg font-semibold text-text-dark mb-xs">{title}</h4>
      <p className="text-text-muted text-sm mb-sm">{date} | {source}</p>
      <Link href={link} className="text-primary-blue hover:text-secondary-teal flex items-center">
        Read More <ArrowRight size={16} className="ml-xs" />
      </Link>
    </div>
  </div>
);

const InteractiveMap = () => (
  <div className="bg-white rounded-lg shadow-md p-md h-96 flex items-center justify-center text-text-muted font-body">
    {/* Placeholder for actual interactive map component */}
    <Globe size={48} className="text-secondary-teal mr-sm" />
    <p>Interactive Map Placeholder</p>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-sand flex flex-col">
      <NavigationBar />

      <main className="flex-grow container mx-auto p-lg">
        {/* Hero Section */}
        <section className="bg-primary-blue text-white rounded-lg p-xl text-center shadow-lg mb-xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-md">
            Supporting 30,000+ Pacific Workers in Australia 🇦🇺🇫🇯🇼🇸🇹🇴
          </h1>
          <p className="font-body text-lg mb-lg max-w-2xl mx-auto">
            Empowering PALM scheme workers with AI assistance, critical information, and a platform to voice their feedback.
          </p>
          <div className="flex justify-center space-x-md">
            <Link href="/assistant" className="bg-secondary-teal text-white py-md px-lg rounded-md font-body text-lg hover:bg-accent-coral transition-colors duration-300">
              Try the Assistant
            </Link>
            <Link href="/about" className="bg-transparent border border-white text-white py-md px-lg rounded-md font-body text-lg hover:bg-white hover:text-primary-blue transition-colors duration-300">
              Learn More
            </Link>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
          <StatCard title="Workers Supported" value="30,000+" icon={<Users size={24} />} />
          <StatCard title="Countries Represented" value="10" icon={<Globe size={24} />} />
          <StatCard title="Average Rating" value="4.8/5" icon={<BarChart size={24} />} trend={{ value: 0.5, direction: 'up', percentage: 10 }} />
        </section>

        {/* Interactive Map */}
        <section className="mb-xl">
          <h2 className="font-heading text-3xl font-bold text-text-dark mb-lg text-center">
            Where Our Workers Are Located
          </h2>
          <InteractiveMap />
        </section>

        {/* Latest News */}
        <section className="mb-xl">
          <h2 className="font-heading text-3xl font-bold text-text-dark mb-lg text-center">
            Latest News & Updates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <NewsCard
              title="Fair Work Announces New Wage Increases"
              date="2 hours ago"
              source="Fair Work Ombudsman"
              imageUrl="https://via.placeholder.com/400x200?text=News+Image+1"
              link="/news/article1"
            />
            <NewsCard
              title="New PALM Scheme Initiatives Launched"
              date="1 day ago"
              source="PALM Program Office"
              imageUrl="https://via.placeholder.com/400x200?text=News+Image+2"
              link="/news/article2"
            />
            <NewsCard
              title="Worker Rights Workshop in Brisbane"
              date="3 days ago"
              source="Migrant Workers Centre"
              imageUrl="https://via.placeholder.com/400x200?text=News+Image+3"
              link="/news/article3"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}