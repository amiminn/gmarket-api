import { db } from "@/config/database";
import { ORDERSTATUS, ROLE, STATUS } from "@/generated/prisma/enums";

export const DashboardController = {
  index: async () => {
    const [customerAktif, customerInaktif, customerAllStatus] =
      await Promise.all([
        db.user.count({
          where: {
            role: ROLE.USER,
            status: STATUS.ACTIVE,
          },
        }),

        db.user.count({
          where: {
            role: ROLE.USER,
            status: STATUS.INACTIVE,
          },
        }),

        db.user.count({
          where: {
            role: ROLE.USER,
          },
        }),
      ]);

    const [product] = await Promise.all([
      db.product.count({
        where: {
          status: STATUS.ACTIVE,
        },
      }),
    ]);

    const [orderpaid, orderpending, allorder] = await Promise.all([
      db.order.count({
        where: {
          status: ORDERSTATUS.PAID,
        },
      }),

      db.order.count({
        where: {
          status: ORDERSTATUS.PENDING,
        },
      }),

      db.order.count(),
    ]);

    return {
      message: "data dashboard",
      data: {
        customer_active: customerAktif,
        customer_inactive: customerInaktif,
        customer_all: customerAllStatus,
        product,
        order_paid: orderpaid,
        order_pending: orderpending,
        order_all: allorder,
      },
    };
  },
};
