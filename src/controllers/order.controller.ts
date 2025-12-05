import { db } from "@/config/database";
import { random, randomnum } from "@/config/string";
import { ORDERSTATUS } from "@/generated/prisma/enums";

export const OrderController = {
  index: async () => {
    const data =
      await db.$queryRaw`SELECT o.*, u.username FROM "order" o JOIN "users" u ON o."userId" = u.id`;
    return { message: "data order", data };
  },
  listOrder: async ({ store }: any) => {
    const data = await db.order.findMany({
      where: {
        userId: store.user.id,
      },
    });
    return { message: "data order", data };
  },
  newOrder: async ({ store, body, set }: any) => {
    const { listOrder } = body;

    if (listOrder.length == 0) {
      set.status = 400;
      return { message: "data order tidak boleh kosong." };
    }

    const totalpayment = listOrder.map(async (item: any) => {
      const res = await db.product.findFirst({
        where: {
          id: item.productId,
        },
      });

      return (res?.harga ?? 0) * (item.qty ?? 0);
    });

    const results = await Promise.all(totalpayment);
    const total = results.reduce((a, b) => a + b, 0);

    const dataorder = {
      userId: store.user.id,
      invoice: "INV" + +randomnum(5),
      status: ORDERSTATUS.PENDING,
      token: random(32),
      total,
    };

    const createdataorder = await db.order.create({
      data: dataorder,
    });

    if (createdataorder) {
      const dataorderitem = await Promise.all(
        listOrder.map(async (item: any) => {
          const cartItem = await db.cartItem.findFirst({
            where: { userId: store.user.id, productId: item.productId },
          });

          const product = await db.product.findFirst({
            where: { id: cartItem?.productId },
          });

          return {
            orderId: createdataorder.id,
            productId: item.productId,
            qty: item.qty,
            harga: (product?.harga ?? 0) * item.qty,
            ukuran: cartItem?.ukuran,
          };
        })
      );

      await db.orderItem.createMany({
        data: dataorderitem,
      });
    }

    await Promise.all(
      listOrder.map(async (item: any) => {
        await db.$queryRaw`
          DELETE FROM cart_item 
          WHERE "userId" = ${store.user.id} 
          AND "productId" = ${item.productId}
        `;

        await db.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stok: {
              decrement: item.qty,
            },
          },
        });
      })
    );

    return { message: "order berhasil dibuat.", data: createdataorder };
  },
  proccessPayment: async ({ query }: any) => {
    const { invoice, token } = query;

    const findOrder = await db.order.findFirst({
      where: {
        invoice,
        token,
      },
    });

    if (!findOrder) {
      return {
        message: "order tidak ditemukan.",
      };
    }

    const data = await db.order.update({
      where: {
        invoice,
        token,
      },
      data: {
        status: ORDERSTATUS.PAID,
      },
    });

    return { message: "order berhasil dibayarkan.", data };
  },
  cancelOrder: async ({ store, body, set }: any) => {
    const { invoice } = body;

    const order = await db.order.findFirst({
      where: {
        invoice,
        userId: store.user.id,
      },
    });

    if (!order) {
      set.status = 404;
      return { message: "Order tidak ditemukan." };
    }

    if (order.status === ORDERSTATUS.CANCELLED) {
      set.status = 404;
      return {
        message: "Oops, order tidak dapat dibatalkan, karena sudah dibatalkan.",
      };
    } else if (order.status === ORDERSTATUS.PAID) {
      set.status = 404;
      return {
        message: "Oops, order tidak dapat dibatalkan, karena sudah dibayarkan.",
      };
    } else if (order.status === ORDERSTATUS.FAILED) {
      set.status = 404;
      return {
        message: "Oops, order tidak dapat dibatalkan, karena gagal dibayarkan.",
      };
    }

    const orderItems = await db.orderItem.findMany({
      where: {
        orderId: order.id,
      },
    });

    await Promise.all(
      orderItems.map(async (item) => {
        await db.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stok: {
              increment: item.qty,
            },
          },
        });
      })
    );

    const updatedOrder = await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: ORDERSTATUS.CANCELLED,
      },
    });

    return {
      message: "Order berhasil dibatalkan.",
      data: updatedOrder,
    };
  },
  selforder: async ({ store }: any) => {
    const data = await db.order.findMany({
      where: {
        userId: store.user.id,
      },
    });
    return { message: "data order", data };
  },
  detailorder: async ({ params }: any) => {
    const { invoice } = params;
    const data = (await db.$queryRaw`SELECT o.*, jsonb_agg(
          jsonb_build_object( 'qty', oi.qty, 'nama', p.nama, 'harga', p.harga,
              'image', (
                  SELECT jsonb_agg(jsonb_build_object('url', pi.url))
                  FROM produk_image pi
                  WHERE pi."productId" = p.id
              )
          )
      ) AS listproduk FROM "order" o JOIN order_item oi ON oi."orderId" = o.id JOIN produk p ON p.id = oi."productId" WHERE o.invoice = ${invoice} GROUP BY o.id;`) as any[];
    return { message: "data order", data: data[0] };
  },
};
