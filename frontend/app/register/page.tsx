'use client';

import { Navbar } from '@/components/landing/navbar';
import { ComplaintForm } from '@/components/register/complaint-form';

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/images/nature-bg-register.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-black/40 to-teal-900/50" />

      <Navbar />

      <main className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-8 px-4">
        <div className="w-full max-w-2xl animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium animate-fade-in-down">
              Civic Complaint Portal
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white animate-fade-in-up delay-100">
              Register a Complaint
            </h1>
            <p className="text-lg text-white/75 animate-fade-in-up delay-200">
              Help us improve your community by reporting issues
            </p>
          </div>

          {/* Form Container */}
          <div className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up delay-300">
            <ComplaintForm />
          </div>
        </div>
      </main>
    </div>
  );
}
