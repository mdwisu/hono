import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { app } from "..";

describe("POST /api/contacts/{idContact}/addresses", () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if request is not valid", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: "post",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          country: "",
          postal_code: "",
        }),
      }
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should rejected if contact not found", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contact.id + 1}/addresses`,
      {
        method: "post",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          country: "Indonesia",
          postal_code: "1234",
        }),
      }
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should success if request is valid", async () => {
    const contact = await ContactTest.get();
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: "post",
        headers: {
          Authorization: "test",
        },
        body: JSON.stringify({
          street: "test",
          city: "Jakarta",
          province: "DKI Jakarta",
          country: "Indonesia",
          postal_code: "1234",
        }),
      }
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe("test");
    expect(body.data.city).toBe("Jakarta");
    expect(body.data.province).toBe("DKI Jakarta");
    expect(body.data.country).toBe("Indonesia");
    expect(body.data.postal_code).toBe("1234");
  });
});

describe("GET /api/contacts/{idContact}/addresses/{idAddress}", () => {
  beforeEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();

    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should rejected if address not found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
      {
        method: "get",
        headers: {
          Authorization: "test",
        },
      }
    );
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should success if address found", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: "get",
        headers: {
          Authorization: "test",
        },
      }
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeDefined();
    expect(body.data.street).toBe(address.street);
    expect(body.data.city).toBe(address.city);
    expect(body.data.province).toBe(address.province);
    expect(body.data.country).toBe(address.country);
    expect(body.data.postal_code).toBe(address.postal_code);
  });
});
