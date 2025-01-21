import { Hono } from "hono";
import { ApplicationVariables } from "../model/app-model";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactService } from "../service/contact-service";
import { User } from "@prisma/client";

export const contactController = new Hono<{
  Variables: ApplicationVariables;
}>();
contactController.use(authMiddleware);

contactController.post("/api/contacts", async (c) => {
  const user = c.get("user") as User;
  const request = (await c.req.json()) as CreateContactRequest;
  const response = await ContactService.create(user, request);

  return c.json({
    data: response,
  });
});

contactController.get("/api/contacts/:id", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const response = await ContactService.get(user, contactId);
  return c.json({
    data: response,
  });
});

contactController.put("/api/contacts/:id", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const request = (await c.req.json()) as UpdateContactRequest;
  request.id = contactId;
  const response = await ContactService.update(user, request);
  return c.json({
    data: response,
  });
});

contactController.delete("/api/contacts/:id", async (c) => {
  const user = c.get("user") as User;
  const contactId = Number(c.req.param("id"));
  const response = await ContactService.delete(user, contactId);
  return c.json({
    data: response,
  });
});

contactController.get("/api/contacts", async (c) => {
  const user = c.get("user") as User;
  const request: SearchContactRequest = {
    name: c.req.query("name") as string,
    email: c.req.query("email") as string,
    phone: c.req.query("phone") as string,
    page: Number(c.req.query("page")) || 1,
    size: Number(c.req.query("size")) || 10,
  };
  const response = await ContactService.search(user, request);
  return c.json(response);
});