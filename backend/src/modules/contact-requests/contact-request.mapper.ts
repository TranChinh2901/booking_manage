import { ContactRequestResponseDto } from "./dto/contact-request.dto";
import { ContactRequest } from "./entities/contact-request.entity";

export const toContactRequestResponseDto = (
  contactRequest: ContactRequest
): ContactRequestResponseDto => {
  return {
    id: contactRequest.id,
    name: contactRequest.name,
    email: contactRequest.email,
    phone: contactRequest.phone,
    subject: contactRequest.subject,
    message: contactRequest.message,
    status: contactRequest.status,
    createdAt: contactRequest.createdAt,
    updatedAt: contactRequest.updatedAt,
  };
};
