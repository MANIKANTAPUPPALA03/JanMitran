'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/landing/navbar';
import { SuccessModal } from '@/components/register/success-modal';
import { type ComplaintData } from '@/components/register/ai-draft-generator';
import { Edit, Send, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function DraftPage() {
  const router = useRouter();
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
  const [draftContent, setDraftContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');

  // Retrieve complaint data and generate AI draft
  useEffect(() => {
    const storedData = sessionStorage.getItem('complaintFormData');
    if (!storedData) {
      setError('No complaint data found. Redirecting to form...');
      setTimeout(() => router.push('/register'), 2000);
      return;
    }

    try {
      const data = JSON.parse(storedData) as ComplaintData;
      setComplaintData(data);

      // Call Groq AI API for draft generation
      generateAIDraft(data);
    } catch (err) {
      setError('Failed to load complaint data');
      console.error('Error parsing complaint data:', err);
      setIsLoading(false);
    }
  }, [router]);

  const generateAIDraft = async (data: ComplaintData) => {
    try {
      const response = await fetch(`${API_URL}/ai/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate draft');
      }

      const result = await response.json();
      setDraftContent(result.draft);

      // Extract complaint ID from draft
      const idMatch = result.draft.match(/(?:COMPLAINT ID|Complaint ID|ID)[:\s]*(JM-[^\s\n]+)/);
      if (idMatch) {
        setComplaintId(idMatch[1]);
      } else {
        setComplaintId(`JM-DRAFT-${Date.now()}`);
      }
    } catch (err) {
      console.error('AI draft generation failed, using fallback:', err);
      // Fallback to local template
      const { generateComplaintDraft } = await import('@/components/register/ai-draft-generator');
      const draft = generateComplaintDraft(data);
      setDraftContent(draft);
      const idMatch = draft.match(/COMPLAINT ID: (JM-[^\n]+)/);
      if (idMatch) setComplaintId(idMatch[1]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push('/register');
  };

  const handleSubmit = async () => {
    if (!complaintData) return;

    setIsSubmitting(true);
    try {
      // Submit complaint to API (saves to MongoDB + sends email)
      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit complaint');
      }

      const result = await response.json();
      setComplaintId(result.complaint.id);

      // Show success modal
      setShowSuccessModal(true);

      // Clear form data
      sessionStorage.removeItem('complaintFormData');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit complaint. Please try again.';
      setError(errorMessage);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-black/40 to-teal-900/50" />
        <Navbar />
        <div className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-8 px-4">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-white text-lg font-medium">Generating AI-powered complaint draft...</p>
            <p className="text-white/60 text-sm">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !draftContent) {
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-black/40 to-teal-900/50" />
        <Navbar />
        <div className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-8 px-4">
          <div className="w-full max-w-2xl glass-card rounded-2xl shadow-2xl p-6 sm:p-8 animate-scale-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">Error</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="w-full max-w-3xl space-y-6 animate-fade-in-up">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                Review Your Complaint Draft
              </h1>
              <p className="text-base text-white/70 mt-2">
                AI-generated draft powered by Groq — review before submission
              </p>
            </div>
            <Button
              onClick={handleEdit}
              variant="outline"
              className="glass-card hover:bg-white/95 border-white/30 text-foreground font-semibold gap-2 shrink-0"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>

          {/* Error Banner */}
          {error && draftContent && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Draft Content Card */}
          <div className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Complaint ID Display */}
            <div className="mb-6 pb-6 border-b border-border/50">
              <p className="text-sm text-muted-foreground font-medium">Complaint ID</p>
              <p className="text-2xl font-semibold text-primary font-mono mt-1">
                {complaintId}
              </p>
            </div>

            {/* Draft Content */}
            <div className="bg-secondary/30 rounded-xl p-6 mb-8 border border-border/30">
              <pre className="font-mono text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
                {draftContent}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Complaint
                  </>
                )}
              </Button>

              <Button
                onClick={handleEdit}
                variant="outline"
                className="w-full border-border/50 hover:bg-primary/5 hover:border-primary/30 py-6 text-base gap-2 font-semibold transition-all duration-300"
              >
                <Edit className="w-5 h-5" />
                Go Back to Edit
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-emerald-50 border border-emerald-200/50 rounded-xl p-4 text-sm text-foreground/70 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Note
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>This draft was generated by AI — review it carefully before submission</li>
                <li>Your complaint will be saved and an email notification will be sent to the relevant department</li>
                <li>Your complaint ID is required for future tracking and inquiries</li>
                <li>You can download a copy of your complaint after successful submission</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        complaintId={complaintId}
        complaintDraft={draftContent}
        onClose={() => {
          setShowSuccessModal(false);
          router.push('/');
        }}
      />
    </div>
  );
}
