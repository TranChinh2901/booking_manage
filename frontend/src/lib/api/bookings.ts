import { apiFetch } from "./client";
import type { Booking, CreateBookingPayload } from "./types";

export function createBooking(payload: CreateBookingPayload, token: string) {
  return apiFetch<Booking>("/bookings", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getMyBookings(token: string) {
  return apiFetch<Booking[]>("/bookings/my", {
    token,
    cache: "no-store",
  });
}

export function cancelMyBooking(id: number, token: string) {
  return apiFetch<Booking>(`/bookings/${id}/cancel`, {
    method: "PATCH",
    token,
  });
}
