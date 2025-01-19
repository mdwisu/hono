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
import { authMiddleware } from "../middleware/auth-middleware";

export const userController = new Hono<{
  Variables: ApplicationVariables;
}>();

userController.post("/", async (c) => {
  const request = (await c.req.json()) as RegisterUserRequest;
  const response = await UserService.register(request);
  return c.json({
    data: response,
  });
});
userController.post("/login", async (c) => {
  const request = (await c.req.json()) as LoginUserRequest;
  const response = await UserService.login(request);
  return c.json({
    data: response,
  });
});

userController.use(authMiddleware);
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
