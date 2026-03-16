'use client';

import { FileText, Cpu, Send, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'File a Complaint',
    description: 'Fill in the details about the civic issue — location, category, and a brief description.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Cpu,
    title: 'AI Drafts Your Complaint',
    description: 'Our AI assistant generates a formal, professional complaint document for you to review.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Send,
    title: 'Submit & Notify',
    description: 'Submit the complaint. The relevant department is notified instantly via email.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: CheckCircle,
    title: 'Track & Resolve',
    description: 'Track your complaint status anytime using your unique Complaint ID.',
    gradient: 'from-blue-500 to-emerald-500',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to make your city a better place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px">
                    <div className="w-full h-full bg-gradient-to-r from-primary/30 to-primary/10" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/30" />
                  </div>
                )}

                {/* Icon */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rotate-6 group-hover:rotate-3`} />
                  <div className="relative w-full h-full rounded-2xl bg-white shadow-lg shadow-primary/5 flex items-center justify-center group-hover:-translate-y-1 transition-all duration-300 border border-border/50">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                </div>

                {/* Step number */}
                <div className={`absolute -top-1 right-1/2 translate-x-14 w-8 h-8 rounded-full bg-gradient-to-br ${step.gradient} text-white text-xs font-bold flex items-center justify-center shadow-lg`}>
                  {index + 1}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
