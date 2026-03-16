'use client';

import { Shield, Users, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Drafting',
    description: 'Our Groq-powered AI assistant generates formal complaint documents in seconds, saving you time and effort.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Transparent',
    description: 'Every complaint is securely stored and tracked. Firebase authentication ensures only authorized access to admin tools.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Users,
    title: 'Multi-Department Routing',
    description: 'Complaints are automatically routed to the right department — Sanitation, Electricity, Water, Roads, or General.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe,
    title: 'Real-Time Tracking',
    description: 'Track your complaint status anytime, anywhere. Get email notifications as your issue progresses toward resolution.',
    gradient: 'from-purple-500 to-pink-500',
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Why JanMitraN
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            About JanMitraN
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            JanMitraN (जनमित्रण) is a next-gen civic complaint portal built for Smart India Hackathon 2025.
            It empowers citizens to report, track, and resolve civic issues with AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex gap-5 p-7 rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-border/30 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
