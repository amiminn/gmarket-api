import { db } from "@/config/database";
import { ROLE, STATUS } from "@/generated/prisma/enums";

export const CustomerController = {
  index: async () => {
    const data = await db.user.findMany({
      where: {
        role: ROLE.USER,
        status: STATUS.ACTIVE,
      },
    });
    return {
      message: "data customer",
      data,
    };
  },
  show: async ({ params }: any) => {
    const { id } = params;
    const data = await db.user.findFirst({
      where: {
        role: ROLE.USER,
        status: STATUS.ACTIVE,
        id,
      },
    });
    return {
      message: "data customer",
      data,
    };
  },
};
