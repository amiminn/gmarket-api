import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Elysia, t } from "elysia";

export const authRoute = new Elysia({ prefix: "/auth" })

  .post("/login", AuthController.login, {
    body: t.Object({
      username: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
    }),
  })
  .post("/register", AuthController.register, {
    body: t.Object({
      username: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
      email: t.String({ minLength: 1 }),
      alamat: t.Optional(t.String()),
    }),
  })
  .get("/profile", AuthController.profile, { beforeHandle: authMiddleware })
  .put("/profile", AuthController.updateprodfile, {
    beforeHandle: authMiddleware,
    body: t.Object({
      email: t.String({ minLength: 1 }),
      alamat: t.Optional(t.String()),
    }),
  });
