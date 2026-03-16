import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ResolvedIssues } from '@/components/landing/resolved-issues';
import { About } from '@/components/landing/about';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ResolvedIssues />
      <About />
      <Footer />
    </div>
  );
}
