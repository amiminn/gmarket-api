import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { Elysia, t } from "elysia";

export const authRoute = new Elysia({ prefix: "/auth" })

  .post("/login", AuthController.login, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  })
  .post("/register", AuthController.register, {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      email: t.String(),
    }),
  })
  .get("/profile", AuthController.profile, { beforeHandle: authMiddleware })
  .put("/profile", AuthController.updateprodfile, {
    beforeHandle: authMiddleware,
    body: t.Object({
      email: t.String(),
    }),
  });
