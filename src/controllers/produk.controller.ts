import { db } from "@/config/database";
import { env } from "@/config/env";
import { STATUS } from "@/generated/prisma/enums";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";

export const ProdukController = {
  index: async () => {
    const produk = await db.$queryRaw`
      SELECT  p.id, p.nama, p.harga, p.stok, p."kategoriId", p.status, p."createdAt", COALESCE(
          jsonb_agg(
            jsonb_build_object('url', pi.url)
          ) FILTER (WHERE pi.url IS NOT NULL),
          '[]'::jsonb
        ) AS gambar FROM produk p LEFT JOIN produk_image pi ON pi."productId" = p.id WHERE p.status = ${STATUS.ACTIVE} GROUP BY p.id`;
    return {
      data: produk,
    };
  },
  create: async ({ body, set }: any) => {
    const { nama, harga, stok, deskripsi, kategoriId } = body;

    const data = {
      nama,
      harga,
      stok,
      deskripsi,
      kategoriId,
      status: STATUS.ACTIVE,
    };

    const gambar = [];

    for (const file of body.gambar) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const filename = `${randomUUID()}.${ext}`;
      const path = `./public/uploads/${filename}`;

      gambar.push(`${env.APP_URL}/uploads/${filename}`);
      await writeFile(path, buffer);
    }

    try {
      const produk = await db.product.create({
        data,
      });
      await db.productImage.createMany({
        data: gambar.map((item) => {
          return {
            url: item,
            productId: produk.id,
          };
        }),
      });
      set.status = 201;
      return {
        message: "Berhasil menambahkan produk baru.",
        data,
      };
    } catch (error) {
      set.status = 500;
      return {
        message: "Oops, sepertinya ada kesalahan sistem.",
      };
    }
  },
  update: async ({ body, set, params }: any) => {
    const { nama, harga, stok, deskripsi, kategoriId } = body;
    const id = params.id;

    const data = {
      nama,
      harga,
      stok,
      deskripsi,
      kategoriId,
      status: STATUS.ACTIVE,
    };

    try {
      await db.product.update({
        data,
        where: {
          id,
        },
      });
      set.status = 201;
      return {
        message: "Berhasil update produk.",
        data,
      };
    } catch (error) {
      set.status = 500;
      return {
        message: "Oops, sepertinya ada kesalahan sistem.",
        error,
      };
    }
  },
  show: async ({ params }: any) => {
    const { id } = params;
    const produk = await db.$queryRaw`
    SELECT p.id, p.nama, p.harga, p.stok, p."kategoriId", p.status, p."createdAt",
      COALESCE(
        jsonb_agg(
          jsonb_build_object('url', pi.url)
        ) FILTER (WHERE pi.url IS NOT NULL),
        '[]'::jsonb
      ) AS gambar FROM produk p LEFT JOIN produk_image pi ON pi."productId" = p.id WHERE p.id = ${id} GROUP BY p.id;`;
    return {
      data: produk,
    };
  },
  delete: async ({ params }: any) => {
    const id = params.id;
    try {
      await db.product.update({
        data: {
          status: STATUS.INACTIVE,
        },
        where: {
          id,
        },
      });
      return {
        message: "Berhasil menghapus produk.",
      };
    } catch (error) {
      return {
        message: "Oops, sepertinya ada kesalahan sistem.",
        error,
      };
    }
  },
};
