'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Trash2, Loader2, Mail, MapPin, Image as ImageIcon } from 'lucide-react';

export interface Complaint {
  id: string;
  name: string;
  email: string;
  sector: string;
  subject: string;
  description: string;
  address: string;
  photoUrl?: string;
  status: 'open' | 'in-progress' | 'resolved';
  timestamp: string;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const statusConfig = {
  open: { color: 'destructive' as const, label: 'Open', border: 'border-l-red-500', dot: 'bg-red-500' },
  'in-progress': { color: 'secondary' as const, label: 'In Progress', border: 'border-l-amber-500', dot: 'bg-amber-500' },
  resolved: { color: 'default' as const, label: 'Resolved', border: 'border-l-emerald-500', dot: 'bg-emerald-500' },
};

const sectorNames: Record<string, string> = {
  garbage: '🗑️ Sanitation',
  electricity: '⚡ Electricity',
  water: '💧 Water',
  roads: '🛣️ Roads',
  other: '📋 General',
};

export function ComplaintCard({ complaint, onStatusUpdate, onDelete }: ComplaintCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const statusInfo = statusConfig[complaint.status];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === complaint.status) return;
    setIsUpdating(true);
    try {
      await onStatusUpdate(complaint.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete complaint ${complaint.id}? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await onDelete(complaint.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${statusInfo.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">{complaint.subject}</h3>
          <p className="text-sm text-muted-foreground font-mono">{complaint.id}</p>
        </div>
        <Badge variant={statusInfo.color} className="shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot} mr-1.5 animate-pulse`} />
          {statusInfo.label}
        </Badge>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/30">
            <p className="text-muted-foreground text-xs font-medium">Name</p>
            <p className="font-semibold text-foreground mt-0.5 truncate">{complaint.name}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/30">
            <p className="text-muted-foreground text-xs font-medium">Category</p>
            <p className="font-semibold text-foreground mt-0.5">{sectorNames[complaint.sector] || complaint.sector}</p>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-xs font-medium mb-1.5">Issue Description</p>
          <p className={`text-sm text-foreground/80 leading-relaxed ${showDetails ? '' : 'line-clamp-2'}`}>{complaint.description}</p>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="space-y-4 pt-3 border-t border-border/50 animate-fade-in">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary/60" />
                <span>{complaint.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary/60" />
                <span>{complaint.address}</span>
              </div>
            </div>
            
            {complaint.photoUrl && (
              <div className="space-y-1.5 pt-2">
                <p className="text-muted-foreground text-xs font-medium flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Attached Photo Evidence
                </p>
                <div className="rounded-lg overflow-hidden border border-border/30 bg-black/5">
                  {/* Since image URL is base64, we can render directly */}
                  <img src={complaint.photoUrl} alt="Complaint Evidence" className="w-full h-auto max-h-48 object-cover hover:object-contain transition-all duration-300" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Submitted: {complaint.timestamp}
        </div>

        {/* Status Update Dropdown */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Update Status</p>
          <Select
            value={complaint.status}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-full bg-white border-border/50 focus:border-primary focus:ring-primary/20">
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                <SelectValue />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">🔴 Open</SelectItem>
              <SelectItem value="in-progress">🟡 In Progress</SelectItem>
              <SelectItem value="resolved">🟢 Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 border-border/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary text-foreground transition-all"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Eye className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Details'}
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
