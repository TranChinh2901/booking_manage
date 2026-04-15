import { TravelLandingPage } from "@/components/travel-landing/travel-landing-page";
import { getTours } from "@/lib/api/tours";

export const dynamic = "force-dynamic";

async function getFeaturedTours() {
  try {
    const result = await getTours({ limit: 3 });
    return result.items;
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredTours = await getFeaturedTours();

  return <TravelLandingPage featuredTours={featuredTours} />;
}
