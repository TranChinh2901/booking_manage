export interface CreateTravelerDto {
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  travelerType: string;
  identityNumber?: string;
  nationality?: string;
}

export interface CreateTravelersDto {
  bookingId: number;
  travelers: CreateTravelerDto[];
}
