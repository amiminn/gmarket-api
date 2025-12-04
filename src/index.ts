import { cors } from "@elysiajs/cors";
import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { env } from "./config/env";
import router from "./route";
const app = new Elysia();
app.use(
  staticPlugin({
    assets: "public", // folder public
    prefix: "/", // akses langsung
  })
);
app.use(
  cors({
    origin: (req) => {
      const origin = req.headers.get("origin");

      if (!origin) return true;
      if (/.*\.amiminn\.com$/.test(origin)) return true;
      if (origin.startsWith("http://localhost")) return true;
      if (origin.startsWith("http://127.0.0.1")) return true;

      return false;
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflight: true,
  })
);

// handle OPTIONS
app.options("/*", () => new Response(null, { status: 200 }));

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
