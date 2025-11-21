'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, ExternalLink } from 'lucide-react';

export interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedDate: string;
  imageUrl: string;
  url: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  source,
  publishedDate,
  imageUrl,
  url,
}) => {
  return (
    <div className="group bg-white dark:bg-charcoal rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-white/5">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-medium text-white bg-ocean/80 dark:bg-gold/80 px-2 py-1 rounded-full backdrop-blur-sm">
            {source}
          </span>
          <span className="text-xs font-medium text-white flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {publishedDate}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-ocean dark:group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {summary}
        </p>
        <Link
          href={url}
          className="inline-flex items-center text-sm font-medium text-ocean dark:text-gold hover:underline"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
