import { KategoriController } from "@/controllers/kategori.controller";
import Elysia, { t } from "elysia";

export const kategoriRoute = new Elysia({ prefix: "/kategori" })
  .get("/", KategoriController.index)
  .post("/", KategoriController.create, {
    body: t.Object({
      nama: t.String({ minLength: 1 }),
      detail: t.String({ minLength: 1 }),
    }),
  })
  .put("/:id", KategoriController.update, {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      nama: t.String({ minLength: 1 }),
      detail: t.String({ minLength: 1 }),
    }),
  })
  .get("/:id", KategoriController.show, {
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/:id", KategoriController.delete, {
    params: t.Object({
      id: t.String(),
    }),
  });
