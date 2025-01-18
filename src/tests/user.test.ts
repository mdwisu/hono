import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { logger } from "../application/logging";
import { app } from "..";
import { UserTest } from "./test-util";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserTest.delete();
  });
  it("should reject register new user if request is invalid", async () => {
    const response = await app.request("/api/users", {
      method: "post",
      body: JSON.stringify({
        username: "",
        password: "",
        name: "",
      }),
    });
    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
  it("should reject register new user if username already exists", async () => {
    await UserTest.create();
    const response = await app.request("/api/users", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "test",
        name: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(400);
    expect(body.errors).toBeDefined();
  });
  it("should register new user success", async () => {
    const response = await app.request("/api/users", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "test",
        name: "test",
      }),
    });
    const body = await response.json();
    logger.debug(body);
    expect(response.status).toBe(200);
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("test");
    expect(body.data.name).toBe("test");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });
  it("should login success", async () => {
    const response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
  });
  it("should login failed if username is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "salah",
        password: "test",
      }),
    });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should login failed if password is wrong", async () => {
    const response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "salah",
      }),
    });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should get current user", async () => {
    const response = await app.request("/api/users/current", {
      method: "get",
      headers: {
        Authorization: "test",
      },
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
    expect(body.data.username).toBe("test");
    expect(body.data.name).toBe("test");
  });
  it("should not be able to get user if token is invalid", async () => {
    const response = await app.request("/api/users/current", {
      method: "get",
      headers: {
        Authorization: "salah",
      },
    });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should not be able to get user if there is no authorization header", async () => {
    const response = await app.request("/api/users/current", {
      method: "get",
    });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
});

describe("PATH /api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should reject update user if request is invalid", async () => {
    const response = await app.request("/api/users/current", {
      method: "patch",
      body: JSON.stringify({
        name: "",
        password: "",
      }),
      headers: {
        Authorization: "test",
      },
    });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.errors).toBeDefined();
  });
  it("should be able to update name", async () => {
    const response = await app.request("/api/users/current", {
      method: "patch",
      body: JSON.stringify({
        name: "dwi",
      }),
      headers: {
        Authorization: "test",
      },
    });
    // expect(response.status).toBe(200);
    const body = await response.json();
    logger.error(body);
    expect(body.data).toBeDefined();
    expect(body.data.name).toBe("dwi");
  });
  it("should be able to update password", async () => {
    let response = await app.request("/api/users/current", {
      method: "patch",
      body: JSON.stringify({
        password: "baru",
      }),
      headers: {
        Authorization: "test",
      },
    });
    // expect(response.status).toBe(200);
    const body = await response.json();
    logger.error(body);
    expect(body.data).toBeDefined();

    response = await app.request("/api/users/login", {
      method: "post",
      body: JSON.stringify({
        username: "test",
        password: "baru",
      }),
    });
    expect(response.status).toBe(200);
  });
});
