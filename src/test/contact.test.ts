import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { ContactTest, UserTest } from "./test-util";
import { app } from "..";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if token is invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "salah",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });
    console.log(response);
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should rejected if request is invalid", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });
    console.log(response);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should success if contact is valid (only first name)", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Dwiw",
      }),
    });
    console.log(response);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Dwiw");
    expect(body.data.last_name).toBeNull();
    expect(body.data.email).toBeNull();
    expect(body.data.phone).toBeNull();
  });

  it("should success if contact is valid (all field)", async () => {
    const response = await app.request("/api/contacts", {
      method: "post",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Dwiw",
        last_name: "Susanto",
        email: "dwisusanto784@gmail.com",
        phone: "081218583533",
      }),
    });
    console.log(response);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Dwiw");
    expect(body.data.last_name).toBe("Susanto");
    expect(body.data.email).toBe("dwisusanto784@gmail.com");
    expect(body.data.phone).toBe("081218583533");
  })
});
