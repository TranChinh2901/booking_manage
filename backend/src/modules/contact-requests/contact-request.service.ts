import { Repository } from "typeorm";

import { AppError } from "@/common/error.response";
import { AppDataSource } from "@/config/config-database";
import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";

import {
  CreateContactRequestDto,
  UpdateContactRequestDto,
} from "./dto/contact-request.dto";
import { ContactRequest } from "./entities/contact-request.entity";

export class ContactRequestService {
  private contactRequestRepository: Repository<ContactRequest>;

  constructor() {
    this.contactRequestRepository = AppDataSource.getRepository(ContactRequest);
  }

  async getAll(): Promise<ContactRequest[]> {
    return await this.contactRequestRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number): Promise<ContactRequest> {
    const contactRequest = await this.contactRequestRepository.findOne({
      where: { id },
    });

    if (!contactRequest) {
      throw new AppError(
        ErrorMessages.CONTACT_REQUEST_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
        ErrorCode.CONTACT_REQUEST_NOT_FOUND
      );
    }

    return contactRequest;
  }

  async create(dto: CreateContactRequestDto): Promise<ContactRequest> {
    const contactRequest = this.contactRequestRepository.create(dto);
    return await this.contactRequestRepository.save(contactRequest);
  }

  async update(
    id: number,
    dto: UpdateContactRequestDto
  ): Promise<ContactRequest> {
    const contactRequest = await this.getById(id);
    contactRequest.status = dto.status;
    return await this.contactRequestRepository.save(contactRequest);
  }
}

export default new ContactRequestService();
