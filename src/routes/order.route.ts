import { OrderController } from "@/controllers/order.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import Elysia, { t } from "elysia";

export const orderRoute = new Elysia({ prefix: "/order" })
  .get("/", OrderController.index)
  .get("/list-order", OrderController.listOrder, {
    beforeHandle: authMiddleware,
  })
  .post("/new-order", OrderController.newOrder, {
    beforeHandle: authMiddleware,
    body: t.Object({
      listOrder: t.Array(
        t.Object({
          productId: t.Number(),
          qty: t.Number(),
        })
      ),
    }),
  })
  .post("/cancel-order", OrderController.cancelOrder, {
    beforeHandle: authMiddleware,
    body: t.Object({
      invoice: t.String(),
    }),
  })
  .get("/proccess-payment", OrderController.proccessPayment, {
    query: t.Object({
      invoice: t.String(),
      token: t.String(),
    }),
  })
  .get("/self-order", OrderController.selforder, {
    beforeHandle: authMiddleware,
  })
  .get("/detail-order/:invoice", OrderController.detailorder, {
    beforeHandle: authMiddleware,
    params: t.Object({
      invoice: t.String(),
    }),
  });
