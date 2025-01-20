import { Contact, User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";
import { contactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { HTTPException } from "hono/http-exception";
import { Pageable } from "../model/page-model";

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

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    request = contactValidation.SEARCH.parse(request);
    const filters = [];
    if (request.name) {
      filters.push({
        OR: [
          { first_name: { contains: request.name } },
          { last_name: { contains: request.name } },
        ],
      });
    }
    if (request.email) {
      filters.push({
        email: {
          contains: request.email,
        },
      });
    }
    if (request.phone) {
      filters.push({
        phone: {
          contains: request.phone,
        },
      });
    }

    const whereClause = {
      username: user.username,
      ...(filters.length > 0 && { AND: filters }),
    };

    const skip = (request.page - 1) * request.size;

    const contacts = await prismaClient.contact.findMany({
      where: whereClause,
      take: request.size,
      skip: skip,
    });

    const total = await prismaClient.contact.count({
      where: whereClause,
    });

    return {
      data: contacts.map(toContactResponse),
      paging: {
        current_page: request.page,
        size: request.size,
        total_page: Math.ceil(total / request.size),
      },
    };
  }
}
