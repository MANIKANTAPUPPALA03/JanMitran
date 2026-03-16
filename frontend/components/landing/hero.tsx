'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      style={{
        backgroundImage: 'url(/images/nature-bg-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-teal-900/30" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-float delay-500" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl animate-float delay-300" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center space-y-10 px-4">
        {/* Badge */}
        <div className="animate-fade-in-down">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
            <Shield className="w-4 h-4 text-emerald-300" />
            AI-Powered Civic Complaint Portal
          </span>
        </div>

        <div className="space-y-6">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-balance leading-[1.1] animate-fade-in-up">
            Make Your City{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300 bg-clip-text text-transparent">
              Better
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto text-pretty font-light leading-relaxed animate-fade-in-up delay-200">
            Report and track civic issues affecting your community.
            Your voice drives real change in streets, utilities, and services.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 animate-fade-in-up delay-400">
          <Link href="/register">
            <Button
              size="lg"
              className="text-base px-8 py-6 bg-white text-emerald-900 hover:bg-white/90 font-semibold shadow-2xl shadow-black/20 group transition-all duration-300 hover:shadow-emerald-500/20"
            >
              Report an Issue
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/track">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 py-6 bg-white/10 text-white hover:bg-white/20 hover:text-white border border-white/30 font-semibold backdrop-blur-sm shadow-xl transition-all duration-300"
            >
              Track Status
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="pt-8 animate-fade-in delay-600">
          <div className="flex items-center justify-center gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Tracking</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>AI Drafting</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Email Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
