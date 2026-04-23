import { Navbar } from "./_components/navbar";
import { HeroSection } from "./_components/hero-section";
import { ScreenshotsCarousel } from "./_components/screenshots-carousel";
import { AboutSection } from "./_components/about-section";
import { TourSection } from "./_components/tour-section";
import { AiSection } from "./_components/ai-section";
import { PricingSection } from "./_components/pricing-section";
import { ContactSection } from "./_components/contact-section";
import { Footer } from "./_components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navbar />
      <HeroSection />
      <ScreenshotsCarousel />
      <AboutSection />
      <TourSection />
      <AiSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
