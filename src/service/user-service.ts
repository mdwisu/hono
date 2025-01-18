import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception";

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    // validari request
    request = UserValidation.REGISTER.parse(request);
    // cek apakah ada di database atau tidak
    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: request.username,
      },
    });
    if (totalUserWithSameUsername != 0) {
      throw new HTTPException(400, {
        message: "Username already exists",
      });
    }
    // hash password
    request.password = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    // save to database
    const user = await prismaClient.user.create({
      data: request,
    });
    // return
    return toUserResponse(user);
  }
  static async login(request: LoginUserRequest): Promise<UserResponse> {
    // validari request
    request = UserValidation.LOGIN.parse(request);
    // cek apakah ada di database atau tidak
    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username,
      },
    });
    if (!user) {
      throw new HTTPException(401, {
        message: "Username or password is wrong",
      });
    }
    // cek password
    const isValidPassword = await Bun.password.verify(
      request.password,
      user.password
    );
    if (!isValidPassword) {
      throw new HTTPException(401, {
        message: "Username or password is wrong",
      });
    }
    user = await prismaClient.user.update({
      where: {
        username: request.username,
      },
      data: {
        token: crypto.randomUUID(),
      },
    });
    // return
    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(token: string | undefined | null): Promise<User> {
    const result = UserValidation.TOKEN.safeParse(token);
    if (result.error) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    token = result.data;

    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    return user;
  }
}
