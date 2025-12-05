import { DashboardController } from "@/controllers/dashboard.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import Elysia from "elysia";

export const dashboardRoute = new Elysia({ prefix: "/dashboard" }).get(
  "/",
  DashboardController.index,
  {
    beforeHandle: [authMiddleware],
  }
);
