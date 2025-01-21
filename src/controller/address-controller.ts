import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { ApplicationVariables } from "../model/app-model";
import {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
import { User } from "@prisma/client";
import { AddressService } from "../service/address-service";

export const addressController = new Hono<{
  Variables: ApplicationVariables;
}>();
addressController.use(authMiddleware);

addressController.post("/api/contacts/:id/addresses", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const request = (await c.req.json()) as CreateAddressRequest;
  request.contact_id = contactId;
  const response = await AddressService.create(user, request);
  return c.json({
    data: response,
  });
});

addressController.get(
  "/api/contacts/:contact_id/addresses/:address_id",
  async (c) => {
    const user = c.get("user") as User;
    const request: GetAddressRequest = {
      contact_id: Number(c.req.param("contact_id")),
      id: Number(c.req.param("address_id")),
    };
    const response = await AddressService.get(user, request);
    return c.json({
      data: response,
    });
  }
);

addressController.put(
  "/api/contacts/:contact_id/addresses/:address_id",
  async (c) => {
    const user = c.get("user") as User;
    const request = (await c.req.json()) as UpdateAddressRequest;
    request.contact_id = Number(c.req.param("contact_id"));
    request.id = Number(c.req.param("address_id"));
    const response = await AddressService.update(user, request);
    return c.json({
      data: response,
    });
  }
);
