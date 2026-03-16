'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/landing/navbar';
import { CheckCircle2, Download, Search, ArrowRight } from 'lucide-react';

interface ComplaintData {
  id: string;
  name: string;
  sector: string;
  subject: string;
  description: string;
  timestamp: string;
}

const sectorNames: Record<string, string> = {
  garbage: '🗑️ Garbage & Sanitation',
  electricity: '⚡ Electricity Supply',
  water: '💧 Water Supply',
  roads: '🛣️ Roads & Infrastructure',
  other: '📋 General',
};

export default function SuccessPage() {
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('lastComplaint');
    if (stored) {
      setComplaint(JSON.parse(stored));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleDownloadPDF = async () => {
    if (!complaint) return;

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Header
    doc.setFillColor(16, 120, 60);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('JanMitraN', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Civic Complaint Confirmation', 20, 30);

    // Complaint ID
    doc.setTextColor(16, 120, 60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Complaint ID:', 20, 55);
    doc.setFontSize(18);
    doc.text(complaint.id, 75, 55);

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 62, 190, 62);

    // Details
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const details = [
      ['Name', complaint.name],
      ['Category', sectorNames[complaint.sector]?.replace(/[^\w\s&]/g, '').trim() || complaint.sector],
      ['Subject', complaint.subject],
      ['Filed On', complaint.timestamp],
      ['Status', 'Open'],
    ];

    let y = 75;
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(120, 120, 120);
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(value, 75, y);
      y += 10;
    });

    // Description
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 120, 120);
    doc.text('Description', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const descLines = doc.splitTextToSize(complaint.description, 160);
    doc.text(descLines, 20, y);
    y += descLines.length * 6 + 15;

    // Next Steps box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(20, y, 170, 45, 3, 3, 'F');
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 120, 60);
    doc.text('What Happens Next?', 25, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('1. Your complaint will be reviewed within 24 hours.', 25, y);
    y += 7;
    doc.text('2. You will receive email updates about the status.', 25, y);
    y += 7;
    doc.text('3. Track your complaint anytime at janmitran.in/track', 25, y);

    // Footer
    doc.setFillColor(16, 120, 60);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('JanMitraN — Making Your City Better, Together', 105, 290, { align: 'center' });

    doc.save(`JanMitraN-${complaint.id}.pdf`);
  };

  if (!complaint) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center animate-scale-in">
            <div className="rounded-full bg-emerald-100 p-5 animate-pulse-glow">
              <CheckCircle2 className="w-16 h-16 text-emerald-600" />
            </div>
          </div>

          {/* Success Heading */}
          <div className="space-y-2 animate-fade-in-up delay-200">
            <h1 className="text-4xl font-bold text-foreground">Complaint Registered Successfully</h1>
            <p className="text-lg text-muted-foreground">Your issue has been submitted to the authorities.</p>
          </div>

          {/* Complaint ID */}
          <div className="space-y-2 animate-fade-in-up delay-300">
            <p className="text-sm text-muted-foreground">Your Complaint ID</p>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5">
              <p className="text-3xl font-mono font-bold text-primary">{complaint.id}</p>
              <p className="text-xs text-muted-foreground mt-2">Save this for your records</p>
            </div>
          </div>

          {/* Complaint Summary Card */}
          <Card className="text-left shadow-lg border-border/30 animate-fade-in-up delay-400">
            <CardHeader>
              <CardTitle>Complaint Summary</CardTitle>
              <CardDescription>Details of your registered complaint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{complaint.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{sectorNames[complaint.sector] || complaint.sector}</p>
                </div>
                <div className="col-span-2 p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-medium">{complaint.subject}</p>
                </div>
                <div className="col-span-2 p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm mt-1 text-foreground">{complaint.description}</p>
                </div>
                <div className="col-span-2 p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-sm">{complaint.timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 animate-fade-in-up delay-500">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Download className="w-4 h-4" />
              Download PDF Receipt
            </Button>
            <Link href="/track">
              <Button variant="outline" className="w-full gap-2 border-border/50">
                <Search className="w-4 h-4" />
                Track Complaint
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 group">
                Go Back to Home
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Next Steps */}
          <div className="border-t border-border/50 pt-8 space-y-4 text-left animate-fade-in-up delay-600">
            <h3 className="font-semibold text-foreground">What Happens Next?</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Your complaint will be reviewed by the authorities within 24 hours.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>You will receive updates via email about the status of your complaint.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Track your complaint anytime using your Complaint ID.</span>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
