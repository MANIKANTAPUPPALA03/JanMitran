'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, LogIn, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      // Store token for API calls
      sessionStorage.setItem('adminToken', idToken);
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminEmail', formData.email);

      router.push('/admin/dashboard');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorCode = (err as { code?: string })?.code;
      switch (errorCode) {
        case 'auth/user-not-found':
          setError('No admin account found with this email.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl shadow-2xl p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
        <p className="text-muted-foreground">Enter your admin credentials to access the portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-semibold text-sm">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="bg-white border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
