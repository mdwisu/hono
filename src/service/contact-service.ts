import { Contact, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
  UpdateContactRequest,
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
    const contact = await this.contactMustExist(user, contactId);

    return toContactResponse(contact);
  }

  static async contactMustExist(
    user: User,
    contactId: number
  ): Promise<Contact> {
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
    return contact;
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    request = contactValidation.UPDATE.parse(request);

    await this.contactMustExist(user, request.id);

    const updatedContact = await prismaClient.contact.update({
      where: {
        username: user.username,
        id: request.id,
      },
      data: request,
    });

    return toContactResponse(updatedContact);
  }

  static async delete(user: User, contactId: number): Promise<boolean> {
    contactId = contactValidation.DELETE.parse(contactId);
    await this.contactMustExist(user, contactId);
    await prismaClient.contact.delete({
      where: {
        username: user.username,
        id: contactId,
      },
    });
    return true;
  }
}
