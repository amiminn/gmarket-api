import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Elysia, t } from "elysia";

export const authRoute = new Elysia({ prefix: "/auth" })

  .post("/login", AuthController.login, {
    body: t.Object({
      username: t.String().trim().notEmpty(),
      password: t.String().trim().notEmpty(),
    }),
  })
  .post("/register", AuthController.register, {
    body: t.Object({
      username: t.String().trim().notEmpty(),
      password: t.String().trim().notEmpty(),
      email: t.String().trim().notEmpty(),
      alamat: t.Optional(t.String()),
    }),
  })
  .get("/profile", AuthController.profile, { beforeHandle: authMiddleware })
  .put("/profile", AuthController.updateprodfile, {
    beforeHandle: authMiddleware,
    body: t.Object({
      email: t.String().trim().notEmpty(),
      alamat: t.Optional(t.String()),
    }),
  });
