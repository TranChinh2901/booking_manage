import { apiFetch, getApiUrl, toQueryString } from "./client";
import type {
  ApiResponse,
  Booking,
  Category,
  ContactRequest,
  DashboardSummary,
  Destination,
  PaginatedItems,
  Post,
  RevenueByMonth,
  Review,
  TopTour,
  Tour,
  TourImage,
  TourSchedule,
  User,
} from "./types";

type AdminToken = {
  token: string;
};

export type DestinationPayload = {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  status?: string;
};

export type CategoryPayload = {
  name: string;
  slug?: string;
  description?: string;
  status?: string;
};

export type TourPayload = {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  destinationId: number;
  categoryId: number;
  priceAdult: number;
  priceChild?: number;
  durationDays?: number;
  durationNights?: number;
  departureLocation?: string;
  transport?: string;
  maxPeople?: number;
  status?: string;
  images?: TourImage[];
};

export type TourSchedulePayload = {
  tourId?: number;
  startDate?: string;
  endDate?: string;
  availableSeats?: number;
  bookedSeats?: number;
  priceAdult?: number;
  priceChild?: number;
  status?: string;
};

export type PostPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  status?: string;
};

export type UserUpdatePayload = {
  name?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
};

export type BookingStatusPayload = {
  status?: string;
  paymentStatus?: string;
};

export type UploadedImage = {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
};

async function uploadFetch<T>(
  path: string,
  formData: FormData,
  token: string
): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Unable to upload image.");
  }

  return payload.data;
}

export function uploadAdminImage(file: File, token: string, folder = "admin") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  return uploadFetch<UploadedImage>("/uploads/image", formData, token);
}

export function uploadAdminImages(files: File[], token: string, folder = "admin") {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  formData.append("folder", folder);

  return uploadFetch<UploadedImage[]>("/uploads/images", formData, token);
}

export function getDashboardSummary({ token }: AdminToken) {
  return apiFetch<DashboardSummary>("/admin/dashboard/summary", {
    token,
    cache: "no-store",
  });
}

export function getRevenueByMonth(year: number, { token }: AdminToken) {
  return apiFetch<RevenueByMonth[]>(
    `/admin/dashboard/revenue${toQueryString({ year })}`,
    { token, cache: "no-store" }
  );
}

export function getTopTours(limit: number, { token }: AdminToken) {
  return apiFetch<TopTour[]>(
    `/admin/dashboard/top-tours${toQueryString({ limit })}`,
    { token, cache: "no-store" }
  );
}

export function getAdminUsers({ token }: AdminToken) {
  return apiFetch<User[]>("/admin/users", { token, cache: "no-store" });
}

export function updateAdminUser(id: number, payload: UserUpdatePayload, token: string) {
  return apiFetch<User>(`/admin/users/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteAdminUser(id: number, token: string) {
  return apiFetch<void>(`/admin/users/${id}`, { method: "DELETE", token });
}

export function getAdminDestinations({ token }: AdminToken) {
  return apiFetch<Destination[]>("/admin/destinations", { token, cache: "no-store" });
}

export function createDestination(payload: DestinationPayload, token: string) {
  return apiFetch<Destination>("/admin/destinations", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateDestination(id: number, payload: DestinationPayload, token: string) {
  return apiFetch<Destination>(`/admin/destinations/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteDestination(id: number, token: string) {
  return apiFetch<void>(`/admin/destinations/${id}`, { method: "DELETE", token });
}

export function getAdminCategories({ token }: AdminToken) {
  return apiFetch<Category[]>("/admin/categories", { token, cache: "no-store" });
}

export function createCategory(payload: CategoryPayload, token: string) {
  return apiFetch<Category>("/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: number, payload: CategoryPayload, token: string) {
  return apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: number, token: string) {
  return apiFetch<void>(`/admin/categories/${id}`, { method: "DELETE", token });
}

export function getAdminTours(token: string) {
  return apiFetch<PaginatedItems<Tour>>(
    `/admin/tours${toQueryString({ page: 1, limit: 100 })}`,
    { token, cache: "no-store" }
  );
}

export function createTour(payload: TourPayload, token: string) {
  return apiFetch<Tour>("/admin/tours", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateTour(id: number, payload: Partial<TourPayload>, token: string) {
  return apiFetch<Tour>(`/admin/tours/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteTour(id: number, token: string) {
  return apiFetch<void>(`/admin/tours/${id}`, { method: "DELETE", token });
}

export function getAdminTourSchedules({ token }: AdminToken) {
  return apiFetch<TourSchedule[]>("/admin/tour-schedules", {
    token,
    cache: "no-store",
  });
}

export function createTourSchedule(payload: Required<Pick<TourSchedulePayload, "tourId" | "startDate" | "endDate" | "availableSeats" | "priceAdult">> & TourSchedulePayload, token: string) {
  return apiFetch<TourSchedule>("/admin/tour-schedules", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateTourSchedule(id: number, payload: TourSchedulePayload, token: string) {
  return apiFetch<TourSchedule>(`/admin/tour-schedules/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteTourSchedule(id: number, token: string) {
  return apiFetch<void>(`/admin/tour-schedules/${id}`, { method: "DELETE", token });
}

export function getAdminBookings({ token }: AdminToken) {
  return apiFetch<Booking[]>("/admin/bookings", { token, cache: "no-store" });
}

export function updateBookingStatus(id: number, payload: BookingStatusPayload, token: string) {
  return apiFetch<Booking>(`/admin/bookings/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function cancelBooking(id: number, token: string) {
  return apiFetch<Booking>(`/admin/bookings/${id}/cancel`, {
    method: "PATCH",
    token,
  });
}

export function getAdminReviews({ token }: AdminToken) {
  return apiFetch<Review[]>("/admin/reviews", { token, cache: "no-store" });
}

export function updateReview(id: number, payload: { rating?: number; comment?: string; status?: string }, token: string) {
  return apiFetch<Review>(`/admin/reviews/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteReview(id: number, token: string) {
  return apiFetch<void>(`/admin/reviews/${id}`, { method: "DELETE", token });
}

export function getAdminPosts(token: string) {
  return apiFetch<PaginatedItems<Post>>(
    `/admin/posts${toQueryString({ page: 1, limit: 100 })}`,
    { token, cache: "no-store" }
  );
}

export function createPost(payload: PostPayload, token: string) {
  return apiFetch<Post>("/admin/posts", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updatePost(id: number, payload: Partial<PostPayload>, token: string) {
  return apiFetch<Post>(`/admin/posts/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function deletePost(id: number, token: string) {
  return apiFetch<void>(`/admin/posts/${id}`, { method: "DELETE", token });
}

export function getAdminContactRequests({ token }: AdminToken) {
  return apiFetch<ContactRequest[]>("/admin/contact-requests", {
    token,
    cache: "no-store",
  });
}

export function updateContactRequest(id: number, status: string, token: string) {
  return apiFetch<ContactRequest>(`/admin/contact-requests/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}
