import { HeroSection } from "@/components/home/hero-section"
import { FeaturedFacilities } from "@/components/home/featured-facilities"
import { HowItWorks } from "@/components/home/how-it-works"
import { Testimonials } from "@/components/home/testimonials"
import { StatsSection } from "@/components/home/stats-section"

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturedFacilities />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
    </div>
  )
}
