import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-foreground to-foreground/95 text-background relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      {/* Subtle decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                JM
              </div>
              <h3 className="text-2xl font-bold">JanMitraN</h3>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              A citizen-centric civic complaint portal addressing public grievances across sanitation, electricity, water, roads, and more.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-background/10 text-background/70 text-xs font-medium border border-background/10">
                🇮🇳 SIH 2025
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                AI-Powered
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/register', label: 'Report an Issue' },
                { href: '/track', label: 'Track Your Complaint' },
                { href: '/admin/login', label: 'Admin Portal' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-background transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-semibold text-lg">Contact</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-center gap-2">
                <span className="text-base">📧</span>
                <span>janmitranproject@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">🌐</span>
                <span>JanMitraN Civic Portal</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">📍</span>
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-xs text-background/40">
          <p>© {new Date().getFullYear()} JanMitraN. All rights reserved. Built with ❤️ for a better India.</p>
        </div>
      </div>
    </footer>
  );
}
