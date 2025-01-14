import { Hono } from "hono";

export const book = new Hono().basePath("/book");
book.get("/", (c) => c.text("List Books")); // GET /book
book.post("/", (c) => c.text("Create Book")); // POST /book
