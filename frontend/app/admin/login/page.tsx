import Link from 'next/link';
import { LoginForm } from '@/components/admin/login-form';

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/images/nature-bg-admin-login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-black/45 to-teal-900/50" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center font-bold text-sm group-hover:bg-white/30 transition-colors">
                JM
              </div>
              <span className="text-3xl font-bold text-white">JanMitraN</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-lg text-white/75">Manage civic complaints and track resolutions</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
