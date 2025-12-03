import { UserController } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import Elysia, { t } from "elysia";

export const userRoute = new Elysia({ prefix: "/users" })
  .get("/", UserController.index, {
    beforeHandle: [authMiddleware],
  })
  .get("/:id", UserController.show, {
    params: t.Object({
      id: t.Numeric(),
    }),
    beforeHandle: [authMiddleware],
  })
  .delete("/:id", UserController.delete, {
    params: t.Object({
      id: t.Numeric(),
    }),
    beforeHandle: [authMiddleware],
  });
