import { apiFetch } from "./client";

export type MoMoPaymentResponse = {
  payUrl: string;
  orderId: string;
};

export function createMoMoPayment(bookingId: number, token: string) {
  return apiFetch<MoMoPaymentResponse>("/payments/momo", {
    method: "POST",
    token,
    body: JSON.stringify({ bookingId }),
  });
}
