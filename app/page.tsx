import HeroSection from "@/components/layout/hero-section";
import AboutSection from "@/components/layout/about-section";
import FeaturesSection from "@/components/layout/features-section";
import DemoShowcase from "@/components/layout/demo-showcase";
import StepsSection from "@/components/layout/steps-section";
import FAQSection from "@/components/layout/faq-section";
import CTASection from "@/components/layout/cta-section";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Demo Showcase Section */}
      <DemoShowcase />

      {/* Steps Section */}
      <StepsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <CTASection />
    </div>
  );
}
