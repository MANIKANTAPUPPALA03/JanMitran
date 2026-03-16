'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Home, CheckCircle2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';

interface SuccessModalProps {
  isOpen: boolean;
  complaintId: string;
  complaintDraft: string;
  onClose: () => void;
}

export function SuccessModal({
  isOpen,
  complaintId,
  complaintDraft,
  onClose,
}: SuccessModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      
      // Set font for header
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('JanMitraN - Civic Complaint', margin, 20);
      
      // Add complaint ID
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Complaint ID: ${complaintId}`, margin, 30);
      
      // Add date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Date: ${currentDate}`, margin, 37);
      
      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 42, pageWidth - margin, 42);
      
      // Add complaint draft content
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      const lines = doc.splitTextToSize(complaintDraft, maxWidth);
      let yPosition = 50;
      const lineHeight = 5;
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'This is an official complaint document from JanMitraN. ' +
        'Your reference ID is required for tracking and communication.',
        margin,
        pageHeight - 10,
        { align: 'center', maxWidth: maxWidth }
      );
      
      // Save PDF
      doc.save(`JanMitran-Complaint-${complaintId}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card rounded-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-100 p-4 animate-pulse-glow">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center text-foreground">
            Complaint Registered Successfully
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">
            Your complaint has been submitted to the admin portal and a confirmation email
            has been sent to your registered email address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Complaint ID</p>
            <p className="text-xl font-semibold text-primary font-mono break-all">
              {complaintId}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Save this ID for future reference and status tracking
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base gap-2 shadow-lg shadow-primary/20"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? 'Downloading...' : 'Download Complaint'}
            </Button>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full border-border/50 hover:bg-primary/5 hover:border-primary/30 py-6 text-base gap-2 font-semibold transition-all"
                onClick={onClose}
              >
                <Home className="w-5 h-5" />
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              What happens next?
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Our team will review your complaint</li>
              <li>You&apos;ll receive email updates on progress</li>
              <li>Expected resolution within 7-14 business days</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
