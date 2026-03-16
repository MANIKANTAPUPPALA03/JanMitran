'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#about', label: 'About' },
    { href: '/track', label: 'Track Complaint' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/20'
          : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden transition-all duration-300 ${
            scrolled
              ? 'bg-primary/10 border border-primary/20'
              : 'bg-white/10 border border-white/20'
          }`}>
            <Image src="/logo.png" alt="JanMitraN Logo" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <h1 className={`text-xl font-bold transition-colors duration-300 ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}>
            JanMitraN
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={`font-medium transition-all duration-300 ${
                  scrolled
                    ? 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <Link href="/register">
            <Button
              className={`ml-2 font-semibold transition-all duration-300 ${
                scrolled
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
              }`}
            >
              Report Issue
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button
              variant="ghost"
              className={`text-sm transition-all duration-300 ${
                scrolled
                  ? 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`transition-colors duration-300 ${
                scrolled
                  ? 'text-foreground hover:bg-foreground/5'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-xl border-l border-border/50">
            <div className="flex flex-col gap-2 mt-8">
              <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="JanMitraN Logo" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-bold text-foreground">JanMitraN</span>
              </div>

              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground/70 hover:text-foreground hover:bg-foreground/5 font-medium"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}

              <div className="border-t border-border/50 my-3" />

              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20">
                  Report Issue
                </Button>
              </Link>

              <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-border/50 text-foreground/60 hover:text-foreground">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
