import { Navbar } from '@/components/admin/navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="flex flex-col min-h-screen relative"
      style={{
        backgroundImage: 'url(/images/nature-bg-admin-dashboard.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-black/30 to-teal-900/40 pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}
