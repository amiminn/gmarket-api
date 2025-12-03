import { FavoriteController } from "@/controllers/favorite.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import Elysia, { t } from "elysia";

export const favoriteRoute = new Elysia({ prefix: "/favorite" })
  .post("/", FavoriteController.favhandler, {
    beforeHandle: authMiddleware,
    body: t.Object({
      productId: t.Number(),
    }),
  })
  .get("/", FavoriteController.index, {
    beforeHandle: authMiddleware,
  });
