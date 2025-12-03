import { db } from "@/config/database";

export const KategoriController = {
  index: async () => {
    const kategori = await db.kategori.findMany();
    return {
      data: kategori,
    };
  },
  create: async ({ body }: any) => {
    const { nama, detail } = body;
    const data = await db.kategori.create({
      data: {
        nama,
        detail,
      },
    });
    return {
      message: "data kategori berhasil ditambah.",
      data,
    };
  },
  show: async ({ params }: any) => {
    const id = parseInt(params.id);
    const kategori = await db.kategori.findFirst({
      where: {
        id,
      },
    });
    if (!kategori) {
      return {
        message: "data kategori tidak ditemukan",
      };
    }
    return {
      message: "data kategori berhasil diambil",
      data: kategori,
    };
  },
  update: async ({ body, params }: any) => {
    const id = parseInt(params.id);
    const { nama, detail } = body;
    const data = {
      nama,
      detail,
    };
    const kategori = await db.kategori.update({
      data,
      where: {
        id,
      },
    });
    if (!kategori) {
      return {
        message: "data kategori tidak ditemukan",
      };
    }
    return {
      message: "data kategori berhasil diupdate",
      data: kategori,
    };
  },
  delete: async ({ params }: any) => {
    const id = parseInt(params.id);
    const kategori = await db.kategori.delete({
      where: {
        id,
      },
    });
    if (!kategori) {
      return {
        message: "data kategori tidak ditemukan",
      };
    }
    return {
      message: "data kategori berhasil dihapus",
    };
  },
};
