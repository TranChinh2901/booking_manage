import type { Tour } from "./api/types";
import { formatCurrency } from "./format";

export const fallbackTourImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=86";

export function getTourImage(tour: Tour) {
  return (
    tour.images.find((image) => image.isThumbnail)?.url ||
    tour.images[0]?.url ||
    tour.destination?.image ||
    fallbackTourImage
  );
}

export function getTourLocation(tour: Tour) {
  return tour.destination?.name || tour.departureLocation || "Travel tour";
}

export function getTourDuration(tour: Tour) {
  if (!tour.durationDays) {
    return "Flexible schedule";
  }

  return `${tour.durationDays} days ${tour.durationNights || 0} nights`;
}

export function getTourPrice(tour: Tour) {
  return formatCurrency(tour.priceAdult);
}
