'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Assuming NewsCard uses Next.js Image component
import { ArrowRight } from 'lucide-react';

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

// Reusing NewsCard from homepage for consistency
const NewsCard = ({ title, date, source, imageUrl, link }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
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


export default function NewsFeedPage() {
  return (
    <div className="min-h-screen bg-neutral-sand flex flex-col">
      <NavigationBar /> {/* Using placeholder NavigationBar */}

      <main className="flex-grow container mx-auto p-lg">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-dark text-center mb-xl">
          Latest News & Updates
        </h1>

        {/* Featured Article */}
        <section className="bg-white rounded-lg shadow-md overflow-hidden mb-xl">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src="https://via.placeholder.com/600x400?text=Featured+News+Image"
                alt="Featured Article"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-lg flex flex-col justify-center">
              <h2 className="font-heading text-3xl font-bold text-text-dark mb-md">
                Fair Work Announces New Wage Increases for PALM Workers
              </h2>
              <p className="text-text-muted text-md mb-lg">
                Published 2 hours ago | Fair Work Ombudsman
              </p>
              <Link href="/news/featured-article" className="bg-primary-blue text-white py-md px-lg rounded-md hover:bg-secondary-teal transition-colors flex items-center w-max">
                Read More <ArrowRight size={20} className="ml-sm" />
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mb-xl">
          <h2 className="font-heading text-3xl font-bold text-text-dark mb-lg text-center">
            Recent Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <NewsCard
              title="New PALM Scheme Initiatives Launched Across Australia"
              date="1 day ago"
              source="PALM Program Office"
              imageUrl="https://via.placeholder.com/400x200?text=News+Image+1"
              link="/news/article1"
            />
            <NewsCard
              title="Worker Rights Workshop in Brisbane Attracts Hundreds"
              date="3 days ago"
              source="Migrant Workers Centre"
              imageUrl="https://via.placeholder.com/400x200?text=News+Image+2"
              link="/news/article2"
            />
            <NewsCard
              title="Seasonal Worker Visa Changes Announced"
              date="1 week ago"
              source="Department of Home Affairs"
              imageUrl="https://via.placeholder.com/400x200?text=News+Image+3"
              link="/news/article3"
            />
          </div>
          <div className="text-center mt-xl">
            <button className="bg-secondary-teal text-white py-md px-lg rounded-md hover:bg-accent-coral transition-colors">
              Load More Articles
            </button>
          </div>
        </section>
      </main>

      <Footer /> {/* Using placeholder Footer */}
    </div>
  );
}