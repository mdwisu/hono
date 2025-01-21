import { Address, User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { HTTPException } from "hono/http-exception";

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

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.GET.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    const address = await prismaClient.address.findFirst({
      where: {
        contact_id: request.contact_id,
        id: request.id,
      },
    });
    if (!address) {
      throw new HTTPException(404, { message: "Address not found" });
    }
    return toAddressResponse(address);
  }

  static async addressMustExist(
    contactId: number,
    addressId: number
  ): Promise<Address> {
    const Address = await prismaClient.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });
    if (!Address) {
      throw new HTTPException(404, { message: "Address not found" });
    }
    return Address;
  }

  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    request = AddressValidation.UPDATE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    await this.addressMustExist(request.contact_id, request.id);

    const address = await prismaClient.address.update({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
      data: request,
    });
    return toAddressResponse(address);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<boolean> {
    request = AddressValidation.REMOVE.parse(request);
    await ContactService.contactMustExist(user, request.contact_id);
    await this.addressMustExist(request.contact_id, request.id);
    await prismaClient.address.delete({
      where: {
        id: request.id,
        contact_id: request.contact_id,
      },
    });
    return true;
  }
}
