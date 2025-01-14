import { Hono } from "hono";
import { user } from "./routes/user";
import { app } from "./routes/app";

app.route("/", app);

export default {
  port: 3000,
  fetch: app.fetch,
};
