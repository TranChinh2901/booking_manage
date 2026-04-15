import { PageShell } from "@/components/layout/page-shell";
import { BookingPreview } from "./sections/booking-preview";
import { CtaSection } from "./sections/cta-section";
import { DestinationShowcase } from "./sections/destination-showcase";
import { HeroSection } from "./sections/hero-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import type { Tour } from "@/lib/api/types";

type TravelLandingPageProps = {
  featuredTours: Tour[];
};

export function TravelLandingPage({ featuredTours }: TravelLandingPageProps) {
  return (
    <PageShell>
      <HeroSection />
      <DestinationShowcase tours={featuredTours} />
      <BookingPreview />
      <TestimonialsSection />
      <CtaSection />
    </PageShell>
  );
}
