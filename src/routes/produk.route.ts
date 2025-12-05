import { ProdukController } from "@/controllers/produk.controller";
import Elysia, { t } from "elysia";

export const produkRoute = new Elysia({ prefix: "/produk" })
  .get("/", ProdukController.index)
  .post("/", ProdukController.create, {
    body: t.Object({
      nama: t.String({ minLength: 1 }),
      harga: t.Numeric({ minLength: 1 }),
      stok: t.Numeric({ minLength: 1 }),
      deskripsi: t.String({ minLength: 1 }),
      kategoriId: t.Numeric({ minLength: 1 }),
      gambar: t.Files({
        error: () => ({
          message: "Harap sertakan gambar untuk detail produk.",
        }),
        minItems: 1,
        maxItems: 5,
        maxSize: 5 * 1024 * 1024,
        pattern: "image/*",
      }),
    }),
  })
  .put("/:id", ProdukController.update, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      nama: t.String({ minLength: 1 }),
      harga: t.Numeric({ minLength: 1 }),
      stok: t.Numeric({ minLength: 1 }),
      deskripsi: t.String({ minLength: 1 }),
      kategoriId: t.Numeric(),
      isUpdateThumbnail: t.String(),
      gambar: t.Optional(t.Files()),
    }),
  })
  .get("/:id", ProdukController.show, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .delete("/:id", ProdukController.delete, {
    params: t.Object({
      id: t.Numeric(),
    }),
  });
