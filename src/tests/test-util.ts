import { prismaClient } from "../application/database";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "test",
        password: "test",
        name: await Bun.password.hash("test", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        token: "test",
      },
    });
  }

  static async delete () {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      }
    })
  }
}
