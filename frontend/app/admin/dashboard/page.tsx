'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComplaintCard, type Complaint } from '@/components/admin/complaint-card';
import { Button } from '@/components/ui/button';
import { BarChart3, AlertCircle, Clock, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

type FilterStatus = 'all' | 'open' | 'in-progress' | 'resolved';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminRole, setAdminRole] = useState<string | null>(null);

  const getToken = () => sessionStorage.getItem('adminToken');

  const fetchComplaints = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        // Handle 403 specially
        if (response.status === 403) {
            sessionStorage.removeItem('adminAuth');
            sessionStorage.removeItem('adminToken');
            router.push('/admin/login');
            // Wait for redirect
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data.complaints);
      if (data.role) setAdminRole(data.role);
    } catch (err) {
      console.error('Fetch complaints error:', err);
      setError('Failed to load complaints. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleStatusUpdate = async (id: string, status: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update locally
      setComplaints(prev =>
        prev.map(c => (c.id === id ? { ...c, status: status as Complaint['status'] } : c))
      );
    } catch (err) {
      console.error('Status update error:', err);
      setError('Failed to update complaint status.');
    }
  };

  const handleDelete = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/complaints/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete complaint');
      }

      // Remove locally
      setComplaints(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete complaint.');
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    const token = sessionStorage.getItem('adminToken');
    if (!authStatus || !token) {
      router.push('/admin/login');
    } else {
      setIsAuthorized(true);
      fetchComplaints();
    }
  }, [router, fetchComplaints]);

  useEffect(() => {
    const status = searchParams.get('status') as FilterStatus | null;
    if (status) {
      setFilterStatus(status);
    } else {
      setFilterStatus('all');
    }
  }, [searchParams]);

  const filteredComplaints = filterStatus === 'all'
    ? complaints
    : complaints.filter(c => c.status === filterStatus);

  const stats = {
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    total: complaints.length,
  };

  if (!isAuthorized) {
    return null;
  }

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: BarChart3, color: 'text-primary', gradient: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200/50' },
    { label: 'Open', value: stats.open, icon: AlertCircle, color: 'text-red-600', gradient: 'from-red-500/10 to-orange-500/10', border: 'border-red-200/50' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-600', gradient: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-200/50' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', gradient: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-200/50' },
  ];

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-down">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-2">
             <p className="text-sm md:text-base text-white/75">Manage and track civic complaints</p>
             {adminRole && (
               <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/50 text-white text-xs font-semibold capitalize backdrop-blur-sm shadow-sm">
                 {adminRole === 'superadmin' ? 'Super Admin' : `${adminRole} Admin`}
               </span>
             )}
          </div>
        </div>
        <Button
          onClick={fetchComplaints}
          variant="outline"
          className="glass-card hover:bg-white/95 border-white/30 text-foreground gap-2 shadow-md"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${stat.border} animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`flex items-center gap-2 ${stat.color} mb-3`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground/70">{stat.label}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap animate-fade-in delay-300">
        {[
          { status: 'all' as FilterStatus, label: 'All Complaints' },
          { status: 'open' as FilterStatus, label: 'Open' },
          { status: 'in-progress' as FilterStatus, label: 'In Progress' },
          { status: 'resolved' as FilterStatus, label: 'Resolved' },
        ].map((filter) => (
          <Button
            key={filter.status}
            variant={filterStatus === filter.status ? 'default' : 'outline'}
            onClick={() => setFilterStatus(filter.status)}
            className={filterStatus === filter.status
              ? 'bg-primary hover:bg-primary/90 shadow-md shadow-primary/20'
              : 'glass-card hover:bg-white/95 border-white/30 text-foreground'
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError('')} className="ml-auto text-destructive hover:text-destructive">
            Dismiss
          </Button>
        </div>
      )}

      {/* Complaints Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          {filterStatus === 'all' ? 'All Complaints' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Complaints`}
          <span className="text-white/50 text-base font-normal ml-2">({filteredComplaints.length})</span>
        </h2>

        {isLoading ? (
          <div className="glass-card rounded-xl p-8 text-center shadow-lg">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-muted-foreground">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No complaints found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((complaint, index) => (
              <div
                key={complaint.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ComplaintCard
                  complaint={complaint}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
