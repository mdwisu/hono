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
  });
});

describe("GET /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should 404 if contact not found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request(`/api/contacts/${contact.id + 1}`, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });
    expect(response.status).toBe(404);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should success if contact found", async () => {
    const contact = await ContactTest.get();

    const response = await app.request("/api/contacts/" + contact.id, {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });
    console.log(response);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe(contact.first_name);
    expect(body.data.last_name).toBe(contact.last_name);
    expect(body.data.email).toBe(contact.email);
    expect(body.data.phone).toBe(contact.phone);
    expect(body.data.id).toBe(contact.id);
  });
});

describe("PUT /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if request is invalid", async () => {
    const contact = await ContactTest.get();

    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "",
      }),
    });
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should rejected if id not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(`/api/contacts/${contact.id + 1}`, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Dwi",
      }),
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should success if request is valid", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: "put",
      headers: {
        Authorization: "test",
      },
      body: JSON.stringify({
        first_name: "Dwi",
        last_name: "Susanto",
        email: "dwisusanto784@gmail.com",
        phone: "081218583533",
      }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.first_name).toBe("Dwi");
    expect(body.data.last_name).toBe("Susanto");
    expect(body.data.email).toBe("dwisusanto784@gmail.com");
    expect(body.data.phone).toBe("081218583533");
  });
});

describe("DELETE /api/contacts/{id}", () => {
  beforeEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if id not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(`/api/contacts/${contact.id + 1}`, {
      method: "delete",
      headers: { Authorization: "test" },
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should success if request is valid", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(`/api/contacts/${contact.id}`, {
      method: "delete",
      headers: { Authorization: "test" },
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data).toBe(true);
  });
});
