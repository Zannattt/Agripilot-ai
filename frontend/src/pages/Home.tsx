import Hero from '../components/landing/Hero';
import StatsBand from '../components/landing/StatsBand';
import ProblemSolution from '../components/landing/ProblemSolution';
import Features from '../components/landing/Features';
import DashboardPreview from '../components/landing/DashboardPreview';
import VoiceShowcase from '../components/landing/VoiceShowcase';
import ImpactSection from '../components/landing/ImpactSection';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBand />
      <ProblemSolution />
      <Features />
      <DashboardPreview />
      <VoiceShowcase />
      <ImpactSection />
      <HowItWorks />
      <Testimonials />
      <Pricing />
    </main>
  );
}
