import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  AddressResponse,
  CreateAddressRequest,
  toAddressResponse,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.CREATE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    const address = await prismaClient.address.create({
      data: {
        ...request,
      },
    });
    return toAddressResponse(address);
  }
}
