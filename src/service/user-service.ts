import { prismaClient } from "../application/database";
import {
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
  async getUser(username: string) {}
}
