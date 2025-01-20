import { Contact } from "@prisma/client";
import { prismaClient } from "../application/database";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "test",
        password: await Bun.password.hash("test", {
          algorithm: "bcrypt",
          cost: 10,
        }),
        name: "test",
        token: "test",
      },
    });
  }

  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }
}

export class ContactTest {
  static async create() {
    await prismaClient.contact.create({
      data: {
        first_name: "Dwi",
        last_name: "Susanto",
        email: "test@gmail.com",
        phone: "081218583533",
        username: "test",
      },
    });
  }

  static async createMany(n: number) {
    for (let i = 0; i < n; i++) {
      await this.create();
    }
  }

  static async get(): Promise<Contact> {
    return await prismaClient.contact.findFirstOrThrow({
      where: {
        username: "test",
      },
    });
  }
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "test",
      },
    });
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }
}
