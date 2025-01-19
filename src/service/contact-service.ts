import { User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { contactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    request = contactValidation.CREATE.parse(request);

    const contact = await prismaClient.contact.create({
      data: {
        ...request,
        username: user.username,
      },
    });
    return toContactResponse(contact);
  }
}
