import { ContactRequestStatus } from "../entities/contact-request.entity";

export interface CreateContactRequestDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateContactRequestDto {
  status: ContactRequestStatus;
}

export interface ContactRequestResponseDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
