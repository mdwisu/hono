import { Hono } from "hono";
import { RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

export const userController = new Hono().basePath("/api/users");

userController.post("/", async (c: any) => {
  const request = await c.req.json() as RegisterUserRequest;
  const response = await UserService.register(request);
  return c.json({
    data: response,
  });
});
userController.get("/", async (c) => c.text("List Users"));
