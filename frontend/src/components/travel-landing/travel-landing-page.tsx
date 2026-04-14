import { PageShell } from "@/components/layout/page-shell";
import { BookingPreview } from "./sections/booking-preview";
import { CtaSection } from "./sections/cta-section";
import { DestinationShowcase } from "./sections/destination-showcase";
import { HeroSection } from "./sections/hero-section";
import { TestimonialsSection } from "./sections/testimonials-section";

export function TravelLandingPage() {
  return (
    <PageShell>
      <HeroSection />
      <DestinationShowcase />
      <BookingPreview />
      <TestimonialsSection />
      <CtaSection />
    </PageShell>
  );
}
