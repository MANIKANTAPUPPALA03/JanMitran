'use client';

import { useState } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, AlertCircle, CheckCircle2, Clock, FileWarning } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface TrackedComplaint {
  id: string;
  name: string;
  sector: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  timestamp: string;
  updatedAt: string;
}

const statusConfig = {
  open: { color: 'destructive' as const, label: 'Open', icon: AlertCircle, description: 'Your complaint is awaiting review by the concerned department.', bg: 'bg-red-50 border-red-200', text: 'text-red-600', dot: 'bg-red-500' },
  'in-progress': { color: 'secondary' as const, label: 'In Progress', icon: Clock, description: 'Your complaint is being actively worked on by the concerned department.', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', dot: 'bg-amber-500' },
  resolved: { color: 'default' as const, label: 'Resolved', icon: CheckCircle2, description: 'Your complaint has been resolved. Thank you for making your city better!', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-500' },
};

const sectorNames: Record<string, string> = {
  garbage: '🗑️ Garbage & Sanitation',
  electricity: '⚡ Electricity Supply',
  water: '💧 Water Supply',
  roads: '🛣️ Roads & Infrastructure',
  other: '📋 General',
};

export default function TrackPage() {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState<TrackedComplaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = complaintId.trim();
    if (!trimmedId) return;

    setIsLoading(true);
    setError('');
    setComplaint(null);
    setSearched(true);

    try {
      const response = await fetch(`${API_URL}/complaints/track/${encodeURIComponent(trimmedId)}`);

      if (response.status === 404) {
        setError('No complaint found with this ID. Please check and try again.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to track complaint');
      }

      const data = await response.json();
      setComplaint(data.complaint);
    } catch (err) {
      console.error('Track error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

      <main className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-8 px-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 animate-fade-in-down">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
              Complaint Tracking
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">Track Your Complaint</h1>
            <p className="text-lg text-white/75">Enter your Complaint ID to check the current status</p>
          </div>

          {/* Search Form */}
          <div className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up delay-200">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="Enter Complaint ID (e.g., JM-20250001)"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 text-base"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 gap-2 shadow-md shadow-primary/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track
              </Button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="glass-card rounded-2xl shadow-2xl p-6 flex items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <FileWarning className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Not Found</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {complaint && (
            <Card className="glass-card shadow-2xl border-0 rounded-2xl overflow-hidden animate-scale-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Complaint Details</CardTitle>
                  <Badge variant={statusConfig[complaint.status].color} className="text-sm px-3 py-1">
                    <div className={`w-2 h-2 rounded-full ${statusConfig[complaint.status].dot} mr-2 animate-pulse`} />
                    {statusConfig[complaint.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Banner */}
                <div className={`rounded-xl p-4 ${statusConfig[complaint.status].bg} border`}>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const StatusIcon = statusConfig[complaint.status].icon;
                      return <StatusIcon className={`w-6 h-6 ${statusConfig[complaint.status].text}`} />;
                    })()}
                    <p className="text-sm text-foreground/80">{statusConfig[complaint.status].description}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Complaint ID</p>
                    <p className="font-bold text-primary font-mono text-lg">{complaint.id}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Filed By</p>
                    <p className="font-semibold text-foreground">{complaint.name}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Category</p>
                    <p className="font-semibold text-foreground">{sectorNames[complaint.sector] || complaint.sector}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Subject</p>
                    <p className="font-semibold text-foreground">{complaint.subject}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Filed On</p>
                    <p className="text-sm text-foreground/80">{complaint.timestamp}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-sm text-foreground/80">{complaint.updatedAt}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-border/50 pt-5">
                  <p className="text-sm font-semibold text-foreground mb-4">Status Timeline</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white bg-emerald-600 shadow-md shadow-emerald-500/30">
                      ✓
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        complaint.status === 'open' ? 'w-0' :
                        complaint.status === 'in-progress' ? 'w-1/2 bg-gradient-to-r from-emerald-500 to-amber-500' :
                        'w-full bg-gradient-to-r from-emerald-500 to-emerald-400'
                      }`} />
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      complaint.status === 'in-progress' || complaint.status === 'resolved'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {complaint.status === 'in-progress' || complaint.status === 'resolved' ? '✓' : '2'}
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        complaint.status === 'resolved' ? 'w-full bg-gradient-to-r from-amber-500 to-emerald-500' : 'w-0'
                      }`} />
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      complaint.status === 'resolved'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {complaint.status === 'resolved' ? '✓' : '3'}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                    <span>Filed</span>
                    <span>In Progress</span>
                    <span>Resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
