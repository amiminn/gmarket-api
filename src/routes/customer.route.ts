import { CustomerController } from "@/controllers/customer.controller";
import Elysia from "elysia";

export const customerRoute = new Elysia({ prefix: "/customer" })
  .get("/", CustomerController.index)
  .get("/:id", CustomerController.show);
