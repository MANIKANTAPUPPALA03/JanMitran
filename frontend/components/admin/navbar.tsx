'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  AlertCircle,
  Clock,
  CheckCircle2,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/dashboard?status=open', label: 'Open Complaints', icon: AlertCircle },
    { href: '/admin/dashboard?status=in-progress', label: 'In Progress', icon: Clock },
    { href: '/admin/dashboard?status=resolved', label: 'Resolved', icon: CheckCircle2 },
  ];

  const NavContent = () => (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname === '/admin/dashboard' && item.href === '/admin/dashboard');
        return (
          <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
            <Button
              className={`w-full md:w-auto justify-start md:justify-center gap-2 ${
                isActive 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              size="sm"
            >
              <Icon className="w-4 h-4" />
              <span className="md:hidden">{item.label}</span>
              <span className="hidden md:inline text-xs">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20">
            <Image src="/logo.png" alt="JanMitraN Logo" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white transition-opacity duration-300 group-hover:opacity-90">JanMitraN</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavContent />
        </div>

        {/* Mobile Menu + Logout */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 mt-6">
                <h2 className="text-lg font-semibold text-primary">Navigation</h2>
                <NavContent />
                <div className="border-t pt-4">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" size="sm">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logout */}
          <Link href="/" className="hidden md:block">
            <Button variant="ghost" size="icon" title="Logout" className="text-white/80 hover:text-white hover:bg-white/10">
              <LogOut className="w-5 h-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </Link>

          {/* Mobile Logout */}
          <Link href="/" className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
