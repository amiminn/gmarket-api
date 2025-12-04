import { CartController } from "@/controllers/cart.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import Elysia, { t } from "elysia";

export const cartRoute = new Elysia({ prefix: "/cart" })
  .get("/", CartController.index, {
    beforeHandle: [authMiddleware],
  })
  .post("/addcart", CartController.addCart, {
    beforeHandle: [authMiddleware],
    body: t.Object({
      productId: t.Number(),
      ukuran: t.String(),
    }),
  })
  .post("/updateqty", CartController.updateQtyCart, {
    beforeHandle: [authMiddleware],
    body: t.Object({
      id: t.Number(),
      qty: t.Number(),
    }),
  })
  .delete("/deletecart/:id", CartController.deleteCart, {
    beforeHandle: [authMiddleware],
    params: t.Object({
      id: t.Numeric(),
    }),
  });
