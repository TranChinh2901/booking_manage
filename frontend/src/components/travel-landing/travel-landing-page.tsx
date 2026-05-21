import { PageShell } from "@/components/layout/page-shell";
import { Footer } from "@/components/layout/footer";
import { BookingPreview } from "./sections/booking-preview";
import { CtaSection } from "./sections/cta-section";
import { DestinationShowcase } from "./sections/destination-showcase";
import { HeroSection } from "./sections/hero-section";
import { PostsSection } from "./sections/posts-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import type { Destination, Post, Tour } from "@/lib/api/types";

type TravelLandingPageProps = {
  destinations: Destination[];
  featuredTours: Tour[];
  posts: Post[];
};

export function TravelLandingPage({
  destinations,
  featuredTours,
  posts,
}: TravelLandingPageProps) {
  return (
    <PageShell>
      <HeroSection />
      <DestinationShowcase destinations={destinations} tours={featuredTours} />
      <PostsSection posts={posts} />
      <BookingPreview />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </PageShell>
  );
}
