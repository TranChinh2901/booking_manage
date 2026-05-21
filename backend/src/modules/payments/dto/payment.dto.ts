export interface CreatePaymentDto {
  bookingId: number;
  method: string;
  amount: number;
  transactionRef?: string;
  note?: string;
}

export interface ConfirmPaymentDto {
  transactionRef?: string;
  note?: string;
}
