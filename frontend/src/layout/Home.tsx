import { HeroSection } from "@/components/Home/hero-section";
import { CategoriesSection } from "@/components/Home/categories-section";
import { ListingsSection } from "@/components/Home/listings-section";
import { HowItWorksSection } from "@/components/Home/how-it-works-section";
import { CTABannerSection } from "@/components/Home/cta-banner-section";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <HeroSection />
      <CategoriesSection />
      <ListingsSection />
      <HowItWorksSection />
      <CTABannerSection />
    </main>
  );
}
