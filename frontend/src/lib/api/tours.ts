import { apiFetch, toQueryString } from "./client";
import type {
  Destination,
  PaginatedItems,
  Review,
  Tour,
  TourListQuery,
  TourSchedule,
} from "./types";

export async function getTours(query: TourListQuery = {}) {
  return apiFetch<PaginatedItems<Tour>>(
    `/tours${toQueryString({
      keyword: query.keyword,
      destinationId: query.destinationId,
      categoryId: query.categoryId,
      page: query.page,
      limit: query.limit,
    })}`,
    { cache: "no-store" }
  );
}

export async function getDestinations() {
  return apiFetch<Destination[]>("/destinations", {
    cache: "no-store",
  });
}

export async function getTourBySlug(slug: string) {
  return apiFetch<Tour>(`/tours/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

export async function getTourSchedules(tourId?: number) {
  return apiFetch<TourSchedule[]>(
    `/tour-schedules${toQueryString({ tourId })}`,
    { cache: "no-store" }
  );
}

export async function getTourReviews(tourId: number) {
  return apiFetch<Review[]>(`/reviews${toQueryString({ tourId })}`, {
    cache: "no-store",
  });
}
