import { Hono } from "hono";
import { book } from "./book";
import { user } from "./user";

export const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});
app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want see ${page} of ${id}`);
});
app.post("/posts", (c) => c.text("Created!", 201));
app.delete("/posts/:id", (c) => c.text(`${c.req.param("id")} is deleted!`));
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  );
};
app.get("/page", (c) => {
  return c.html(<View />);
});
import { basicAuth } from "hono/basic-auth";

// ...

app.use(
  "/admin/*",
  basicAuth({
    username: "admin",
    password: "secret",
  })
);
// Wildcard
app.get("/wild/*/card", (c) => {
  return c.text("GET /wild/*/card");
});
// Any HTTP methods
app.all("/hello", (c) => c.text("Any Method /hello"));
// Custom HTTP method
app.on("PURGE", "/cache", (c) => c.text("PURGE Method /cache"));
// Multiple Method
app.on(["PUT", "DELETE"], "/post", (c) => c.text("PUT or DELETE /post"));
// Multiple Paths
app.on("GET", ["/hello", "/ja/hello", "/en/hello"], (c) => c.text("Hello"));
// path parameter
app.get("/posts/:id/comment/:comment_id", async (c) => {
  const { id, comment_id } = c.req.param();
  // ...
});
// optional parameter
// Will match `/api/animal` and `/api/animal/:type`
app.get("/api/animal/:type?", (c) => c.text("Animal!"));

app.route("/", user);
app.route("/", user);
// regex parameter
app.get("/post/:date{[0-9]+}/:title{[a-z]+}", async (c) => {
  const { date, title } = c.req.param();
  // ...
});
//  chained route
app
  .get("/endpoint", (c) => {
    return c.text("GET /endpoint");
  })
  .post((c) => {
    return c.text("POST /endpoint");
  })
  .delete((c) => {
    return c.text("DELETE /endpoint");
  });

app.get("/admin", (c) => {
  return c.text("You are authorized!");
});
app.route("/", book); // Handle /book
app.route("/", user); // Handle /user
