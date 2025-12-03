import { db } from "@/config/database";
import { random } from "@/config/string";
import { STATUS } from "@/generated/prisma/enums";

export const UserController = {
  index: async ({ store }: any) => {
    console.log(store.user);
    const data = await db.user.findMany({
      where: {
        status: STATUS.ACTIVE,
      },
    });
    return {
      message: "list data user",
      data,
    };
  },

  show: async ({ params }: any) => {
    const { id } = params;
    const data = await db.user.findFirst({
      where: {
        id,
      },
    });
    return {
      message: "data user berhasil diambil.",
      data,
    };
  },

  delete: async ({ params }: any) => {
    const { id } = params;

    const finduser = await db.user.findFirst({
      where: {
        id,
      },
    });

    if (!finduser) {
      return { message: "user tidak ditemukan." };
    }

    const data = await db.user.update({
      where: {
        id,
      },
      data: {
        username: "by-" + random(5) + "-" + finduser.username,
        email: "by-" + random(5) + "-" + finduser.email,
        status: STATUS.INACTIVE,
      },
    });
    return { message: "data user berhasil dihapus.", data };
  },
};
