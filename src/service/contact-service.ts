import { User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from "../model/contact-model";
import { contactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";

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

  static async get(user: User, contactId: number): Promise<ContactResponse> {
    contactId = contactValidation.GET.parse(contactId);
    const contact = await prismaClient.contact.findFirst({
      where: {
        id: contactId,
        username: user.username,
      },
    });
    if (!contact) {
      throw new HTTPException(404, {
        message: "Contact not found",
      });
    }
    return toContactResponse(contact);
  }
}
