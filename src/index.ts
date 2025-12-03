import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { env } from "./config/env";
import router from "./route";

const app = new Elysia().use(
  staticPlugin({
    assets: "public", // folder public
    prefix: "/", // akses langsung
  })
);

app.get("/", () => {
  return {
    author: "AMIMINN",
    version: "1.0.0",
    project: "GMarlet-API",
    github: "https://github.com/amiminn/GMarket-API",
  };
});
app.use(router);

app.all("*", () => {
  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
});

app.listen(env.PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
