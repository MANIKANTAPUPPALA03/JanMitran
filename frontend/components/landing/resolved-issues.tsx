'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ResolvedIssue {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  color: string;
}

interface StatsData {
  total: number;
  resolved: number;
  successRate: number;
}

const resolvedIssues: ResolvedIssue[] = [
  {
    id: 1,
    title: 'Clean Streets Initiative',
    description: 'Garbage collection improved across downtown area',
    category: 'Sanitation',
    image: '/images/resolved-1.jpg',
    date: 'Mar 2024',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 2,
    title: 'Street Lighting Fixed',
    description: 'All non-functional street lights restored in sector 5',
    category: 'Electricity',
    image: '/images/resolved-2.jpg',
    date: 'Feb 2024',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 3,
    title: 'Water Supply Restored',
    description: 'Water pipeline repaired serving 2000+ households',
    category: 'Water',
    image: '/images/resolved-3.jpg',
    date: 'Jan 2024',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 4,
    title: 'Road Maintenance Complete',
    description: '5km of damaged roads resurfaced and reopened',
    category: 'Infrastructure',
    image: '/images/resolved-4.jpg',
    date: 'Dec 2023',
    color: 'from-orange-500 to-red-500',
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (value === '—' || hasAnimated.current) {
      setDisplayed(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
          if (isNaN(numericValue)) {
            setDisplayed(value);
            return;
          }
          const duration = 1500;
          const steps = 40;
          const stepDuration = duration / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += numericValue / steps;
            if (current >= numericValue) {
              setDisplayed(numericValue.toLocaleString());
              clearInterval(timer);
            } else {
              setDisplayed(Math.floor(current).toLocaleString());
            }
          }, stepDuration);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold text-primary">
      {displayed}{suffix}
    </div>
  );
}

export function ResolvedIssues() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/complaints/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const displayStats = [
    { label: 'Issues Reported', value: stats ? stats.total.toLocaleString() : '—', suffix: '' },
    { label: 'Issues Resolved', value: stats ? stats.resolved.toLocaleString() : '—', suffix: '' },
    { label: 'Success Rate', value: stats ? `${stats.successRate}` : '—', suffix: '%' },
    { label: 'Avg Response', value: '4', suffix: ' Days' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Impact & Results
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Issues We&apos;ve Resolved
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See the real impact of community reporting. These are actual issues raised by citizens and resolved through JanMitraN.
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="relative group">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-foreground p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 border border-border/50 hover:scale-110"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-foreground p-3 rounded-full shadow-xl transition-all opacity-0 group-hover:opacity-100 border border-border/50 hover:scale-110"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Issues Grid - Scrollable */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 scrollbar-hide"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
          >
            {resolvedIssues.map((issue) => (
              <div
                key={issue.id}
                className="snap-center shrink-0 w-full sm:w-[380px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group/card border border-border/30 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <Image
                    src={issue.image}
                    alt={issue.title}
                    fill
                    className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className={`absolute top-4 right-4 bg-gradient-to-r ${issue.color} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}>
                    {issue.category}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white/80 text-sm font-medium">{issue.date}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-bold text-foreground leading-tight group-hover/card:text-primary transition-colors duration-300">
                    {issue.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Stats */}
        <div className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/50 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-sm text-muted-foreground mt-2 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
