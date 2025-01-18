import { Hono } from "hono";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UpdateUserRequest,
} from "../model/user-model";
import { UserService } from "../service/user-service";
import { ApplicationVariables } from "../model/app-model";
import { User } from "@prisma/client";

export const userController = new Hono<{
  Variables: ApplicationVariables;
}>().basePath("/api/users");

userController.post("/", async (c: any) => {
  const request = (await c.req.json()) as RegisterUserRequest;
  const response = await UserService.register(request);
  return c.json({
    data: response,
  });
});
userController.post("/login", async (c: any) => {
  const request = (await c.req.json()) as LoginUserRequest;
  const response = await UserService.login(request);
  return c.json({
    data: response,
  });
});

userController.use(async (c, next) => {
  const token = c.req.header("Authorization");
  const user = await UserService.get(token);

  c.set("user", user);

  await next();
});
userController.get("/current", async (c) => {
  // ambil user
  const user = c.get("user") as User;

  return c.json({
    data: toUserResponse(user),
  });
});

userController.patch("/current", async (c) => {
  const user = c.get("user") as User;
  const request = (await c.req.json()) as UpdateUserRequest;
  const response = await UserService.update(user, request);
  return c.json({
    data: response,
  });
});

userController.delete("/logout", async (c) => {
  const user = c.get("user") as User;
  const response = await UserService.logout(user);
  return c.json({
    data: response,
  });
});
