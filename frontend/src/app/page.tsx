import { TravelLandingPage } from "@/components/travel-landing/travel-landing-page";
import { getPosts } from "@/lib/api/posts";
import { getDestinations, getTours } from "@/lib/api/tours";

export const dynamic = "force-dynamic";

async function getFeaturedTours() {
  try {
    const result = await getTours({ limit: 3 });
    return result.items;
  } catch {
    return [];
  }
}

async function getHomeDestinations() {
  try {
    return await getDestinations();
  } catch {
    return [];
  }
}

async function getLatestPosts() {
  try {
    const result = await getPosts({ limit: 3 });
    return result.items;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [featuredTours, destinations, posts] = await Promise.all([
    getFeaturedTours(),
    getHomeDestinations(),
    getLatestPosts(),
  ]);

  return (
    <TravelLandingPage
      destinations={destinations}
      featuredTours={featuredTours}
      posts={posts}
    />
  );
}
