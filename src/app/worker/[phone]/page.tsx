'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Briefcase, Calendar, Phone, ArrowLeft } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

interface WorkerProfile {
  phone_number: string;
  name: string;
  country: string;
  state: string;
  postcode: string;
  city: string;
  industry: string;
  employer: string;
  visa_type: string;
  created_at: string;
  registration_complete: boolean;
  chats_count?: number;
  hours_worked?: number;
  rating?: string;
  status?: string;
}

function WorkerProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) {
      setError('No phone number provided');
      setLoading(false);
      return;
    }

    fetchWorkerProfile(phone);
  }, [phone]);

  async function fetchWorkerProfile(phoneNumber: string) {
    try {
      // Assuming a similar API route as the old worker profile page
      const response = await fetch(`/api/dashboard/worker-profile?phone=${encodeURIComponent(phoneNumber)}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Worker not found or not registered via WhatsApp');
        } else {
          setError('Failed to load profile');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setWorker({
        ...data,
        // Mock data for quick stats if not available from API
        chats_count: 47,
        hours_worked: 320,
        rating: '4.5/5',
        status: 'Active'
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching worker profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-sand flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-lg w-lg border-b-2 border-primary-blue mx-auto"></div>
          <p className="mt-md text-text-muted">Loading worker profile...</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-neutral-sand flex items-center justify-center">
        <div className="text-center max-w-md p-lg bg-white shadow-lg rounded-lg">
          <div className="w-xl h-xl bg-error/20 rounded-full flex items-center justify-center mx-auto mb-lg">
            <User className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-text-dark mb-md">Profile Not Found</h2>
          <p className="text-text-muted mb-xl">{error}</p>
          <button
            onClick={() => router.push('/')} // Redirect to new homepage
            className="inline-flex items-center gap-sm px-lg py-md bg-primary-blue hover:bg-secondary-teal text-white rounded-md transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const memberSince = worker.created_at ? new Date(worker.created_at).toLocaleDateString('en-AU', { year: 'numeric', month: 'short' }) : 'N/A';

  return (
    <div className="min-h-screen bg-sand dark:bg-midnight flex flex-col">
      <Navbar currentPath="/worker" />

      <main className="flex-grow container mx-auto p-lg">
        {/* Back to Home Button */}
        <div className="mb-lg">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-ocean dark:hover:text-gold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-lg mb-lg">
          <div className="flex items-center gap-md">
            {/* Avatar - Placeholder for actual avatar component */}
            <div className="w-20 h-20 rounded-full bg-secondary-teal flex items-center justify-center text-xl font-bold text-white">
              {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-dark">{worker.name} 🇫🇯</h1>
              <p className="text-text-muted font-body text-md">{worker.city || 'N/A'}, {worker.state || 'N/A'} | {worker.industry || 'Worker'}</p>
              <p className="text-text-muted font-body text-sm">Member since: {memberSince}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
          <StatCard title="Chats" value={worker.chats_count || 'N/A'} icon={<Phone size={24} />} />
          <StatCard title="Hours" value={worker.hours_worked || 'N/A'} icon={<Calendar size={24} />} />
          <StatCard title="Rating" value={worker.rating || 'N/A'} icon={<User size={24} />} />
          <StatCard title="Status" value={worker.status || 'N/A'} icon={<Briefcase size={24} />} />
        </div>

        {/* Recent Activity - Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-lg mb-xl h-48 flex items-center justify-center text-text-muted">
          <p>Recent Activity Timeline Placeholder</p>
        </div>

        {/* Actions - Placeholder */}
        <div className="flex justify-center gap-md">
          <button className="bg-primary-blue text-white py-md px-lg rounded-md hover:bg-secondary-teal transition-colors">View Conversations</button>
          <button className="bg-accent-coral text-white py-md px-lg rounded-md hover:bg-error transition-colors">Export Data</button>
          <button className="bg-text-muted text-white py-md px-lg rounded-md hover:bg-text-dark transition-colors">Get Support</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function WorkerProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-sand flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-lg w-lg border-b-2 border-primary-blue mx-auto"></div>
          <p className="mt-md text-text-muted">Loading profile...</p>
        </div>
      </div>
    }>
      <WorkerProfileContent />
    </Suspense>
  );
}
