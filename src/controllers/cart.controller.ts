import { db } from "@/config/database";

export const CartController = {
  index: async ({ store }: any) => {
    const data = await db.cartItem.findMany({
      where: {
        userId: store.user.id,
      },
    });
    return { message: "data cart", data };
  },
  addCart: async ({ store, body, set }: any) => {
    const { productId, ukuran } = body;
    const findProduct = await db.product.findFirst({
      where: {
        id: productId as number,
      },
    });

    if (!findProduct) {
      set.status = 404;
      return { message: "Produk tidak ditemukan." };
    }

    const findCartItem = await db.cartItem.findFirst({
      where: {
        userId: store.user.id,
        productId: findProduct.id as number,
      },
    });

    if (findCartItem) {
      const data = await db.cartItem.updateMany({
        where: {
          userId: store.user.id,
          productId: findProduct.id as number,
        },
        data: {
          qty: findCartItem.qty + 1,
        },
      });
      return { message: "Data cart berhasil diupdate.", data };
    }

    const data = await db.cartItem.create({
      data: {
        userId: store.user.id,
        productId: findProduct.id as number,
        ukuran,
        qty: 1,
      },
    });
    return { message: "Data cart berhasil ditambah.", data };
  },
  updateQtyCart: async ({ store, body }: any) => {
    const { id, qty } = body;

    const findCartItem = await db.cartItem.findFirst({
      where: {
        userId: store.user.id,
        id,
      },
    });

    if (!findCartItem) {
      return { message: "data cart tidak ditemukan." };
    }

    const data = await db.cartItem.update({
      where: {
        userId: store.user.id,
        id: findCartItem.id,
      },
      data: {
        qty: qty as number,
      },
    });
    return { message: "data cart berhasil diupdate.", data };
  },
  deleteCart: async ({ store, params }: any) => {
    const { id } = params;
    const data = await db.cartItem.delete({
      where: {
        userId: store.user.id,
        id: id as number,
      },
    });
    return { message: "data cart berhasil dihapus.", data };
  },
};
