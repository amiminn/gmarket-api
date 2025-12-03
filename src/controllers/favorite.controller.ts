import { db } from "@/config/database";
import { STATUS } from "@/generated/prisma/enums";

export const FavoriteController = {
  index: async ({ store }: any) => {
    const produk = await db.$queryRaw`
  SELECT p.id, p.nama, p.harga, p.stok, p."kategoriId", p.status, p."createdAt",
    COALESCE(
      jsonb_agg(
        jsonb_build_object('url', pi.url)
      ) FILTER (WHERE pi.url IS NOT NULL),
      '[]'::jsonb
    ) AS gambar
  FROM produk p
  LEFT JOIN produk_image pi ON pi."productId" = p.id
  WHERE 
    p.status = ${STATUS.ACTIVE}
    AND p.id IN (
      SELECT "productId" 
      FROM favorite 
      WHERE "userId" = ${store.user.id}
    )
  GROUP BY p.id,  p.nama, p.harga, p.stok, p."kategoriId", p.status, p."createdAt";`;

    return {
      data: produk,
    };
  },
  favhandler: async ({ store, body }: any) => {
    const { productId } = body;
    const findFav = await db.favorite.findFirst({
      where: {
        userId: store.user.id,
        productId: productId as number,
      },
    });

    if (findFav) {
      console.log(3);
      await db.favorite.deleteMany({
        where: {
          userId: store.user.id,
          productId: productId as number,
        },
      });

      return {
        message: "Produk favorite berhasil dihapus.",
      };
    }
    console.log(4);

    await db.favorite.create({
      data: {
        userId: store.user.id,
        productId: productId as number,
      },
    });
    console.log(5);

    return {
      message: "Produk favorite berhasil ditambah.",
    };
  },
};
