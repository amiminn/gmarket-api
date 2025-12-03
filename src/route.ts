import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { env } from "./config/env";
import { authRoute } from "./routes/auth.route";
import { cartRoute } from "./routes/cart.route";
import { favoriteRoute } from "./routes/favorite.route";
import { kategoriRoute } from "./routes/kategori.route";
import { orderRoute } from "./routes/order.route";
import { produkRoute } from "./routes/produk.route";
import { userRoute } from "./routes/user.route";

const router = new Elysia({ prefix: "/api" })
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
    })
  )
  .state("user", null);

router.get("/", () => {
  return { api: "GMarket-API" };
});

router.use(authRoute);
router.use(produkRoute);
router.use(favoriteRoute);
router.use(orderRoute);
router.use(cartRoute);
router.use(kategoriRoute);
router.use(userRoute);

export default router;
